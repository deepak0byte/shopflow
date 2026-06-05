import sentry_sdk
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Product
from schemas import ProductOut, PromoCheckIn, PromoCheckOut

router = APIRouter(prefix="/products", tags=["products"])

PROMO_CODES: dict[str, dict] = {
    "SAVE10":  {"type": "fixed",      "value": 10.0},
    "SAVE20":  {"type": "fixed",      "value": 20.0},
    "HALFOFF": {"type": "percentage", "value": 50.0},
    "WELCOME": {"type": "fixed",      "value": 15.0},
}


@router.get("", response_model=list[ProductOut])
def list_products(category: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Product).filter(Product.is_active == True)  # noqa: E712
    if category:
        q = q.filter(Product.category == category)
    return q.order_by(Product.id).all()


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()  # noqa: E712
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/promo/validate", response_model=PromoCheckOut)
def validate_promo(body: PromoCheckIn):
    """
    Validates a promo code and returns the discounted total.
    """
    code = body.code.upper().strip()
    promo = PROMO_CODES.get(code)
    if not promo:
        raise HTTPException(status_code=400, detail="Invalid or expired promo code")

    subtotal = body.subtotal

    if promo["type"] == "fixed":
        discount_amount = promo["value"]
    else:
        discount_amount = round(subtotal * promo["value"] / 100, 2)

    # 🐛 BUG: final_total adds discount instead of subtracting it.
    # Every user applying a promo code pays MORE, not less.
    # Introduced in PR #47 "refactor promo engine to support percentage codes".
    final_total = round(subtotal + discount_amount, 2)

    if final_total > subtotal:
        with sentry_sdk.new_scope() as scope:
            scope.set_tag("bug_type", "promo_math")
            scope.set_context("promo_debug", {
                "code": code,
                "subtotal": subtotal,
                "discount_amount": discount_amount,
                "final_total": final_total,
                "expected_total": round(subtotal - discount_amount, 2),
            })
            sentry_sdk.capture_message(
                f"PromoCodeBug: code '{code}' raised total from ${subtotal:.2f} → ${final_total:.2f} (should be ${round(subtotal - discount_amount, 2):.2f})",
                level="error",
                scope=scope,
            )

    return PromoCheckOut(
        code=code,
        discount_type=promo["type"],
        discount_value=promo["value"],
        discount_amount=discount_amount,
        final_total=final_total,
    )
