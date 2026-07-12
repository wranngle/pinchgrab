#!/usr/bin/env python3
"""Render the canonical PinchGrab pinch mark + regenerate the wordmarks.

The brand pinch is the Segoe UI Emoji "pinching hand" (U+1F90F) — the SAME
glyph the extension toolbar icon uses. Every other vendor renders 🤏 as a
different hand, which is how the wordmark drifted off-brand from the icon.
This script pins the pinch to one committed source and swaps it into the
(transparent-background) wordmark variants so they can never drift again.

  docs/brand/pinch-mark.png          <- canonical pinch (transparent, high-res)
  docs/brand/pinchgrab-wordmark*.png <- text + canonical pinch, recomposited

Composed/dark-background assets (feature-banner, noodle-festival, store
assets) are NOT touched here — a blind hand-swap destroys their layout, and
the store assets are regenerated from live captures anyway. Use pinch-mark.png
as the source when re-rendering those.

Requires Pillow >= 9 (color-emoji / COLR support). The font defaults to the
Windows Segoe UI Emoji path; override with PINCH_FONT for another host.

  python3 scripts/render-brand-pinch.py
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

FONT = os.environ.get("PINCH_FONT", "/mnt/c/Windows/Fonts/seguiemj.ttf")
ROOT = os.path.join(os.path.dirname(__file__), "..")
BRAND = os.path.join(ROOT, "docs", "brand")
PINCH = "\U0001F90F"


def render_pinch(px: int = 1024) -> Image.Image:
    """Render the Segoe pinch glyph, tight-cropped, on transparency."""
    if not os.path.exists(FONT):
        sys.exit(f"font not found: {FONT} (set PINCH_FONT to a Segoe UI Emoji .ttf)")
    canvas = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(FONT, int(px * 0.8))
    draw.text((px // 2, px // 2), PINCH, font=font, embedded_color=True, anchor="mm")
    bbox = canvas.getbbox()
    if not bbox:
        sys.exit("glyph rendered empty — is this a color-emoji font?")
    return canvas.crop(bbox)


def solid_bbox(im: Image.Image, x_limit: int) -> tuple[int, int, int, int]:
    """Bounding box of solid content left of x_limit (the old hand)."""
    px = im.load()
    w, h = im.size
    mnx = mny = 10 ** 9
    mxx = mxy = -1
    for y in range(h):
        for x in range(min(x_limit, w)):
            if px[x, y][3] > 60:
                mnx, mxx = min(mnx, x), max(mxx, x)
                mny, mxy = min(mny, y), max(mxy, y)
    return mnx, mny, mxx, mxy


def main() -> None:
    pinch = render_pinch()
    pinch.save(os.path.join(BRAND, "pinch-mark.png"))
    print(f"pinch-mark.png {pinch.size}")

    for variant in ("pinchgrab-wordmark", "pinchgrab-wordmark-dark", "pinchgrab-wordmark-light"):
        path = os.path.join(BRAND, f"{variant}.png")
        wm = Image.open(path).convert("RGBA")
        w, h = wm.size
        bx0, by0, bx1, by1 = solid_bbox(wm, 720)
        hh = by1 - by0
        # Clear the old hand + its glow up to (but short of) the text (~x=745).
        wm.paste(Image.new("RGBA", (715, h), (0, 0, 0, 0)), (0, 0))
        scale = hh / pinch.height
        hand = pinch.resize((int(pinch.width * scale), int(pinch.height * scale)), Image.LANCZOS)
        cx, cy = (bx0 + bx1) // 2, (by0 + by1) // 2
        wm.alpha_composite(hand, (cx - hand.width // 2, cy - hand.height // 2))
        wm.save(path)
        print(f"{variant}.png hand -> {hand.size}")


if __name__ == "__main__":
    main()
