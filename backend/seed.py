"""Seed the database with demo products."""
from models import Product


PRODUCTS = [
    # ── Audio ───────────────────────────────────────────────────────────────
    {
        "name": "Sony WH-1000XM5 Headphones",
        "slug": "sony-wh1000xm5",
        "description": "Industry-leading noise cancelling with 30-hour battery life and crystal clear hands-free calling.",
        "price": 349.99, "compare_at_price": 399.99, "stock": 8,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "sku": "SONY-XM5-001",
    },
    {
        "name": "Apple AirPods Pro (2nd Gen)",
        "slug": "airpods-pro-2",
        "description": "Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.",
        "price": 249.99, "compare_at_price": 279.99, "stock": 14,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
        "sku": "AAPL-APP2-001",
    },
    {
        "name": "Rode NT-USB Mini Microphone",
        "slug": "rode-nt-usb-mini",
        "description": "Studio-quality USB condenser mic for podcasting, streaming, and remote work.",
        "price": 99.99, "compare_at_price": None, "stock": 9,
        "category": "Audio",
        "image_url": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
        "sku": "RODE-NTMINI-001",
    },
    # ── Peripherals ─────────────────────────────────────────────────────────
    {
        "name": "Keychron K2 Mechanical Keyboard",
        "slug": "keychron-k2",
        "description": "Compact wireless mechanical keyboard with hot-swappable switches and RGB backlight.",
        "price": 89.99, "compare_at_price": None, "stock": 15,
        "category": "Peripherals",
        "image_url": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
        "sku": "KYCH-K2-001",
    },
    {
        "name": "Logitech MX Master 3S Mouse",
        "slug": "logitech-mx-master-3s",
        "description": "Advanced wireless mouse with ultra-fast MagSpeed scrolling and ergonomic design.",
        "price": 99.99, "compare_at_price": 109.99, "stock": 18,
        "category": "Peripherals",
        "image_url": "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80",
        "sku": "LOGI-MXM3S-001",
    },
    {
        "name": "Logitech C922 Pro Webcam",
        "slug": "logitech-c922",
        "description": "Full HD 1080p 60fps streaming webcam with background removal and stereo microphone.",
        "price": 99.99, "compare_at_price": 129.99, "stock": 11,
        "category": "Peripherals",
        "image_url": "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&q=80",
        "sku": "LOGI-C922-001",
    },
    {
        "name": "Kensington Expert Trackball",
        "slug": "kensington-trackball",
        "description": "Large trackball with 4 programmable buttons and scroll ring. Reduces wrist strain.",
        "price": 69.99, "compare_at_price": None, "stock": 13,
        "category": "Peripherals",
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
        "sku": "KENS-TRK-001",
    },
    # ── Monitors ────────────────────────────────────────────────────────────
    {
        "name": "LG 27UK850-W 4K Monitor",
        "slug": "lg-27uk850",
        "description": "27-inch 4K UHD IPS display with USB-C, HDR10, and factory-calibrated colors.",
        "price": 449.99, "compare_at_price": 529.99, "stock": 5,
        "category": "Monitors",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
        "sku": "LG-27UK850-001",
    },
    {
        "name": "Dell S3222DGM Curved Gaming Monitor",
        "slug": "dell-s3222dgm",
        "description": "32-inch curved QHD gaming monitor with 165Hz refresh rate and 1ms response time.",
        "price": 379.99, "compare_at_price": 429.99, "stock": 4,
        "category": "Monitors",
        "image_url": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&q=80",
        "sku": "DELL-S3222-001",
    },
    # ── Accessories ─────────────────────────────────────────────────────────
    {
        "name": "Anker 7-in-1 USB-C Hub",
        "slug": "anker-usbc-hub",
        "description": "Expand your laptop with HDMI 4K, 3× USB-A, SD card, and 100W Power Delivery.",
        "price": 49.99, "compare_at_price": 59.99, "stock": 22,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
        "sku": "ANKR-HUB-001",
    },
    {
        "name": "Apple MagSafe Charger (1 m)",
        "slug": "apple-magsafe-charger",
        "description": "Magnetic fast wireless charging up to 15W for MagSafe-compatible iPhones.",
        "price": 39.99, "compare_at_price": None, "stock": 30,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
        "sku": "AAPL-MGSF-001",
    },
    {
        "name": "CalDigit TS4 Thunderbolt Dock",
        "slug": "caldigit-ts4",
        "description": "18 ports, 98W host charging, dual 6K display support. The last dock you'll ever buy.",
        "price": 249.99, "compare_at_price": None, "stock": 7,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=600&q=80",
        "sku": "CDIG-TS4-001",
    },
    {
        "name": "Desk Pad Pro (90 × 45 cm)",
        "slug": "desk-pad-pro",
        "description": "Premium extended mouse pad with non-slip base and stitched edges.",
        "price": 29.99, "compare_at_price": None, "stock": 1,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1593640408182-31c228fa45be?w=600&q=80",
        "sku": "DSKP-PRO-001",
    },
    {
        "name": "Baseus 65W GaN Charger",
        "slug": "baseus-65w-gan",
        "description": "4-port GaN charger (2× USB-C, 2× USB-A) — powers laptop, phone, and tablet simultaneously.",
        "price": 45.99, "compare_at_price": 55.99, "stock": 25,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
        "sku": "BASE-65W-001",
    },
    # ── Storage ─────────────────────────────────────────────────────────────
    {
        "name": "Samsung T7 Portable SSD 1TB",
        "slug": "samsung-t7-1tb",
        "description": "Up to 1,050MB/s read speed in a palm-sized, shock-resistant aluminum body.",
        "price": 89.99, "compare_at_price": 119.99, "stock": 16,
        "category": "Storage",
        "image_url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
        "sku": "SAMS-T7-1TB",
    },
    {
        "name": "WD My Passport 4TB",
        "slug": "wd-my-passport-4tb",
        "description": "Password-protected portable hard drive with hardware encryption and USB-C connectivity.",
        "price": 99.99, "compare_at_price": None, "stock": 12,
        "category": "Storage",
        "image_url": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80",
        "sku": "WD-MP-4TB-001",
    },
    # ── Furniture ───────────────────────────────────────────────────────────
    {
        "name": "Ergotron LX Monitor Arm",
        "slug": "ergotron-lx-arm",
        "description": "Adjustable single monitor arm with full articulation. Supports monitors up to 34″ / 11 kg.",
        "price": 179.99, "compare_at_price": 199.99, "stock": 6,
        "category": "Furniture",
        "image_url": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
        "sku": "ERGO-LX-001",
    },
    {
        "name": "Autonomous ErgoChair Pro",
        "slug": "autonomous-ergochair-pro",
        "description": "Fully adjustable ergonomic office chair with lumbar support, recline, and armrests.",
        "price": 499.99, "compare_at_price": 599.99, "stock": 2,
        "category": "Furniture",
        "image_url": "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80",
        "sku": "AUTO-ECP-001",
    },
    {
        "name": "FlexiSpot E7 Standing Desk",
        "slug": "flexispot-e7",
        "description": "Electric height-adjustable desk with dual motors, 355 lb capacity, and memory presets.",
        "price": 549.99, "compare_at_price": 649.99, "stock": 3,
        "category": "Furniture",
        "image_url": "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=600&q=80",
        "sku": "FLEX-E7-001",
    },
    # ── Gaming ──────────────────────────────────────────────────────────────
    {
        "name": "SteelSeries Arctis Nova Pro",
        "slug": "steelseries-arctis-nova-pro",
        "description": "Wireless gaming headset with active noise cancellation and 360° spatial audio.",
        "price": 349.99, "compare_at_price": 379.99, "stock": 7,
        "category": "Gaming",
        "image_url": "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=600&q=80",
        "sku": "SS-ANPRO-001",
    },
    {
        "name": "Razer DeathAdder V3 Pro",
        "slug": "razer-deathadder-v3-pro",
        "description": "Ultra-lightweight wireless gaming mouse with 30K DPI optical sensor.",
        "price": 149.99, "compare_at_price": 159.99, "stock": 10,
        "category": "Gaming",
        "image_url": "https://images.unsplash.com/photo-1563297007-0686b7370c7c?w=600&q=80",
        "sku": "RZRV3PRO-001",
    },
    {
        "name": "Xbox Elite Series 2 Controller",
        "slug": "xbox-elite-series-2",
        "description": "Pro gaming controller with adjustable-tension thumbsticks, wrap-around rubberized grip.",
        "price": 179.99, "compare_at_price": None, "stock": 5,
        "category": "Gaming",
        "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80",
        "sku": "XBOX-ELITE2-001",
    },
    # ── Lighting ────────────────────────────────────────────────────────────
    {
        "name": "Elgato Key Light Air",
        "slug": "elgato-key-light-air",
        "description": "Professional LED panel light, app-controlled, 1400 lumens — perfect for streaming setups.",
        "price": 129.99, "compare_at_price": 149.99, "stock": 11,
        "category": "Lighting",
        "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
        "sku": "ELGA-KLA-001",
    },
    {
        "name": "BenQ ScreenBar Halo",
        "slug": "benq-screenbar-halo",
        "description": "Monitor light bar with backlight, auto-dimming sensor, and wireless controller.",
        "price": 219.99, "compare_at_price": 249.99, "stock": 8,
        "category": "Lighting",
        "image_url": "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80",
        "sku": "BENQ-SBHALO-001",
    },
    # ── Smart Home ──────────────────────────────────────────────────────────
    {
        "name": "Philips Hue Starter Kit (4 bulbs)",
        "slug": "philips-hue-starter",
        "description": "Smart LED bulbs with Bridge — 16M colours, voice control, and automations.",
        "price": 199.99, "compare_at_price": 229.99, "stock": 9,
        "category": "Smart Home",
        "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
        "sku": "PHIL-HUE4-001",
    },
    {
        "name": "Amazon Echo Show 10 (3rd Gen)",
        "slug": "echo-show-10",
        "description": "Smart display with a 10.1-inch HD screen that rotates to keep you in frame.",
        "price": 249.99, "compare_at_price": None, "stock": 6,
        "category": "Smart Home",
        "image_url": "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=600&q=80",
        "sku": "AMZN-ES10-001",
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
