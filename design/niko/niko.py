"""Niko.exe — robot de Digital Studio, dibujado con piezas en una cuadrícula de 64×64.

Cada fotograma sale de las mismas piezas (cabeza, auriculares, cuerpo, brazos, piernas, cara),
solo cambia su posición o la expresión: por eso siempre es el mismo robot.
"""
import math, struct, zlib, pathlib

N = 64
# Cuánto baja el cuerpo (cabeza, torso, brazos) respecto a las piernas: acorta las piernas sin tocar las botas.
BODY_DROP = 3
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
        self.dy = 0   # desplazamiento vertical de lo que se dibuja (el cuerpo baja; las piernas no)

    def put(self, x, y, c):
        y += self.dy
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


# Glifo "N" pequeño (4×4) para la insignia del pecho.
GLYPH_N = ["#..#", "##.#", "#.##", "#..#"]   # 4×4: la diagonal evita que se lea como "H"
GLYPH_Z = {
    3: ["###", ".#.", "###"],
    4: ["####", "..#.", ".#..", "####"],
    5: ["#####", "...#.", "..#..", ".#...", "#####"],
}


def glyph(cv, x0, y0, rows, color):
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == '#':
                cv.put(x0 + i, y0 + j, color)


def face(cv, kind):
    """Cara en la pantalla (x 20..43, y 11..24)."""
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
        eye_arc(22, 14); eye_arc(34, 14)
    elif kind == 'idle':                 # ojos abiertos
        eye_dot(25, 15); eye_dot(37, 15)
    elif kind in ('blink', 'sleep'):     # ojos cerrados: párpado en curva suave (∪) de 6 px, centrado en el ojo
        for x0 in (23, 34):
            cv.put(x0, 16, 'w'); cv.put(x0 + 5, 16, 'w')
            for dx in range(1, 5):
                cv.put(x0 + dx, 17, 'w')
    elif kind == 'think':                # mira arriba y a la derecha, hacia la burbuja
        eye_dot(26, 13); eye_dot(38, 13)
        cv.put(26, 16, 'x'); cv.put(38, 16, 'x')
    return cv


