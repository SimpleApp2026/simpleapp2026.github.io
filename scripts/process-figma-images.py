#!/usr/bin/env python3
"""Process Figma-exported images into clean app assets.
- Flood-fill background removal (from image borders, so enclosed regions survive)
- Badge sheet cropping (2x2 and 1x3 grids)
- Circular avatar masking
- Logo white->transparent
"""
from PIL import Image, ImageDraw, ImageFilter
from collections import deque
import os, sys

SRC = '/home/mint/Documentos/repositorios/figma/images-figma'
OUT = '/home/mint/Documentos/repositorios/figma/src/assets/img'
os.makedirs(OUT, exist_ok=True)

def dist2(a, b):
    return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2

def flood_transparent(im, key=None, tol=40, feather=True):
    """Remove the border-connected background (color ~key) -> alpha 0."""
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    if key is None:  # sample the 4 corners, use average
        cs = [px[0,0], px[w-1,0], px[0,h-1], px[w-1,h-1]]
        key = tuple(sum(c[i] for c in cs)//4 for i in range(3))
    tol2 = tol*tol
    seen = bytearray(w*h)
    q = deque()
    for x in range(w):
        for y in (0, h-1):
            if dist2(px[x,y], key) < tol2 and not seen[y*w+x]:
                seen[y*w+x] = 1; q.append((x,y))
    for y in range(h):
        for x in (0, w-1):
            if dist2(px[x,y], key) < tol2 and not seen[y*w+x]:
                seen[y*w+x] = 1; q.append((x,y))
    while q:
        x, y = q.popleft()
        px[x,y] = (0,0,0,0)
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx]:
                if dist2(px[nx,ny], key) < tol2:
                    seen[ny*w+nx] = 1; q.append((nx,ny))
    if feather:  # soften the cut edge slightly
        alpha = im.getchannel('A').filter(ImageFilter.GaussianBlur(0.8))
        im.putalpha(alpha)
    return im

def trim(im, pad=6):
    bbox = im.getchannel('A').getbbox()
    if bbox:
        l, t, r, b = bbox
        w, h = im.size
        im = im.crop((max(0,l-pad), max(0,t-pad), min(w,r+pad), min(h,b+pad)))
    return im

def save_png(im, name, maxside=None):
    if maxside and max(im.size) > maxside:
        im.thumbnail((maxside, maxside), Image.LANCZOS)
    im.save(os.path.join(OUT, name), 'PNG', optimize=True)
    print('wrote', name, im.size)

def save_jpg(im, name, maxw=None, q=85):
    if maxw and im.width > maxw:
        im = im.resize((maxw, round(im.height*maxw/im.width)), Image.LANCZOS)
    im.convert('RGB').save(os.path.join(OUT, name), 'JPEG', quality=q, optimize=True)
    print('wrote', name, im.size)

def circle_avatar(path, name, size=256):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w-s)//2, (h-s)//2, (w+s)//2, (h+s)//2)).resize((size, size), Image.LANCZOS)
    mask = Image.new('L', (size*4, size*4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size*4-1, size*4-1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    out = im.convert('RGBA'); out.putalpha(mask)
    save_png(out, name)

# ---- 1. Logo: white -> transparent
logo = Image.open(f'{SRC}/Logo +Simple/WhatsApp Image 2026-05-17 at 8.32.32 PM.jpeg')
save_png(trim(flood_transparent(logo, key=(255,255,255), tol=40)), 'logo-simple.png', maxside=700)

# ---- 2. Mapa: keep photo, shrink
mapa = Image.open(f'{SRC}/Mapa de pantalla 1/WhatsApp Image 2026-05-17 at 9.06.47 PM.jpeg')
save_jpg(mapa, 'mapa-ba.jpg', maxw=1000)

# ---- 3. Home section photos
home = f'{SRC}/Fotos Secciones HOME '
save_jpg(Image.open(f'{home}/WhatsApp Image 2026-07-14 at 8.41.43 PM (1).jpeg'), 'home-empleo.jpg', maxw=640)
save_jpg(Image.open(f'{home}/WhatsApp Image 2026-07-14 at 8.41.43 PM (2).jpeg'), 'home-descuentos.jpg', maxw=640)
save_jpg(Image.open(f'{home}/WhatsApp Image 2026-07-14 at 8.41.43 PM (3).jpeg'), 'home-foro.jpg', maxw=640)
save_jpg(Image.open(f'{home}/WhatsApp Image 2026-07-14 at 8.41.43 PM (4).jpeg'), 'home-actividades.jpg', maxw=640)

# ---- 4. ARIEL: black bg -> transparent
ariel = Image.open(f'{SRC}/ICONO CHAT IA/WhatsApp Image 2026-07-14 at 8.46.01 PM.jpeg')
save_png(trim(flood_transparent(ariel, key=(0,0,0), tol=55)), 'ariel.png', maxside=512)

# ---- 5. Actividades badges (2x2 sheet, 1536x1024)
sheet = Image.open(f'{SRC}/Iconos Actividades  /WhatsApp Image 2026-07-14 at 8.59.36 PM (1).jpeg')
w, h = sheet.size
quads = { 'act-cine.png': (0, 0, w//2, h//2), 'act-ferias.png': (w//2, 0, w, h//2),
          'act-paseos.png': (0, h//2, w//2, h), 'act-salud.png': (w//2, h//2, w, h) }
for name, box in quads.items():
    save_png(trim(flood_transparent(sheet.crop(box), tol=28)), name, maxside=400)

# ---- 6. Clubes badges (1x3 sheet, 1536x1024)
csheet = Image.open(f'{SRC}/Clubes iconos/WhatsApp Image 2026-07-14 at 8.59.36 PM.jpeg')
w, h = csheet.size
thirds = { 'club-lectura.png': (0, 0, w//3, h), 'club-chisme.png': (w//3, 0, 2*w//3, h),
           'club-musica.png': (2*w//3, 0, w, h) }
for name, box in thirds.items():
    save_png(trim(flood_transparent(csheet.crop(box), tol=28)), name, maxside=400)

# ---- 7. Avatars: circular PNGs
U = f'{SRC}/Fotos de usuarios'
avatars = {
    'avatar-susana.jpg-src': ('488b8e8c-1bdc-4524-8792-609ff28868bb.jpg', 'avatar-susana.png'),
    'oscar': ('1306f58b-acba-4d40-b6ce-6f92b7ae55b8.jpg', 'avatar-oscar.png'),
    'sergio': ('d9ed5eaa-a796-43e7-92a3-17175cdaafdd.jpg', 'avatar-sergio.png'),
    'roberto': ('928dad98-c8f4-41c5-974f-6f537c56ad02.jpg', 'avatar-roberto.png'),
    'norma': ('d41001c6-3eca-4888-84ea-8251cc8afd64.jpg', 'avatar-norma.png'),
    'haydee': ('85a037da-185e-413d-a502-7f69692e6b87.jpg', 'avatar-haydee.png'),
    'marta': ('10423c3c-449f-4dd0-84fc-6e7a6d5959c2.jpg', 'avatar-marta.png'),
    'elena': ('58d4e7ed-e3bd-4dc8-b79f-1832dcb95571.jpg', 'avatar-elena.png'),
}
for _, (srcname, outname) in avatars.items():
    circle_avatar(f'{U}/{srcname}', outname)

print('DONE')
