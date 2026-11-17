"""Genera los iconos raster a partir del favicon vectorial actual (public/favicon-square.svg).

El SVG es la fuente de verdad; este script solo redibuja la misma geometría (cuadrado con degradado,
"N." blanca) para los formatos que lo necesitan:
  public/favicon.ico            16/32/48 px
  public/apple-touch-icon.png   180 px, sin esquinas redondeadas (iOS aplica su propia máscara)
  public/icon-192.png, icon-512.png   esquinas redondeadas, fondo transparente (también sirve para og:image)
Uso: python tools/make_icons.py   (requiere Pillow)
"""
import pathlib
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parents[1] / 'public'
SS = 8  # supersampling para bordes limpios

N_POLY = [(13, 46), (13, 18), (21.5, 18), (30, 32.4), (30, 18), (39, 18), (39, 46), (30.5, 46), (22, 31.6), (22, 46)]
DOT = (43, 39, 50, 46)


def render(size, rounded=True):
    s = size * SS
    k = s / 64
    # degradado diagonal #2e2e2e -> #000 (misma dirección que el SVG: de arriba-izquierda a abajo-derecha)
    grad = Image.new('RGB', (s, s))
    px = grad.load()
    for y in range(s):
        for x in range(s):
            t = (x + y) / (2 * (s - 1))
            v = round_(0x2e * (1 - t))
            px[x, y] = (v, v, v)
    mask = Image.new('L', (s, s), 0)
    d = ImageDraw.Draw(mask)
    if rounded:
        d.rounded_rectangle((0, 0, s - 1, s - 1), radius=14 * k, fill=255)
    else:
        d.rectangle((0, 0, s, s), fill=255)
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    img.paste(grad, (0, 0), mask)
    dd = ImageDraw.Draw(img)
    dd.polygon([(x * k, y * k) for x, y in N_POLY], fill=(255, 255, 255, 255))
    dd.rectangle([DOT[0] * k, DOT[1] * k, DOT[2] * k - 1, DOT[3] * k - 1], fill=(255, 255, 255, 255))
    return img.resize((size, size), Image.LANCZOS)


def round_(v):
    return int(v + 0.5)


if __name__ == '__main__':
    render(512).save(ROOT / 'icon-512.png', optimize=True)
    render(192).save(ROOT / 'icon-192.png', optimize=True)
    render(180, rounded=False).convert('RGB').save(ROOT / 'apple-touch-icon.png', optimize=True)
    render(48).save(ROOT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    print('ok')
