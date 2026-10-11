"""Rebuild src/lib/utils/vi-compounds.js — the Vietnamese compound words whose
syllables the site keeps on one line (see lib/utils/vi-line-breaks.js).

Vietnamese writes every syllable as its own space-separated word, so a browser
will happily end a line on "hạng" and start the next with "mục". This script
segments all the site's Vietnamese copy with pyvi and records every compound
it finds; the page then glues those syllables with no-break spaces.

Run it again after adding a good deal of new copy:

    python3 -m venv /tmp/vi && /tmp/vi/bin/pip install pyvi
    /tmp/vi/bin/python scripts/build-vi-compounds.py [API_BASE]

API_BASE defaults to http://localhost:5173/api/v1 (the dev server's proxy).
Review the diff: the segmenter is good but not perfect, and wrong pairs go in
DENY below.
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

from pyvi import ViTokenizer

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'frontend/src/lib/utils/vi-compounds.js'
API = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:5173/api/v1'

SOURCES = [
    ROOT / 'frontend/src/lib/i18n/translations.js',
    ROOT / 'backend/src/services/seed_data.py',
    *sorted((ROOT / 'frontend/src/pages').rglob('*.jsx')),
    *sorted((ROOT / 'frontend/src/components').rglob('*.jsx')),
]
LISTS = ['company/profile', 'company/contact-info', 'company/partners', 'fields', 'products',
         'capability/certificates', 'capability/equipment', 'capability/documents']
PAGED = ['projects', 'news', 'careers']
DETAIL = ['projects', 'news', 'careers', 'fields', 'products']
SKIP_KEYS = {'slug', 'image', 'images', 'url', 'id', '_id', 'cover', 'logo', 'name_en', 'title_en'}

# Pairs the segmenter joins wrongly across a word boundary, or that are names
# only half caught (the capitalised-name rule covers those whole).
DENY = {
    'ông hoàng', 'tấn cáp', 'cầu móng', 'cầu tuần', 'cầu giới', 'cầu dài', 'cầu đường',
    'giới phiên', 'phiên vượt', 'nguyên phó', 'lắp bó', 'kéo bó', 'lực cáp', 'logo cáp',
    'hệ platform', 'khánh contract', 'nguyễn thị', 'nguyễn chánh', 'ngô tuấn',
}
# Words the segmenter missed in context, and the few longer terms worth
# keeping whole (a line may still break before or after them).
EXTRA = {
    'liên hệ', 'chúng tôi', 'bản gốc', 'nhân sự', 'văn bản', 'bảo hộ', 'quy đổi', 'hợp đồng', 'công ty', 'cầu đường',
    'tổng giám đốc', 'đường cao tốc', 'tàu điện ngầm', 'dự ứng lực', 'hồ chí minh',
    'nhà thầu phụ', 'gối cầu', 'khe co giãn', 'cáp dây văng',
}
# Plain-ASCII pairs that are Vietnamese, not English.
ASCII_OK = {'cao su', 'dung sai', 'khe ray', 'kinh doanh', 'long an', 'nam phong', 'nha trang',
            'sa pa', 'song song', 'tham gia', 'trung nam'}

VI_LETTER = re.compile(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', re.I)
STRING_LITERAL = re.compile(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"")


def fetch(path):
    try:
        with urllib.request.urlopen(f'{API}/{path}', timeout=15) as res:
            return json.load(res).get('data')
    except Exception as exc:  # a missing endpoint just means less copy to learn from
        print(f'skip {path}: {exc}', file=sys.stderr)
        return None


def strings(node, out):
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, dict):
        for key, value in node.items():
            if key not in SKIP_KEYS:
                strings(value, out)
    elif isinstance(node, list):
        for value in node:
            strings(value, out)


def collect():
    texts = []
    for source in SOURCES:
        code = source.read_text()
        texts += [a or b for a, b in STRING_LITERAL.findall(code)]
        if source.suffix == '.jsx':  # copy written straight into the markup
            texts += re.findall(r'>([^<>{}]+)<', code)
    for path in LISTS:
        strings(fetch(path), texts)
    for path in PAGED:
        page = 1
        while True:
            data = fetch(f'{path}?page_size=50&page={page}') or {}
            strings(data.get('items'), texts)
            for item in data.get('items') or []:
                if path in DETAIL and item.get('slug'):
                    strings(fetch(f"{path}/{item['slug']}"), texts)
            if page >= (data.get('total_pages') or 0):
                break
            page += 1
    for path in ('fields', 'products'):
        for item in fetch(path) or []:
            if isinstance(item, dict) and item.get('slug'):
                strings(fetch(f"{path}/{item['slug']}"), texts)
    return {re.sub(r'<[^>]+>', ' ', t) for t in texts if VI_LETTER.search(t)}


def compounds(texts):
    found = set()
    for text in texts:
        for line in text.splitlines():
            for token in ViTokenizer.tokenize(line).split():
                if '_' not in token:
                    continue
                word = token.replace('_', ' ').lower()
                syllables = word.split()
                # two syllables only: longer runs from the segmenter are mostly a
                # compound plus a neighbour, and names are caught by capitals
                if len(syllables) != 2 or not re.fullmatch(r'[^\W\d_]+ [^\W\d_]+', word):
                    continue
                if word in DENY or (word.isascii() and word not in ASCII_OK):
                    continue
                found.add(word)
    return sorted((found - DENY) | EXTRA)


def main():
    words = compounds(collect())
    body = '\n'.join(f"  '{w}'," for w in words)
    OUT.write_text(
        '// Generated by scripts/build-vi-compounds.py — edit DENY there, not here.\n'
        '// Vietnamese compounds found in the site copy, lower case.\n'
        f'export const VI_COMPOUNDS = [\n{body}\n]\n'
    )
    print(f'{len(words)} compounds → {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
