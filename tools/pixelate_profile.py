"""Foto de perfil estilo Windows 98: sin fondo, 4 grises, dithering ordenado (Bayer).
Uso: python tools/pixelate_profile.py [origen] [destino]
Solo necesita Pillow. Ajusta CROP, W/H y PALETTE para cambiar el resultado."""
import colorsys
import sys
from collections import deque
from PIL import Image, ImageFilter, ImageOps

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/image/profile.png'
DST = sys.argv[2] if len(sys.argv) > 2 else 'public/image/profile-98.png'
W, H = 96, 128
CROP = (180, 110, 180 + 1400, 110 + 1867)  # 3:4, cabeza y hombros (px del original)
PALETTE = [(32, 33, 36), (133, 133, 128), (212, 212, 206), (255, 255, 255)]  # tokens del sistema
SAT_BG, VAL_BG = 0.55, 0.28  # el fondo naranja es muy saturado; piel, pelo y polo no

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]

img = Image.open(SRC).convert('RGB').crop(CROP)

# 1) Máscara del sujeto: fondo = píxeles naranjas conectados con el borde.
mw, mh = CROP[2] - CROP[0], CROP[3] - CROP[1]
small = img.resize((mw // 6, mh // 6), Image.LANCZOS)
sw, sh = small.size
px = small.load()

def is_bg(x, y):
    r, g, b = px[x, y]
    _, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return s > SAT_BG and v > VAL_BG

bg = [[False] * sw for _ in range(sh)]
edge = [(x, y) for x in range(sw) for y in (0, sh - 1)] + [(x, y) for y in range(sh) for x in (0, sw - 1)]
queue = deque(p for p in edge if is_bg(*p))
for x, y in queue:
    bg[y][x] = True
while queue:
    x, y = queue.popleft()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < sw and 0 <= ny < sh and not bg[ny][nx] and is_bg(nx, ny):
            bg[ny][nx] = True
            queue.append((nx, ny))

mask = Image.new('L', (sw, sh))
mask.putdata([0 if bg[y][x] else 255 for y in range(sh) for x in range(sw)])
# Limpia ruido y suaviza el borde antes de reducir.
mask = mask.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MinFilter(3))
mask = mask.resize((W, H), Image.LANCZOS).point(lambda v: 255 if v > 127 else 0)

# 2) Gris con contraste ajustado solo sobre el sujeto.
gray = ImageOps.grayscale(img.resize((W, H), Image.LANCZOS))
subject = [v for v, m in zip(gray.get_flattened_data(), mask.get_flattened_data()) if m]
subject.sort()
lo, hi = subject[int(len(subject) * 0.02)], subject[int(len(subject) * 0.995)]
gamma = 1.35  # >1 oscurece medios tonos: el rostro conserva volumen
BLACK_CRUSH = 0.12  # por debajo de este nivel todo es negro sólido (polo, pelo)
levels = len(PALETTE) - 1

out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
op = out.load()
gp, mp = gray.load(), mask.load()
for y in range(H):
    for x in range(W):
        if not mp[x, y]:
            continue
        t = min(max((gp[x, y] - lo) / max(hi - lo, 1), 0), 1)
        t = (max(t - BLACK_CRUSH, 0) / (1 - BLACK_CRUSH)) ** gamma * levels
        base = int(t)
        frac = t - base
        threshold = (BAYER[y % 4][x % 4] + 0.5) / 16
        idx = min(base + (1 if frac > threshold else 0), levels)
        op[x, y] = (*PALETTE[idx], 255)

# 3) Polo: lo transparente que no es "cielo" (no conecta con el borde superior) queda negro,
# así bajo la curva de los hombros el marco cuadrado se ve lleno.
sky = [[False] * W for _ in range(H)]
seeds = [(x, 0) for x in range(W)] + [(x, y) for y in range(H // 2) for x in (0, W - 1)]
stack = [(x, y) for x, y in seeds if not op[x, y][3]]
for x, y in stack:
    sky[y][x] = True
while stack:
    x, y = stack.pop()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < W and 0 <= ny < H and not sky[ny][nx] and not op[nx, ny][3]:
            sky[ny][nx] = True
            stack.append((nx, ny))
for y in range(H):
    for x in range(W):
        if not op[x, y][3] and not sky[y][x]:
            op[x, y] = (*PALETTE[0], 255)

out.save(DST, optimize=True)
print(DST, out.size, 'colores:', len(PALETTE))
