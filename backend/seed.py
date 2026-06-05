"""Seed the database with demo products."""
from models import Product


PRODUCTS = [
    {
        "name":             "Sony WH-1000XM5 Headphones",
        "slug":             "sony-wh1000xm5",
        "description":      "Industry-leading noise cancelling with 30-hour battery life and crystal clear hands-free calling.",
        "price":            349.99,
        "compare_at_price": 399.99,
        "stock":            8,
        "category":         "Audio",
        "image_url":        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "sku":              "SONY-XM5-001",
    },
    {
        "name":             "Keychron K2 Mechanical Keyboard",
        "slug":             "keychron-k2",
        "description":      "Compact wireless mechanical keyboard with hot-swappable switches and RGB backlight.",
        "price":            89.99,
        "compare_at_price": None,
        "stock":            15,
        "category":         "Peripherals",
        "image_url":        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
        "sku":              "KYCH-K2-001",
    },
    {
        "name":             "Anker 7-in-1 USB-C Hub",
        "slug":             "anker-usbc-hub",
        "description":      "Expand your laptop with HDMI 4K, 3× USB-A, SD card, and 100W Power Delivery.",
        "price":            49.99,
        "compare_at_price": 59.99,
        "stock":            22,
        "category":         "Accessories",
        "image_url":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
        "sku":              "ANKR-HUB-001",
    },
    {
        "name":             "Logitech C922 Pro Webcam",
        "slug":             "logitech-c922",
        "description":      "Full HD 1080p 60fps streaming webcam with background removal and stereo microphone.",
        "price":            99.99,
        "compare_at_price": 129.99,
        "stock":            11,
        "category":         "Peripherals",
        "image_url":        "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&q=80",
        "sku":              "LOGI-C922-001",
    },
    {
        "name":             "Desk Pad Pro (90 × 45 cm)",
        "slug":             "desk-pad-pro",
        "description":      "Premium extended mouse pad with non-slip base and stitched edges. Only 1 left.",
        "price":            29.99,
        "compare_at_price": None,
        "stock":            1,
        "category":         "Accessories",
        "image_url":        "https://images.unsplash.com/photo-1593640408182-31c228fa45be?w=600&q=80",
        "sku":              "DSKP-PRO-001",
    },
    {
        "name":             "Ergotron LX Monitor Arm",
        "slug":             "ergotron-lx-arm",
        "description":      "Adjustable single monitor arm with full articulation. Supports monitors up to 34″ / 11 kg.",
        "price":            179.99,
        "compare_at_price": 199.99,
        "stock":            6,
        "category":         "Furniture",
        "image_url":        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
        "sku":              "ERGO-LX-001",
    },
    {
        "name":             "CalDigit TS4 Thunderbolt Dock",
        "slug":             "caldigit-ts4",
        "description":      "18 ports, 98W host charging, dual 6K display support. The last dock you'll ever buy.",
        "price":            249.99,
        "compare_at_price": None,
        "stock":            7,
        "category":         "Accessories",
        "image_url":        "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=600&q=80",
        "sku":              "CDIG-TS4-001",
    },
    {
        "name":             "Apple MagSafe Charger (1 m)",
        "slug":             "apple-magsafe-charger",
        "description":      "Magnetic fast wireless charging up to 15W for MagSafe-compatible iPhones.",
        "price":            39.99,
        "compare_at_price": None,
        "stock":            30,
        "category":         "Accessories",
        "image_url":        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
        "sku":              "AAPL-MGSF-001",
    },
    {
        "name":             "Autonomous ErgoChair Pro",
        "slug":             "autonomous-ergochair-pro",
        "description":      "Fully adjustable ergonomic office chair with lumbar support, recline, and armrests.",
        "price":            499.99,
        "compare_at_price": 599.99,
        "stock":            2,
        "category":         "Furniture",
        "image_url":        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80",
        "sku":              "AUTO-ECP-001",
    },
    {
        "name":             "Kensington Expert Trackball",
        "slug":             "kensington-trackball",
        "description":      "Large trackball with 4 programmable buttons and scroll ring. Reduces wrist strain.",
        "price":            69.99,
        "compare_at_price": None,
        "stock":            13,
        "category":         "Peripherals",
        "image_url":        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
        "sku":              "KENS-TRK-001",
    },
]


def run(db):
    for data in PRODUCTS:
        db.add(Product(**data))
    db.commit()
    print(f"✓ Seeded {len(PRODUCTS)} products")


if __name__ == "__main__":
    from db import SessionLocal, init_db
    init_db()
    session = SessionLocal()
    run(session)
    session.close()
