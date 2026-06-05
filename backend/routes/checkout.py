"""
Checkout flow — processes cart items, applies promos, charges payment, creates order.

Known bugs (introduced during v1.2.x refactor):
  - Double charge: payment captured before order is persisted; retries re-charge the card.
  - Inventory oversell: stock check and decrement are not atomic under concurrent load.
  - Stuck orders: background fulfillment task never advances status to 'completed'.
"""
import time
import uuid
import random
import string
import threading
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Order, OrderItem, Payment, Product
from schemas import CheckoutIn, CheckoutOut
from routes.products import PROMO_CODES
import sentry_sdk

router = APIRouter(prefix="/checkout", tags=["checkout"])


def _generate_order_number() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"SF-{suffix}"


def _simulate_payment_gateway(amount: float, email: str) -> dict:
    """Simulates a payment processor (Stripe-like). Always succeeds in dev."""
    return {
        "status":        "succeeded",
        "processor_ref": f"ch_{uuid.uuid4().hex[:24]}",
        "amount":        amount,
        "currency":      "usd",
    }


def _fulfil_order(order_id: str, db_url: str) -> None:
    """
    Background worker: marks an order as fulfilled after processing.
    Runs in a daemon thread so it doesn't block the HTTP response.
    """
    time.sleep(4)

    from sqlalchemy import create_engine, text
    from sqlalchemy.orm import sessionmaker
    engine   = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
    Session  = sessionmaker(bind=engine)
    session  = Session()

    try:
        session.execute(
            text("UPDATE orders SET status = 'processing', updated_at = :now WHERE id = :id"),
            {"id": order_id, "now": datetime.utcnow()},
        )
        session.commit()
        # 🐛 BUG: status is set to 'processing' but never advances to 'completed'.
        # The second UPDATE (setting status='completed') was accidentally deleted
        # during the v1.2.3 refactor of the fulfillment worker.
        # All orders placed since that deploy stay in 'processing' indefinitely.
    except Exception as exc:
        sentry_sdk.capture_exception(exc)
        session.rollback()
    finally:
        session.close()


@router.post("", response_model=CheckoutOut, status_code=201)
def place_order(body: CheckoutIn, db: Session = Depends(get_db)):
    # ── 1. Validate cart ─────────────────────────────────────────────────────
    if not body.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    line_items = []
    subtotal   = 0.0

    for cart_item in body.items:
        product: Product | None = db.query(Product).filter(
            Product.id == cart_item.product_id,
            Product.is_active == True,  # noqa: E712
        ).first()

        if not product:
            raise HTTPException(status_code=404, detail=f"Product {cart_item.product_id} not found")

        # 🐛 BUG: Stock check is NOT atomic.
        # Two concurrent requests both read stock=1, both pass this guard,
        # then both decrement — stock goes to -1 (oversell).
        # Fix: use SELECT FOR UPDATE or a compare-and-swap UPDATE.
        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=409,
                detail=f"'{product.name}' only has {product.stock} unit(s) left",
            )

        time.sleep(0.06)  # simulates downstream inventory API latency — widens the race window

        product.stock -= cart_item.quantity
        line_total     = float(product.price) * cart_item.quantity
        subtotal      += line_total

        line_items.append({
            "product":     product,
            "quantity":    cart_item.quantity,
            "unit_price":  float(product.price),
            "total_price": line_total,
        })

    # ── 2. Apply promo ───────────────────────────────────────────────────────
    discount_amount = 0.0
    applied_promo   = None

    if body.promo_code:
        code  = body.promo_code.upper().strip()
        promo = PROMO_CODES.get(code)
        if promo:
            applied_promo = code
            if promo["type"] == "fixed":
                discount_amount = promo["value"]
            else:
                discount_amount = round(subtotal * promo["value"] / 100, 2)

    # 🐛 BUG (inherited from promo route): total adds discount instead of subtracting.
    total = round(subtotal + discount_amount, 2)

    # ── 3. Charge payment ────────────────────────────────────────────────────
    # 🐛 BUG: Payment is captured BEFORE the order row is committed to the DB.
    # If the INSERT below fails (DB timeout, constraint violation, network error),
    # the card is charged but no order record is created.
    # On client retry, payment is captured a second time — double charge.
    payment_result = _simulate_payment_gateway(total, body.user_email)

    # ── 4. Persist order ─────────────────────────────────────────────────────
    order_number = _generate_order_number()
    order        = Order(
        order_number=order_number,
        user_email=body.user_email,
        status="pending",
        subtotal=round(subtotal, 2),
        discount_amount=round(discount_amount, 2),
        total=total,
        promo_code=applied_promo,
        shipping_address=body.shipping_address.model_dump() if body.shipping_address else None,
    )
    db.add(order)
    db.flush()  # get order.id before inserting children

    for li in line_items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=li["product"].id,
            product_name=li["product"].name,
            quantity=li["quantity"],
            unit_price=li["unit_price"],
            total_price=li["total_price"],
        ))

    db.add(Payment(
        order_id=order.id,
        amount=total,
        currency="USD",
        status=payment_result["status"],
        payment_method="card",
        processor_ref=payment_result["processor_ref"],
    ))

    db.commit()
    db.refresh(order)

    # ── 5. Kick off async fulfilment ─────────────────────────────────────────
    import os
    db_url = os.getenv("DATABASE_URL", "sqlite:///./shopflow.db")
    threading.Thread(
        target=_fulfil_order,
        args=(order.id, db_url),
        daemon=True,
    ).start()

    return CheckoutOut(
        order_id=order.id,
        order_number=order.order_number,
        total=total,
        status=order.status,
        message="Order placed! You'll receive a confirmation email shortly.",
    )
