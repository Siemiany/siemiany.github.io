from __future__ import annotations

import html
import re
from io import BytesIO
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "assets" / "img"
RESP_DIR = IMG_DIR / "r"
CREDIT_URL = "https://www.crazycopter.pl/"
CREDIT = f'Fot. <a href="{CREDIT_URL}" rel="noopener" target="_blank">Andrzej Budnik / CrazyCopter ↗</a> · wykorzystano za zgodą autora.'

SOURCES = {
    "ilawa-crazycopter": "https://www.loswiaheros.pl/zdjecia/CrazyCopter_I%C5%82awa_z_drona-0268.jpg",
    "jeziorak-archipelag-crazycopter": "https://www.loswiaheros.pl/zdjecia/CrazyCopter_I%C5%82awa_Jezioro_Jeziorak-0288.jpg",
    "szymbark-crazycopter": "https://www.loswiaheros.pl/zdjecia/CrazyCopter_Pojezierze_I%C5%82awskie_Szymbark_Zamek_dron-0111.jpg",
    "jezioro-jasne-crazycopter": "https://www.loswiaheros.pl/zdjecia/CrazyCopter_I%C5%82awa_Jezioro_Jasne-0213.jpg",
    "rowerem-aleja-crazycopter": "https://www.loswiaheros.pl/zdjecia/LosWiaheros_I%C5%82awa_rowerem_sciezki_aleja_debowa-6291.jpg",
}

PLAJTEK_INSTAGRAM = "https://www.instagram.com/p/Bj6UAqKA2jG/?utm_source=ig_embed&ig_rid=AbggcFWzdD3AwTywbgS2eN7"
PLAJTEK_FALLBACK_PAGE = "https://www.infoilawa.pl/aktualnosci/item/54920-macie-w-powiecie-wielkiego-mrowkojada-blogerom-udalo-sie-zaskoczyc-ilawian-zdjecia"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/152 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
})


def get(url: str, *, referer: str | None = None) -> requests.Response:
    headers = {"Referer": referer} if referer else None
    response = session.get(url, headers=headers, timeout=45)
    response.raise_for_status()
    return response


def download_image(url: str, *, referer: str | None = None) -> bytes:
    response = get(url, referer=referer)
    content_type = response.headers.get("content-type", "")
    if "image" not in content_type.lower() and not response.content.startswith((b"\xff\xd8", b"\x89PNG", b"RIFF")):
        raise RuntimeError(f"Expected image from {url}, got {content_type}")
    return response.content


def image_from_page(page_url: str, *, alt_word: str | None = None) -> tuple[str, bytes]:
    response = get(page_url)
    soup = BeautifulSoup(response.text, "html.parser")

    candidates: list[str] = []
    if alt_word:
        for img in soup.find_all("img"):
            alt = (img.get("alt") or "").lower()
            if alt_word.lower() in alt:
                for attr in ("src", "data-src", "data-lazy-src"):
                    if img.get(attr):
                        candidates.append(urljoin(page_url, html.unescape(img[attr])))
                        break

    for selector in (
        ('meta', {'property': 'og:image'}),
        ('meta', {'name': 'twitter:image'}),
    ):
        tag = soup.find(selector[0], attrs=selector[1])
        if tag and tag.get("content"):
            candidates.append(urljoin(page_url, html.unescape(tag["content"])))

    for url in candidates:
        try:
            payload = download_image(url, referer=page_url)
            with Image.open(BytesIO(payload)) as im:
                if im.width >= 700 and im.height >= 500:
                    return url, payload
        except Exception as exc:
            print(f"Skipping candidate {url}: {exc}")

    raise RuntimeError(f"Could not find a usable image on {page_url}")


def download_plajtek() -> bytes:
    try:
        _, payload = image_from_page(PLAJTEK_INSTAGRAM)
        return payload
    except Exception as exc:
        print(f"Instagram download failed, using Info Iława copy: {exc}")
        _, payload = image_from_page(PLAJTEK_FALLBACK_PAGE, alt_word="Plajtek")
        return payload


def save_webp_set(name: str, payload: bytes, max_width: int = 1800, quality: int = 83) -> dict:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    RESP_DIR.mkdir(parents=True, exist_ok=True)

    with Image.open(BytesIO(payload)) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        if source.width > max_width:
            full = source.resize((max_width, round(source.height * max_width / source.width)), Image.Resampling.LANCZOS)
        else:
            full = source.copy()

        full_path = IMG_DIR / f"{name}.webp"
        full.save(full_path, "WEBP", quality=quality, method=6)

        variants = []
        for width in (480, 800, 1200):
            if width >= full.width:
                continue
            height = round(full.height * width / full.width)
            resized = full.resize((width, height), Image.Resampling.LANCZOS)
            path = RESP_DIR / f"{name}-{width}.webp"
            resized.save(path, "WEBP", quality=quality, method=6)
            variants.append((width, f"assets/img/r/{name}-{width}.webp"))

        variants.append((full.width, f"assets/img/{name}.webp"))
        return {
            "name": name,
            "width": full.width,
            "height": full.height,
            "src": f"assets/img/{name}.webp",
            "srcset": ", ".join(f"{path} {width}w" for width, path in variants),
        }


