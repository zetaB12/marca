"""Genera favicon e iconos a partir de public/logo-neal.webp (marca negra sobre fondo blanco).

Salidas en public/:
  favicon.ico (16/32/48), favicon-16.png, favicon-32.png, favicon-48.png
  apple-touch-icon.png  180 px, fondo blanco sin transparencia (iOS aplica su máscara)
  icon-192.png, icon-512.png  fondo blanco con esquinas redondeadas
  icon-512-square.png   cuadrado completo, fondo blanco
Uso: python tools/make_icons.py   (requiere Pillow)
"""
import pathlib
from PIL import Image, ImageChops

ROOT = pathlib.Path(__file__).resolve().parents[1] / 'public'
SS = 4


def load_mark():
    """Marca recortada a su caja, como máscara alfa (negro = opaco)."""
    src = Image.open(ROOT / 'logo-neal.webp').convert('L')
    alpha = ImageChops.invert(src)
    alpha = alpha.point(lambda v: 0 if v < 8 else min(255, int(v * 255 / 247)))
    return alpha.crop(alpha.point(lambda v: 255 if v > 40 else 0).getbbox())


MARK = load_mark()


def render(size, pad, rounded=False, transparent=False):
    """pad = margen alrededor de la marca como fracción del lado."""
    s = size * SS
    inner = s * (1 - 2 * pad)
    k = inner / max(MARK.size)
    m = MARK.resize((max(1, round(MARK.width * k)), max(1, round(MARK.height * k))), Image.LANCZOS)
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0) if transparent else (255, 255, 255, 255))
    black = Image.new('RGBA', m.size, (0, 0, 0, 255))
    img.paste(black, ((s - m.width) // 2, (s - m.height) // 2), m)
    if rounded:
        from PIL import ImageDraw
        mask = Image.new('L', (s, s), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, s - 1, s - 1), radius=s * 0.22, fill=255)
        img.putalpha(ImageChops.multiply(img.getchannel('A'), mask))
    return img.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    for n in (16, 32, 48):  # favicon: marca grande, fondo transparente
        render(n, 0.04, transparent=True).save(ROOT / f'favicon-{n}.png', optimize=True)
    render(256, 0.04, transparent=True).save(ROOT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    render(180, 0.20).convert('RGB').save(ROOT / 'apple-touch-icon.png', optimize=True)
    render(192, 0.20, rounded=True).save(ROOT / 'icon-192.png', optimize=True)
    render(512, 0.20, rounded=True).save(ROOT / 'icon-512.png', optimize=True)
    render(512, 0.20).convert('RGB').save(ROOT / 'icon-512-square.png', optimize=True)
    print('ok')
