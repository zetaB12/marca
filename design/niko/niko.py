"""Niko.exe — robot de N. Digital Studio, dibujado con piezas en una cuadrícula de 64×64.

Cada fotograma sale de las mismas piezas (cabeza, auriculares, cuerpo, brazos, piernas, cara),
solo cambia su posición o la expresión: por eso siempre es el mismo robot.
"""
import math, struct, zlib, pathlib

N = 64
# Paleta tomada de la hoja de referencia de Niko.
PAL = {
    'o': (0x15, 0x19, 0x2a),   # contorno
    'n': (0x20, 0x29, 0x3c),   # azul marino
    's': (0x4c, 0x57, 0x6f),   # azul grisáceo
    'b': (0x54, 0x64, 0x91),   # mochila
    'g': (0xc4, 0xb9, 0xba),   # gris claro
    'c': (0xf9, 0xeb, 0xdd),   # crema
    'd': (0xe1, 0xc4, 0xa7),   # arena (sombra del crema)
    'a': (0xf1, 0xae, 0x65),   # naranja
    'A': (0xfe, 0xdb, 0xab),   # naranja claro
    'k': (0x17, 0x1e, 0x32),   # pantalla
    'w': (0xe8, 0xf3, 0xff),   # luz de la cara
    'x': (0x7f, 0xa9, 0xe6),   # brillo azul de la cara
    'S': (0x20, 0x29, 0x3c),   # sombra del suelo (semitransparente)
}
SHADOW_ALPHA = 90


class Canvas:
    def __init__(self):
        self.g = [['.'] * N for _ in range(N)]

    def put(self, x, y, c):
        if 0 <= x < N and 0 <= y < N:
            self.g[y][x] = c

    def part(self, cells, color, shade=None, outline=True, clip=None):
        """Dibuja una pieza con contorno propio y sombreado automático abajo/derecha.

        `clip`: si se indica, el contorno solo se dibuja dentro de esa región (así una pieza
        pegada a otra no sobresale de su silueta).
        """
        cells = set(cells)
        if outline:
            for (x, y) in cells:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    n = (x + dx, y + dy)
                    if n not in cells and (clip is None or n in clip):
                        self.put(n[0], n[1], 'o')
        for (x, y) in cells:
            self.put(x, y, color)
        if shade:
            for (x, y) in cells:
                if (x + 1, y) not in cells or (x, y + 1) not in cells:
                    self.put(x, y, shade)
        return cells


def rrect(x0, y0, x1, y1, r):
    cells = set()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            cx = min(max(x, x0 + r), x1 - r)
            cy = min(max(y, y0 + r), y1 - r)
            if (x - cx) ** 2 + (y - cy) ** 2 <= (r + 0.45) ** 2:
                cells.add((x, y))
    return cells


def ellipse(cx, cy, rx, ry):
    return {(x, y) for y in range(N) for x in range(N)
            if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1}


def rect(x0, y0, x1, y1):
    return {(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)}


# Glifo "N" de 4×5 para las insignias (la diagonal evita que se lea como "H").
GLYPH_N = ["#..#", "##.#", "#.##", "#..#", "#..#"]
def glyph(cv, x0, y0, rows, color):
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == '#':
                cv.put(x0 + i, y0 + j, color)


def face(cv, kind):
    """Cara en la pantalla (x 15..48, y 14..30)."""
    def eye_arc(x0, y0):           # ^ grueso con brillo, como en la referencia
        for (dx, dy) in [(0, 3), (1, 2), (2, 1), (3, 0), (4, 0), (5, 1), (6, 2), (7, 3)]:
            cv.put(x0 + dx, y0 + dy, 'w')
            cv.put(x0 + dx, y0 + dy + 1, 'w')
        for (dx, dy) in [(0, 5), (7, 5)]:
            cv.put(x0 + dx, y0 + dy, 'x')
    def eye_dot(x0, y0, w=2, h=3):
        for j in range(h):
            for i in range(w):
                cv.put(x0 + i, y0 + j, 'w')
    if kind == 'happy':
        eye_arc(20, 19); eye_arc(36, 19)
    elif kind == 'idle':
        eye_dot(23, 20); eye_dot(39, 20)
    return cv