def img_tag(meta: dict, alt: str, *, fetchpriority: str | None = None, loading: str | None = "lazy", sizes: str = "(max-width: 760px) 100vw, 800px") -> str:
    attrs = [
        f'alt="{alt}"',
        'decoding="async"',
        f'height="{meta["height"]}"',
        f'width="{meta["width"]}"',
        f'sizes="{sizes}"',
        f'src="{meta["src"]}"',
        f'srcset="{meta["srcset"]}"',
    ]
    if fetchpriority:
        attrs.append(f'fetchpriority="{fetchpriority}"')
    if loading:
        attrs.append(f'loading="{loading}"')
    return "<img " + " ".join(attrs) + "/>"


def replace_once(text: str, pattern: str, replacement: str, *, flags: int = 0, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f"Expected one replacement for {label}, got {count}")
    return updated


def update_file(path: str, transform) -> None:
    file_path = ROOT / path
    text = file_path.read_text(encoding="utf-8")
    updated = transform(text)
    if updated != text:
        file_path.write_text(updated, encoding="utf-8")
        print(f"Updated {path}")


def patch_ilawa(text: str, m: dict) -> str:
    text = text.replace(
        'https://siemiany.info/assets/img/ilawa-maly-jeziorak-um.jpg" property="og:image"',
        'https://siemiany.info/assets/img/ilawa-crazycopter.webp" property="og:image"',
        1,
    )
    hero = (
        '<div>'
        + img_tag(m, "Iława i Jeziorak z lotu ptaka", fetchpriority="high", loading="eager", sizes="(max-width: 900px) 100vw, 50vw")
        + f'<div class="hero-note">{CREDIT}</div></div>'
    )
    return replace_once(
        text,
        r'<img alt="Iława i Mały Jeziorak" fetchpriority="high" loading="eager" src="assets/img/ilawa-maly-jeziorak-um\.jpg"/>',
        hero,
        label="Iława hero",
    )


def patch_jeziorak(text: str, m: dict) -> str:
    figure = (
        '<figure class="place-photo">'
        f'<a data-lightbox="" href="{m["src"]}">'
        + img_tag(m, "Jeziorak i jego wyspy z lotu ptaka")
        + '</a>'
        f'<figcaption>Jeziorak jako archipelag z lotu ptaka. {CREDIT}</figcaption>'
        '</figure>'
    )
    return replace_once(
        text,
        r'(<section id="wyspy"><h2>Jeziorak jako archipelag</h2><p>.*?</p>)',
        r'\1' + figure,
        flags=re.S,
        label="Jeziorak archipelago figure",
    )


def patch_okolica(text: str, m: dict) -> str:
    image = (
        f'<a data-lightbox="" href="{m["src"]}" style="display:block">'
        + img_tag(m, "Ruiny zamku w Szymbarku z lotu ptaka", sizes="(max-width: 760px) 100vw, 50vw")
        + '</a>'
    )
    text = replace_once(
        text,
        r'(<div class="trip" id="pol-dnia">)<img alt="Ruiny zamku w Szymbarku".*?/>',
        r'\1' + image,
        flags=re.S,
        label="Szymbark tile image",
    )
    text = replace_once(
        text,
        r'(<div class="trip" id="pol-dnia">.*?<h3>Szymbark</h3>)',
        r'\1<p class="source-note">' + CREDIT + '</p>',
        flags=re.S,
        label="Szymbark tile credit",
    )
    return text


def patch_jeziora(text: str, m: dict) -> str:
    text = text.replace(
        'https://siemiany.info/assets/img/jasne.webp" property="og:image"',
        'https://siemiany.info/assets/img/jezioro-jasne-crazycopter.webp" property="og:image"',
        1,
    )
    hero = (
        '<div>'
        + img_tag(m, "Jezioro Jasne z lotu ptaka", fetchpriority="high", loading="eager", sizes="(max-width: 900px) 100vw, 50vw")
        + f'<div class="hero-note">{CREDIT}</div></div>'
    )
    return replace_once(
        text,
        r'<img alt="Jezioro Jasne - przejrzysta woda i leśny brzeg" fetchpriority="high".*?/>',
        hero,
        flags=re.S,
        label="Jezioro Jasne hero",
    )


