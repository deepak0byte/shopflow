from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# ── Products ──────────────────────────────────────────────────────────────────

class ProductOut(BaseModel):
    id:               int
    name:             str
    slug:             str
    description:      Optional[str]
    price:            float
    compare_at_price: Optional[float]
    stock:            int
    category:         Optional[str]
    image_url:        Optional[str]
    sku:              Optional[str]

    class Config:
        from_attributes = True


# ── Checkout ──────────────────────────────────────────────────────────────────

class CartItemIn(BaseModel):
    product_id: int
    quantity:   int


class ShippingAddress(BaseModel):
    full_name: str
    address:   str
    city:      str
    state:     str
    zip_code:  str
    country:   str = "US"


class CheckoutIn(BaseModel):
    user_email:       str
    items:            list[CartItemIn]
    promo_code:       Optional[str] = None
    shipping_address: Optional[ShippingAddress] = None


class PromoCheckIn(BaseModel):
    code:     str
    subtotal: float


class PromoCheckOut(BaseModel):
    code:            str
    discount_type:   str
    discount_value:  float
    discount_amount: float
    final_total:     float


# ── Orders ────────────────────────────────────────────────────────────────────

class OrderItemOut(BaseModel):
    product_id:   int
    product_name: str
    quantity:     int
    unit_price:   float
    total_price:  float

    class Config:
        from_attributes = True


class PaymentOut(BaseModel):
    id:             int
    amount:         float
    status:         str
    payment_method: str
    created_at:     datetime

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id:              str
    order_number:    str
    user_email:      str
    status:          str
    subtotal:        float
    discount_amount: float
    total:           float
    promo_code:      Optional[str]
    created_at:      datetime
    items:           list[OrderItemOut] = []
    payments:        list[PaymentOut]   = []

    class Config:
        from_attributes = True


class CheckoutOut(BaseModel):
    order_id:     str
    order_number: str
    total:        float
    status:       str
    message:      str