def niko_front(expression='happy', left_arm=(0, 0), right_arm=(0, 0)):
    """Niko de frente. `left_arm` / `right_arm` desplazan brazo y mano (dx, dy): sirven para
    levantar la mano, saludar o balancear los brazos al caminar sin redibujar nada."""
    cv = Canvas()
    # sombra del suelo
    for (x, y) in ellipse(32, 62, 15, 1.8):
        cv.put(x, y, 'S')

    # piernas y botas
    cv.part(rect(23, 51, 28, 56), 'n', 's')
    cv.part(rect(35, 51, 40, 56), 'n', 's')
    cv.part(rrect(21, 56, 30, 61, 2), 'c', 'd')
    cv.part(rrect(33, 56, 42, 61, 2), 'c', 'd')

    # sudadera (torso ancho)
    cv.part(rrect(18, 37, 45, 52, 3), 'c', 'd')
    for y in range(41, 51, 2):           # cremallera
        cv.put(31, y, 'g'); cv.put(32, y, 'g')
    for x in range(22, 42):              # bolsillo
        cv.put(x, 49, 'd')
    # capucha oscura: asoma bajo la cabeza
    cv.part(rrect(22, 34, 41, 40, 3), 'n', 's')
    # parche "N."
    cv.part(rect(36, 41, 43, 47), 'n', None, outline=False)
    glyph(cv, 37, 42, GLYPH_N, 'w'); cv.put(42, 46, 'a')

    # brazos separados del torso (hueco de 1 px) y manos: dejan margen para moverlos
    def arm(x0, d):
        dx, dy = d
        cv.part(rrect(x0 + dx, 38 + dy, x0 + 6 + dx, 49 + dy, 2), 'c', 'd')
        for x in range(x0 + 1 + dx, x0 + 6 + dx):
            cv.put(x, 47 + dy, 'd')       # puño
        cv.part(ellipse(x0 + 3.5 + dx, 52 + dy, 3, 2.8), 'c', 'd')
    arm(10, left_arm)
    arm(47, right_arm)

    # auriculares: placas finas pegadas a los lados de la cabeza (asoman 3 px por lado)
    for left in (True, False):
        x0 = 8 if left else 49
        cv.part(rrect(x0, 16, x0 + 6, 30, 3), 'd', None)                  # aro arena
        cv.part(rrect(x0 + 1, 17, x0 + 5, 29, 2), 'n', 's', outline=False)  # placa oscura
        ox = x0 + (1 if left else 4)
        for yy in (22, 23, 24):                                           # luz naranja
            cv.put(ox, yy, 'a'); cv.put(ox + 1, yy, 'a')
        cv.put(ox, 22, 'A')

    # cabeza compacta (carcasa 40×25)
    cv.part(rrect(12, 11, 51, 35, 6), 'c', 'd')
    for x in range(16, 48):              # reborde superior
        cv.put(x, 12, 'c')
    # pantalla (32×17)
    cv.part(rrect(16, 15, 47, 31, 3), 'k', None, outline=True)
    for (x, y) in [(42, 17), (43, 17), (43, 18), (44, 18)]:
        cv.put(x, y, 'x')                # reflejo
    face(cv, expression)

    # antena
    cv.part(rect(31, 6, 32, 10), 'n', None)
    cv.part(ellipse(31.5, 5, 2.8, 2.8), 'a', None)
    cv.put(30, 4, 'A'); cv.put(31, 3, 'A')
    return cv


def capsule(p0, p1, r):
    """Celdas a distancia <= r del segmento p0-p1 (miembros redondeados)."""
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    L2 = dx * dx + dy * dy or 1
    out = set()
    for y in range(N):
        for x in range(N):
            t = max(0, min(1, ((x + 0.5 - x0) * dx + (y + 0.5 - y0) * dy) / L2))
            px, py = x0 + t * dx, y0 + t * dy
            if (x + 0.5 - px) ** 2 + (y + 0.5 - py) ** 2 <= r * r:
                out.add((x, y))
    return out


