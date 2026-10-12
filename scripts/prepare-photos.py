#!/usr/bin/env python3
"""Copy the curated gallery photos into public/images/projects.

Reads WebP files (max 1600px) made earlier into assets/extracted/web and writes
the full file plus an 800px-wide variant when the original is wider than 800px.
Run from the repository root:  python3 -I scripts/prepare-photos.py
"""
import shutil
from pathlib import Path

from PIL import Image

SRC = Path("assets/extracted/web")
OUT = Path("public/images/projects")
IDS = """
04-04 05-07 16-04 02-03 29-08 09-04 22-04 15-05 06-03 20-04 30-03 03-07 14-03
23-10 10-04 31-06 07-10 15-03 21-09 33-07 11-07 17-04 03-11 32-06 13-08 31-04
""".split()

OUT.mkdir(parents=True, exist_ok=True)
for photo_id in IDS:
    source = SRC / f"{photo_id}.webp"
    if not source.exists():
        raise SystemExit(f"missing source image: {source}")
    shutil.copyfile(source, OUT / f"{photo_id}.webp")
    with Image.open(source) as im:
        width, height = im.size
        if width > 800:
            small = im.resize((800, round(height * 800 / width)), Image.LANCZOS)
            small.save(OUT / f"{photo_id}-800.webp", "WEBP", quality=80, method=4)
print(f"prepared {len(IDS)} photos in {OUT}")
