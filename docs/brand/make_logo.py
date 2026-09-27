"""Cắt logo web từ file gốc logo-hoa-hoang-nguon.jpg (chạy ở gốc repo).

    python3 docs/brand/make_logo.py

Ra: frontend/public/logo.png + favicon.png (chỉ vòng tròn, nền trong suốt),
logo-full-alpha.png (kèm chữ + slogan, nền trong suốt) và logo-full.png (nền trắng).
Bỏ dòng chú thích "Phương án 2" và bóng đổ xám của file gốc. Toạ độ vòng tròn
(cx, cy, R) đo tay trên file gốc 1190x1322 — đổi file gốc thì phải đo lại.
"""
from PIL import Image
import numpy as np


def save(im, path):
    # 256-colour palette keeps the gradients and cuts the files ~3x
    im.quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(path, optimize=True)

src = Image.open('docs/brand/logo-hoa-hoang-nguon.jpg').convert('RGB')
a = np.asarray(src).astype(float)
h, w, _ = a.shape
cx, cy, R = 612.0, 508.5, 458.0
yy, xx = np.mgrid[0:h, 0:w]
d = np.hypot(xx - cx, yy - cy)
circle = np.clip(R + 0.5 - d, 0, 1)            # anti-aliased disc
mn = a.min(2)
text = np.clip((215 - mn) / 65, 0, 1)          # key white + grey shadow out
text[:, :] *= (yy > 900) & (yy < 1135)         # wordmark + slogan only, drop caption
alpha = np.maximum(circle, text * (d > R))
# un-premultiply the keyed text edges against white
rgb = a.copy()
m = (alpha > 0) & (alpha < 1)
rgb[m] = np.clip((a[m] - 255 * (1 - alpha[m, None])) / alpha[m, None], 0, 255)
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
full = Image.fromarray(rgba, 'RGBA')

# full lockup
box = full.getbbox(); pad = 12
full_c = full.crop((box[0]-pad, box[1]-pad, box[2]+pad, box[3]+pad))
fw = 560; fh = round(full_c.height * fw / full_c.width)
full_s = full_c.resize((fw, fh), Image.LANCZOS)
save(full_s, 'frontend/public/logo-full-alpha.png')
white = Image.new('RGB', full_s.size, 'white'); white.paste(full_s, mask=full_s.split()[3])
save(white, 'frontend/public/logo-full.png')
print('full', full_s.size)

# mark only: the disc alone, so the wordmark's accents don't leak in
disc = Image.fromarray(np.dstack([a, circle * 255]).astype(np.uint8), 'RGBA')
mark = disc.crop((int(cx-R-4), int(cy-R-4), int(cx+R+5), int(cy+R+5)))
save(mark.resize((360, 360), Image.LANCZOS), 'frontend/public/logo.png')
save(mark.resize((128, 128), Image.LANCZOS), 'frontend/public/favicon.png')