def niko_side(i, frames=8, expression='idle'):
    """Niko de perfil mirando a la derecha: fotograma `i` de un ciclo de caminar de `frames` pasos.

    Mismo rig de piezas que la vista frontal. Las piernas se calculan con la fase del paso
    (zancada + elevación del pie que avanza) y los brazos balancean en sentido contrario.
    """
    t = i / frames
    c = math.cos(2 * math.pi * t)
    sn = math.sin(2 * math.pi * t)
    bob = round(math.cos(4 * math.pi * t))          # +1 en los apoyos, -1 al pasar el pie
    LIFT, STRIDE = 3.0, 6.0
    cv = Canvas()
    for (x, y) in ellipse(32, 62, 15, 1.8):
        cv.put(x, y, 'S')

    def leg(sign, far):
        fx = 31 + sign * STRIDE * c                      # posición del pie en x
        swing = max(0.0, -sn) if sign > 0 else max(0.0, sn)
        fy = 58.5 - LIFT * swing                         # el pie que avanza se eleva
        hip = (31, 49 + bob)
        pants, pshade, boot, bshade = ('s', 'n', 'd', 'g') if far else ('n', 's', 'c', 'd')
        cv.part(capsule(hip, (fx, fy - 2), 2.6), pants, pshade)
        foot = rrect(round(fx - 4), round(fy - 2.5), round(fx + 5), round(fy + 2.5), 2)
        cv.part(foot, boot, bshade)

    def arm(sign, far):
        ang = -sign * 0.5 * c                            # opuesto a la pierna del mismo lado
        sh = (31, 41 + bob)
        elbow = (sh[0] + 7 * math.sin(ang), sh[1] + 7 * math.cos(ang))
        hand = (sh[0] + 9.5 * math.sin(ang), sh[1] + 9.5 * math.cos(ang))
        body, cuff = ('d', 'g') if far else ('c', 'd')
        cv.part(capsule(sh, elbow, 2.6), body, cuff)
        cv.part(ellipse(hand[0], hand[1], 2.8, 2.7), body, cuff)

    # orden de dibujo: lo más lejano primero. Las piernas quedan debajo de la sudadera.
    leg(-1, True)
    arm(+1, True)
    cv.part(rrect(15, 38 + bob, 24, 49 + bob, 3), 'b', 's')         # mochila (detrás)
    cv.part(rect(16, 41 + bob, 19, 42 + bob), 's', None, outline=False)
    leg(+1, False)
    cv.part(rrect(23, 37 + bob, 38, 50 + bob, 3), 'c', 'd')         # sudadera (torso estrecho)
    for x in range(26, 36):
        cv.put(x, 48 + bob, 'd')                                     # bolsillo
    cv.part(rrect(24, 34 + bob, 37, 39 + bob, 3), 'n', 's')         # capucha oscura
    arm(-1, False)                                                   # brazo cercano, delante

    # cabeza de perfil: carcasa, pantalla al frente (derecha) y oreja pequeña en el centro
    cv.part(rrect(18, 11 + bob, 45, 35 + bob, 6), 'c', 'd')
    cv.part(rrect(37, 15 + bob, 44, 31 + bob, 3), 'k', None, outline=True)
    for yy in range(20, 26):                               # ojo (barra vertical)
        cv.put(40, yy + bob, 'w'); cv.put(41, yy + bob, 'w')
    cv.put(42, 17 + bob, 'x'); cv.put(42, 18 + bob, 'x')   # reflejo
    cv.part(rrect(25, 18 + bob, 32, 29 + bob, 3), 'd', None)
    cv.part(rrect(26, 19 + bob, 31, 28 + bob, 2), 'n', 's', outline=False)
    for yy in (23, 24):                                    # luz naranja
        cv.put(28, yy + bob, 'a'); cv.put(29, yy + bob, 'a')
    cv.put(28, 23 + bob, 'A')
    # antena
    cv.part(rect(30, 8 + bob, 31, 10 + bob), 'n', None)
    cv.part(ellipse(30.5, 6 + bob, 2.8, 2.8), 'a', None)
    cv.put(29, 5 + bob, 'A'); cv.put(30, 4 + bob, 'A')
    return cv


def mirror(cv):
    out = Canvas()
    out.g = [row[::-1] for row in cv.g]
    return out


def sheet(canvases, gap=0):
    n = len(canvases)
    rgba = [[(0, 0, 0, 0)] * (n * (N + gap) - gap) for _ in range(N)]
    for k, cv in enumerate(canvases):
        px = to_rgba(cv)
        for y in range(N):
            for x in range(N):
                rgba[y][k * (N + gap) + x] = px[y][x]
    return rgba


# ---------- exportación ----------
def to_rgba(cv):
    px = []
    for row in cv.g:
        r = []
        for ch in row:
            if ch == '.':
                r.append((0, 0, 0, 0))
            else:
                c = PAL[ch]
                r.append((*c, SHADOW_ALPHA if ch == 'S' else 255))
        px.append(r)
    return px


def write_png(path, rgba, scale=1):
    h = len(rgba) * scale; w = len(rgba[0]) * scale
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        row = rgba[y // scale]
        for x in range(w):
            raw += bytes(row[x // scale])
    def chunk(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(bytes(raw), 9)) + chunk(b'IEND', b'')
    pathlib.Path(path).write_bytes(png)


if __name__ == '__main__':
    out = pathlib.Path(__file__).parent
    cv = niko_front('happy')
    write_png(out / 'niko-idle-64.png', to_rgba(cv), 1)
    write_png(out / 'niko-idle-preview.png', to_rgba(cv), 8)
    walk = [niko_side(i) for i in range(8)]
    write_png(out / 'niko-walk-right-sheet.png', sheet(walk), 1)
    write_png(out / 'niko-walk-preview.png', sheet(walk, gap=2), 4)
    print('ok')
