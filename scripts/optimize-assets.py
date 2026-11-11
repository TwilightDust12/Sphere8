"""Run with Python 3 and Pillow 13+. Original photographs and logos are retained."""
from pathlib import Path
from PIL import Image

root = Path("public")
created = []
for source in (root / "images/projects").glob("[0-9][0-9]-[0-9][0-9].webp"):
    with Image.open(source) as image:
        for width in [320, 480]:
            if image.width <= width:
                continue
            thumbnail = image.copy()
            thumbnail.thumbnail(
                (width, round(image.height * width / image.width)),
                Image.Resampling.LANCZOS,
            )
            dest = source.with_stem(f"{source.stem}-{width}")
            thumbnail.save(dest, "WEBP", quality=80, method=6)
            created.append(dest)

for name, width in [("mark-black", 80), ("logo-black", 160)]:
    source = root / "brand" / f"{name}.png"
    with Image.open(source) as image:
        image.thumbnail(
            (width, round(image.height * width / image.width)),
            Image.Resampling.LANCZOS,
        )
        dest = source.with_suffix(".webp")
        image.save(dest, "WEBP", quality=90, method=6)
        created.append(dest)

for name in ["poster", "finished"]:
    source = root / "story/mobile" / f"{name}.webp"
    with Image.open(source) as image:
        dest = source.with_suffix(".avif")
        image.save(dest, "AVIF", quality=65, speed=6)
        created.append(dest)

print(f"Created {len(created)} optimized assets ({sum(p.stat().st_size for p in created):,} bytes). Originals retained.")