def niko_front(expression='happy', left_arm=(0, 0), right_arm=(0, 0), bubble=None, lit=False, zs=(), breath=0):
    """Niko de frente, proporciones esbeltas: cabeza 30×20 sobre un torso de 22 px y piernas largas.
    `left_arm` / `right_arm` desplazan brazo y mano (dx, dy): sirven para levantar la mano o
    balancear los brazos al caminar sin redibujar nada."""
    cv = Canvas()
    # sombra del suelo
    for (x, y) in ellipse(32, 62, 13, 1.6):
        cv.put(x, y, 'S')

    # piernas y botas
    cv.part(rect(25, 46, 29, 56), 'n', 's')
    cv.part(rect(34, 46, 38, 56), 'n', 's')
    cv.part(rrect(22, 56, 30, 61, 2), 'c', 'd')
    cv.part(rrect(33, 56, 41, 61, 2), 'c', 'd')

    cv.dy = BODY_DROP + breath   # desde aquí, todo el cuerpo baja (breath: 1 px extra al respirar dormido)
    # sudadera (torso estrecho)
    cv.part(rrect(21, 29, 42, 47, 3), 'c', 'd')
    for y in range(33, 46, 2):           # cremallera
        cv.put(31, y, 'g'); cv.put(32, y, 'g')
    for x in range(24, 40):              # bolsillo
        cv.put(x, 44, 'd')
    # capucha oscura: asoma bajo la cabeza
    cv.part(rrect(24, 26, 39, 31, 3), 'n', 's')
    # parche "N."
    # parche cuadrado perfecto (8×8) con la "N." pequeña: letra 4×4 y punto, centrados en el cuadrado
    cv.part(rect(34, 33, 41, 40), 'n', None, outline=False)
    glyph(cv, 35, 35, GLYPH_N, 'w'); cv.put(40, 38, 'a')

    # brazos finos separados del torso (hueco de 1 px) y manos
    def arm(x0, d):
        dx, dy = d
        cv.part(rrect(x0 + dx, 30 + dy, x0 + 4 + dx, 43 + dy, 2), 'c', 'd')
        for x in range(x0 + 1 + dx, x0 + 4 + dx):
            cv.put(x, 41 + dy, 'd')       # puño
        cv.part(ellipse(x0 + 2.5 + dx, 45.5 + dy, 2.6, 2.4), 'c', 'd')
    arm(15, left_arm)
    arm(44, right_arm)

    # auriculares: placas finas pegadas a los lados de la cabeza (asoman 4 px por lado)
    for left in (True, False):
        x0 = 13 if left else 45
        cv.part(rrect(x0, 12, x0 + 5, 24, 2), 'd', None)
        cv.part(rrect(x0 + 1, 13, x0 + 4, 23, 1), 'n', 's', outline=False)
        ox = x0 + (1 if left else 3)
        for yy in (17, 18, 19):                                           # luz naranja
            cv.put(ox, yy, 'a'); cv.put(ox + 1, yy, 'a')
        cv.put(ox, 17, 'A')

    # cabeza compacta (carcasa 30×20)
    cv.part(rrect(17, 8, 46, 27, 5), 'c', 'd')
    for x in range(21, 43):              # reborde superior
        cv.put(x, 9, 'c')
    # pantalla (24×14)
    cv.part(rrect(20, 11, 43, 24, 3), 'k', None, outline=True)
    for (x, y) in [(39, 13), (40, 13), (40, 14), (41, 14)]:
        cv.put(x, y, 'x')                # reflejo
    face(cv, expression)

    # antena
    cv.part(rect(31, 4, 32, 7), 'n', None)
    cv.part(ellipse(31.5, 3, 2.6, 2.6), 'A' if lit else 'a', None)
    cv.put(30, 2, 'w' if lit else 'A'); cv.put(31, 1, 'w' if lit else 'A')

    # letras zZz al dormir (coordenadas absolutas): tamaños 3, 4 y 5 que suben hacia la esquina
    ZPOS = {3: (47, 10), 4: (51, 5), 5: (57, 0)}
    if zs:
        cv.dy = 0
        for size in zs:
            glyph(cv, *ZPOS[size], GLYPH_Z[size], 'w')

    # burbuja de pensamiento (coordenadas absolutas: no baja con el cuerpo). `bubble` = puntos visibles 0..3
    if bubble is not None:
        cv.dy = 0
        cv.part(ellipse(49.5, 13, 1.5, 1.5), 'w', 'x')
        cv.part(rrect(51, 1, 63, 11, 4), 'w', 'x')
        for k in range(bubble):
            for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)):
                cv.put(54 + 3 * k + dx, 5 + dy, 'n')
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

    Mismo rig de piezas que la vista frontal, con las proporciones esbeltas. Las piernas se calculan
    con la fase del paso (zancada + elevación del pie que avanza) y los brazos balancean en sentido
    contrario.
    """
    t = i / frames
    c = math.cos(2 * math.pi * t)
    sn = math.sin(2 * math.pi * t)
    bob = round(math.cos(4 * math.pi * t))          # +1 en los apoyos, -1 al pasar el pie
    LIFT, STRIDE = 3.0, 6.0
    cv = Canvas()
    for (x, y) in ellipse(32, 62, 13, 1.6):
        cv.put(x, y, 'S')
    cv.dy = BODY_DROP

    def leg(sign, far):
        cv.dy = 0                                        # las piernas no bajan con el cuerpo
        fx = 31 + sign * STRIDE * c                      # posición del pie en x
        swing = max(0.0, -sn) if sign > 0 else max(0.0, sn)
        fy = 58.5 - LIFT * swing                         # el pie que avanza se eleva
        hip = (31, 45 + BODY_DROP + bob)
        pants, pshade, boot, bshade = ('s', 'n', 'd', 'g') if far else ('n', 's', 'c', 'd')
        cv.part(capsule(hip, (fx, fy - 2), 2.3), pants, pshade)
        foot = rrect(round(fx - 4), round(fy - 2.5), round(fx + 5), round(fy + 2.5), 2)
        cv.part(foot, boot, bshade)
        cv.dy = BODY_DROP

    def arm(sign, far):
        ang = -sign * 0.5 * c                            # opuesto a la pierna del mismo lado
        sh = (31, 33 + bob)
        elbow = (sh[0] + 6 * math.sin(ang), sh[1] + 6 * math.cos(ang))
        hand = (sh[0] + 8.5 * math.sin(ang), sh[1] + 8.5 * math.cos(ang))
        body, cuff = ('d', 'g') if far else ('c', 'd')
        cv.part(capsule(sh, elbow, 2.1), body, cuff)
        cv.part(ellipse(hand[0], hand[1], 2.5, 2.4), body, cuff)

    # orden de dibujo: lo más lejano primero. Las piernas quedan debajo de la sudadera.
    leg(-1, True)
    arm(+1, True)
    cv.part(rrect(19, 30 + bob, 26, 44 + bob, 3), 'b', 's')         # mochila (detrás)
    cv.part(rect(20, 33 + bob, 22, 34 + bob), 's', None, outline=False)
    leg(+1, False)
    cv.part(rrect(25, 29 + bob, 38, 47 + bob, 3), 'c', 'd')         # sudadera (misma altura que de frente)
    for x in range(27, 36):
        cv.put(x, 44 + bob, 'd')                                     # bolsillo
    cv.part(rrect(26, 26 + bob, 37, 31 + bob, 3), 'n', 's')         # capucha oscura
    arm(-1, False)                                                   # brazo cercano, delante

    # cabeza de perfil: carcasa, pantalla al frente (derecha) y oreja pequeña en el centro
    cv.part(rrect(21, 8 + bob, 46, 27 + bob, 5), 'c', 'd')
    cv.part(rrect(38, 11 + bob, 45, 24 + bob, 3), 'k', None, outline=True)
    for yy in range(15, 21):                               # ojo (barra vertical)
        cv.put(41, yy + bob, 'w'); cv.put(42, yy + bob, 'w')
    cv.put(43, 13 + bob, 'x'); cv.put(43, 14 + bob, 'x')   # reflejo
    cv.part(rrect(27, 13 + bob, 33, 23 + bob, 3), 'd', None)
    cv.part(rrect(28, 14 + bob, 32, 22 + bob, 2), 'n', 's', outline=False)
    for yy in (17, 18):                                    # luz naranja
        cv.put(29, yy + bob, 'a'); cv.put(30, yy + bob, 'a')
    cv.put(29, 17 + bob, 'A')
    # antena
    cv.part(rect(32, 4 + bob, 33, 7 + bob), 'n', None)
    cv.part(ellipse(32.5, 3 + bob, 2.6, 2.6), 'a', None)
    cv.put(31, 2 + bob, 'A'); cv.put(32, 1 + bob, 'A')
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
    # Recursos que usa la app: src/assets/niko/{idle,walk-left,walk-right}.webp (sin pérdida).
    from PIL import Image
    def to_img(rgba):
        im = Image.new('RGBA', (len(rgba[0]), len(rgba)))
        im.putdata([px for row in rgba for px in row])
        return im
    assets = pathlib.Path(__file__).resolve().parents[2] / 'src' / 'assets' / 'niko'
    # Reposo: hoja de 3 fotogramas [ojos abiertos, parpadeo, contento]. Pensando: 4 fotogramas (0..3 puntos).
    idle_frames = [niko_front('idle'), niko_front('blink'), niko_front('happy')]
    think_frames = [niko_front('think', bubble=k, lit=bool(k % 2)) for k in range(4)]
    to_img(sheet(idle_frames)).save(assets / 'idle.webp', lossless=True, quality=100, method=6)
    to_img(sheet(think_frames)).save(assets / 'think.webp', lossless=True, quality=100, method=6)
    sleep_frames = [niko_front('sleep', zs=z, breath=b) for z, b in
                    (((3,), 0), ((3, 4), 1), ((3, 4, 5), 0), ((4, 5), 1))]
    to_img(sheet(sleep_frames)).save(assets / 'sleep.webp', lossless=True, quality=100, method=6)
    write_png(out / 'niko-sleep-preview.png', [[(px if px[3] else (11, 16, 32, 255)) for px in row] for row in sheet(sleep_frames, gap=2)], 4)
    write_png(out / 'niko-idle-sheet-preview.png', sheet(idle_frames, gap=2), 4)
    write_png(out / 'niko-think-preview.png', sheet(think_frames, gap=2), 4)
    to_img(sheet(walk)).save(assets / 'walk-right.webp', lossless=True, quality=100, method=6)
    to_img(sheet([mirror(f) for f in walk])).save(assets / 'walk-left.webp', lossless=True, quality=100, method=6)
    print('ok')
