"""Rebuild every brand file of the site from one emblem picture.

    python tools/make_brand.py            (run from the site folder; needs Pillow and fontTools with brotli)

To swap the emblem: replace assets/brand/emblem.png with a square PNG on a transparent background
(the emblem roughly centred, any size from about 512 px), then run this script. It writes:

    assets/brand/emblem-96.png, emblem-192.png, emblem-512.png   header and page use
    favicon.ico (16-64 px), apple-touch-icon.png (180 px)        browser icons
    assets/press/icon-192.png, icon-512.png                      web app manifest
    assets/press/joust-revival-logo-dark.png, -light.png         press-kit logos (transparent)
    assets/img/og.jpg, assets/img/og-devlog-muybridge.jpg        1200x630 share images

The name and the lines on the share images are the constants just below.
"""
import io, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont

NAME = 'JOUST REVIVAL'
SUB = 'THE JOUST, AS IT WAS'
HERO = 'The jousting game built from the real thing.'
STRAP = 'FREE IN YOUR BROWSER  ·  PC VERSION IN THE MAKING'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
INK, NIGHT, PARCH, GOLD, GOLD2, VERM, LAPIS = (42, 26, 16), (22, 16, 11), (239, 227, 198), (214, 169, 58), (242, 214, 128), (168, 42, 28), (31, 63, 138)


def font(name, size):
    """The site's woff2 fonts, unpacked for Pillow."""
    f = TTFont(P('assets', 'fonts', name)); f.flavor = None
    b = io.BytesIO(); f.save(b); b.seek(0)
    return ImageFont.truetype(b, size)


def tracked(draw, xy, text, fnt, fill, track=0.1):
    """Draw text with letter spacing (track = em fraction); returns the width."""
    x, y = xy; size = fnt.size
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + track * size
    return x - xy[0] - track * size


def width(draw, text, fnt, track=0.1):
    return sum(draw.textlength(ch, font=fnt) for ch in text) + track * fnt.size * (len(text) - 1)


def fit(im, w, h):
    """Cover-crop an image to w x h."""
    r = max(w / im.width, h / im.height); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def lozenge_bar(img, y, h=16):
    d = ImageDraw.Draw(img); d.rectangle((0, y, img.width, y + h), fill=LAPIS); d.line((0, y, img.width, y), fill=INK, width=2)
    for x in range(0, img.width + h, h):
        c = x + h / 2; d.polygon([(c, y + 1), (c + h / 2 - 1, y + h / 2), (c, y + h - 1), (c - h / 2 + 1, y + h / 2)], fill=GOLD, outline=INK)
        d.ellipse((x - 2, y + h / 2 - 2, x + 2, y + h / 2 + 2), fill=VERM)


def main():
    em = Image.open(P('assets', 'brand', 'emblem.png')).convert('RGBA')
    sq = max(em.size); e2 = Image.new('RGBA', (sq, sq)); e2.paste(em, ((sq - em.width) // 2, (sq - em.height) // 2)); em = e2
    E = lambda s: em.resize((s, s), Image.LANCZOS)

    for s in (96, 192, 512):
        E(s).save(P('assets', 'brand', f'emblem-{s}.png'), optimize=True)
    E(256).save(P('favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    t = Image.new('RGBA', (180, 180), PARCH + (255,)); t.alpha_composite(E(164), (8, 8)); t.convert('RGB').save(P('apple-touch-icon.png'))
    os.makedirs(P('assets', 'press'), exist_ok=True)
    for s in (192, 512):
        E(s).save(P('assets', 'press', f'icon-{s}.png'), optimize=True)

    sc_big, sc_small = font('EBGaramondSC-500.woff2', 96), font('EBGaramondSC-500.woff2', 26)
    garamond = font('EBGaramond-500.woff2', 40)

    # press logos: emblem + wordmark, transparent
    for tag, word, sub in (('dark', GOLD2, (217, 195, 147)), ('light', VERM, INK)):
        lg = Image.new('RGBA', (1600, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(lg)
        lg.alpha_composite(E(260), (20, 20))
        tracked(d, (310, 70), NAME, sc_big, word, 0.08)
        tracked(d, (316, 186), SUB, sc_small, sub, 0.22)
        lg = lg.crop(lg.getbbox()); lg.save(P('assets', 'press', f'joust-revival-logo-{tag}.png'), optimize=True)

    # share image: the strike, a dark wash on the left, the emblem badge, name and line
    base = fit(Image.open(P('assets', 'img', 'shot-impact-1600.webp')).convert('RGB'), 1200, 630).convert('RGBA')
    wash = Image.new('RGBA', base.size)
    for x in range(1200):
        a = 235 if x < 380 else max(0, int(235 * (1 - (x - 380) / 480)))
        ImageDraw.Draw(wash).line((x, 0, x, 630), fill=NIGHT + (a,))
    base.alpha_composite(wash)
    glow = Image.new('RGBA', base.size); ImageDraw.Draw(glow).ellipse((40, 60, 300, 320), fill=(0, 0, 0, 150)); base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(18)))
    base.alpha_composite(E(250), (46, 66))
    d = ImageDraw.Draw(base)
    name_f = font('EBGaramondSC-500.woff2', 78)
    tracked(d, (62, 340), NAME, name_f, GOLD2, 0.07)
    d.text((64, 440), HERO, font=garamond, fill=PARCH)
    tracked(d, (66, 506), STRAP, font('EBGaramondSC-500.woff2', 24), GOLD, 0.16)
    lozenge_bar(base, 614)
    base.convert('RGB').save(P('assets', 'img', 'og.jpg'), quality=86)

    # devlog share image: parchment, Muybridge on the right, title on the left
    pa = fit(Image.open(P('assets', 'ui', 'parchment.jpg')).convert('RGB'), 1200, 630).convert('RGBA')
    mu = Image.open(P('assets', 'img', 'history', 'muybridge-1878-1200.webp')).convert('RGBA')
    mu = mu.resize((round(mu.width * 630 / mu.height), 630), Image.LANCZOS); pa.alpha_composite(mu, (610, 0))
    sh = Image.new('RGBA', pa.size); ImageDraw.Draw(sh).rectangle((600, 0, 612, 630), fill=INK + (255,)); pa.alpha_composite(sh)
    d = ImageDraw.Draw(pa)
    pa.alpha_composite(E(96), (52, 48))
    tracked(d, (164, 86), 'DEVLOG  ·  NO. 1', font('EBGaramondSC-500.woff2', 26), (169, 124, 34), 0.14)
    tf = font('GrenzeGotisch-700.woff2', 70); y = 180
    for line in ('How we taught', 'horses to gallop', "like Muybridge's"):
        d.text((56, y), line, font=tf, fill=VERM); y += 82
    d.text((58, y + 26), 'An 1878 photograph fixed our gallop,', font=font('EBGaramond-500.woff2', 32), fill=INK)
    d.text((58, y + 66), 'footfall by footfall.', font=font('EBGaramond-500.woff2', 32), fill=INK)
    lozenge_bar(pa, 614)
    pa.convert('RGB').save(P('assets', 'img', 'og-devlog-muybridge.jpg'), quality=86)
    print('brand files written')


if __name__ == '__main__':
    main()
