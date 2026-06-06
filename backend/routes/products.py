import sentry_sdk
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
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
def list_products(
    category: str | None = None,
    sort_by: str | None = None,
    search: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    in_stock: bool | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Product).filter(Product.is_active == True)  # noqa: E712

    if category:
        q = q.filter(Product.category == category)
    if search:
        term = f"%{search}%"
        q = q.filter(Product.name.ilike(term) | Product.description.ilike(term))
    if in_stock:
        q = q.filter(Product.stock > 0)

    if sort_by == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        q = q.order_by(Product.price.desc())
    elif sort_by == "name":
        q = q.order_by(Product.name.asc())
    elif sort_by == "newest":
        q = q.order_by(Product.id.desc())
    else:
        q = q.order_by(Product.id.asc())

    products = q.all()

    # Apply price range filter in-memory after DB fetch
    if price_min is not None:
        products = [p for p in products if p.price >= price_min]
    if price_max is not None:
        products = [p for p in products if p.price <= price_max]

    # Sort by discount percentage (best deals first)
    if sort_by == "discount":
        products.sort(
            key=lambda p: (p.compare_at_price - p.price) / p.compare_at_price,
            reverse=True,
        )

    return products


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(Product.category)
        .filter(Product.is_active == True, Product.category.isnot(None))  # noqa: E712
        .distinct()
        .order_by(Product.category)
        .all()
    )
    return [r.category for r in rows]


@router.get("/stats")
def product_stats(db: Session = Depends(get_db)):
    base = db.query(Product).filter(Product.is_active == True)  # noqa: E712
    total     = base.count()
    in_stock  = base.filter(Product.stock > 0).count()
    avg_price = db.query(func.avg(Product.price)).filter(Product.is_active == True).scalar()  # noqa: E712
    min_price = db.query(func.min(Product.price)).filter(Product.is_active == True).scalar()  # noqa: E712
    max_price = db.query(func.max(Product.price)).filter(Product.is_active == True).scalar()  # noqa: E712

    by_category = (
        db.query(Product.category, func.count(Product.id).label("count"))
        .filter(Product.is_active == True)  # noqa: E712
        .group_by(Product.category)
        .all()
    )

    on_sale = base.filter(Product.compare_at_price.isnot(None)).count()

    return {
        "total_products":  total,
        "in_stock":        in_stock,
        "out_of_stock":    total - in_stock,
        "on_sale":         on_sale,
        "avg_price":       round(float(avg_price or 0), 2),
        "min_price":       round(float(min_price or 0), 2),
        "max_price":       round(float(max_price or 0), 2),
        "by_category":     {row.category or "Uncategorized": row.count for row in by_category},
    }


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.slug == slug, Product.is_active == True  # noqa: E712
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/promo/validate", response_model=PromoCheckOut)
def validate_promo(body: PromoCheckIn):
    code  = body.code.upper().strip()
    promo = PROMO_CODES.get(code)
    if not promo:
        raise HTTPException(status_code=400, detail="Invalid or expired promo code")

    subtotal = body.subtotal

    if promo["type"] == "fixed":
        discount_amount = promo["value"]
    else:
        discount_amount = round(subtotal * promo["value"] / 100, 2)

    savings_pct = round((discount_amount / body.subtotal) * 100)

    # 🐛 BUG: final_total adds discount instead of subtracting it.
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