def patch_rowerem(text: str, hero_meta: dict, plajtek_meta: dict) -> str:
    text = text.replace(
        'https://siemiany.info/assets/img/jeziorak-wide.webp" property="og:image"',
        'https://siemiany.info/assets/img/rowerem-aleja-crazycopter.webp" property="og:image"',
        1,
    )
    hero = (
        '<div>'
        + img_tag(hero_meta, "Rowerem przez aleję drzew na Pojezierzu Iławskim", fetchpriority="high", loading="eager", sizes="(max-width: 900px) 100vw, 50vw")
        + f'<div class="hero-note">{CREDIT}</div></div>'
    )
    text = replace_once(
        text,
        r'<img alt="Leśna droga rowerowa wokół Siemian" fetchpriority="high".*?src="assets/img/forest-path\.webp".*?/>',
        hero,
        flags=re.S,
        label="cycling hero",
    )

    plajtek_figure = (
        '<figure class="place-photo">'
        f'<a data-lightbox="" href="{plajtek_meta["src"]}">'
        + img_tag(plajtek_meta, "Jezioro Plajtek z lotu ptaka")
        + '</a>'
        f'<figcaption>Jezioro Plajtek z lotu ptaka. {CREDIT} Źródło pierwotne: '
        '<a href="https://www.instagram.com/p/Bj6UAqKA2jG/" rel="noopener" target="_blank">LosWiaheros / Instagram ↗</a>.</figcaption>'
        '</figure>'
    )
    text = replace_once(
        text,
        r'(<p>Relacja prowadzi przez Park Krajobrazowy Pojezierza Iławskiego.*?Plajtek.*?</p>)',
        r'\1' + plajtek_figure,
        flags=re.S,
        label="Plajtek feature",
    )

    old_photo = (
        '<figure class="place-photo">'
        '<img alt="Leśna droga rowerowa wokół Siemian" decoding="async" height="1350" loading="lazy" '
        'sizes="(max-width: 760px) 100vw, 800px" src="assets/img/forest-path.webp" '
        'srcset="assets/img/r/forest-path-800.webp 800w, assets/img/r/forest-path-1200.webp 1200w, assets/img/forest-path.webp 1800w" width="1800"/>'
        '<figcaption>Leśna droga rowerowa wokół Siemian · zdjęcie własne.</figcaption>'
        '</figure>'
    )
    text = replace_once(
        text,
        r'(<section id="krotsze"><h2>Nie musisz robić całego Jezioraka</h2><p>.*?</p>)',
        r'\1' + old_photo,
        flags=re.S,
        label="old cycling hero moved lower",
    )
    return text


def patch_susz(text: str) -> str:
    pattern = (
        r'(<div class="callout"><strong>Stolica polskiego triathlonu</strong>.*?'
        r'<div class="route-actions"><a class="btn ghost" href="https://triathlon\.susz\.pl/pl/" rel="noopener" target="_blank">Susz Triathlon - oficjalna strona ↗</a>)'
        r'(</div></div>)'
    )
    addition = (
        '<a class="btn ghost" href="https://www.loswiaheros.pl/polska/susz-triathlon-zawody" rel="noopener" target="_blank">'
        'Relacja LosWiaheros z Susz Triathlon ↗</a>'
    )
    return replace_once(text, pattern, r'\1' + addition + r'\2', flags=re.S, label="Susz triathlon story link")


def main() -> None:
    assets = {}
    for name, url in SOURCES.items():
        print(f"Downloading {name}")
        payload = download_image(url, referer="https://www.loswiaheros.pl/polska/rowerem-wokol-jeziora-jeziorak-ilawa")
        assets[name] = save_webp_set(name, payload)

    print("Downloading Plajtek")
    assets["plajtek-crazycopter"] = save_webp_set("plajtek-crazycopter", download_plajtek())

    update_file("ilawa.html", lambda text: patch_ilawa(text, assets["ilawa-crazycopter"]))
    update_file("jeziorak.html", lambda text: patch_jeziorak(text, assets["jeziorak-archipelag-crazycopter"]))
    update_file("okolica.html", lambda text: patch_okolica(text, assets["szymbark-crazycopter"]))
    update_file("jeziora.html", lambda text: patch_jeziora(text, assets["jezioro-jasne-crazycopter"]))
    update_file("rowerem.html", lambda text: patch_rowerem(text, assets["rowerem-aleja-crazycopter"], assets["plajtek-crazycopter"]))
    update_file("susz.html", patch_susz)

    # One-off migration: remove helper files so the PR contains only site changes and assets.
    workflow = ROOT / ".github" / "workflows" / "crazycopter-photo-refresh.yml"
    if workflow.exists():
        workflow.unlink()
    Path(__file__).unlink()


if __name__ == "__main__":
    main()
