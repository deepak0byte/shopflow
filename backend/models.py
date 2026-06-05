import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from db import Base


class Product(Base):
    __tablename__ = "products"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String(255), nullable=False)
    slug             = Column(String(255), unique=True, nullable=False)
    description      = Column(Text)
    price            = Column(Numeric(10, 2), nullable=False)
    compare_at_price = Column(Numeric(10, 2), nullable=True)
    stock            = Column(Integer, default=0)
    category         = Column(String(100))
    image_url        = Column(Text)
    sku              = Column(String(100), unique=True)
    is_active        = Column(Boolean, default=True)
    created_at       = Column(DateTime, default=datetime.utcnow)

    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id               = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number     = Column(String(20), unique=True, nullable=False)
    user_email       = Column(String(255), nullable=False, index=True)
    status           = Column(String(50), default="pending")
    subtotal         = Column(Numeric(10, 2), nullable=False)
    discount_amount  = Column(Numeric(10, 2), default=0)
    total            = Column(Numeric(10, 2), nullable=False)
    promo_code       = Column(String(50), nullable=True)
    shipping_address = Column(JSON, nullable=True)
    created_at       = Column(DateTime, default=datetime.utcnow)
    updated_at       = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items    = relationship("OrderItem", back_populates="order", lazy="select")
    payments = relationship("Payment",   back_populates="order", lazy="select")


class OrderItem(Base):
    __tablename__ = "order_items"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    order_id     = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id   = Column(Integer,    ForeignKey("products.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    quantity     = Column(Integer, nullable=False)
    unit_price   = Column(Numeric(10, 2), nullable=False)
    total_price  = Column(Numeric(10, 2), nullable=False)

    order   = relationship("Order",   back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Payment(Base):
    __tablename__ = "payments"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    order_id      = Column(String(36), ForeignKey("orders.id"), nullable=False)
    amount        = Column(Numeric(10, 2), nullable=False)
    currency      = Column(String(3), default="USD")
    status        = Column(String(50), nullable=False)
    payment_method = Column(String(50), default="card")
    processor_ref  = Column(String(255), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="payments")
