#!/usr/bin/env python3
"""Verifica en el ARCHIVO de una fuente (no en una captura) si admite los signos hebreos que usa JD.

Uso:
    python3 tools/fuente/verificar_glifos.py RUTA/FbFrankReal-*.otf [más archivos…]
Requiere: pip install fonttools

Informa, por archivo:
  - nombres internos (familia, nombre completo, PostScript, versión) para identificar la fuente exacta;
  - si el cmap asigna un glifo a U+05C7 (kamats katán), U+05B8 (kamats), U+05BD (meteg) y U+05BF (rafé);
  - si el glifo de U+05C7 participa en el posicionamiento de marcas (GPOS mark-to-base / mark-to-mark),
    que es lo que hace que InDesign lo coloque debajo de la letra y no como un signo suelto;
  - si U+05C7 y U+05B8 comparten el mismo glifo (es válido: se ven igual, pero el carácter sigue siendo distinto).
Una fuente que NO tiene U+05C7 en el cmap muestra un recuadro o un glifo de reemplazo: eso es lo que obligaba
a convertir el katán en kamats común al copiar.
"""
import sys
from fontTools.ttLib import TTFont

CHECK = {0x05C7: "kamats katán", 0x05B8: "kamats", 0x05BD: "meteg", 0x05BF: "rafé", 0x05B3: "jataf kamats"}


def mark_coverage(font):
    glyphs = set()
    if "GPOS" not in font:
        return glyphs
    for lookup in font["GPOS"].table.LookupList.Lookup:
        for st in lookup.SubTable:
            st = getattr(st, "ExtSubTable", st)
            if st.LookupType in (4, 6) and hasattr(st, "Mark1Coverage"):
                glyphs.update(st.Mark1Coverage.glyphs)
            if st.LookupType == 6 and hasattr(st, "Mark2Coverage"):
                glyphs.update(st.Mark2Coverage.glyphs)
    return glyphs


def name(font, nid):
    rec = font["name"].getName(nid, 3, 1, 0x409) or font["name"].getName(nid, 1, 0, 0)
    return str(rec) if rec else "—"


def main(paths):
    ok = True
    for path in paths:
        font = TTFont(path, lazy=True)
        cmap = font.getBestCmap()
        marks = mark_coverage(font)
        print(f"\n{path}")
        print(f"  Familia: {name(font, 1)} · Completo: {name(font, 4)} · PostScript: {name(font, 6)} · Versión: {name(font, 5)}")
        for cp, label in CHECK.items():
            g = cmap.get(cp)
            pos = "con posicionamiento GPOS" if g in marks else ("SIN posicionamiento GPOS" if g else "")
            print(f"  U+{cp:04X} {label:13}: {'glifo ' + g if g else 'NO ESTÁ EN EL CMAP'} {pos}")
        if not cmap.get(0x05C7):
            ok = False
        elif cmap.get(0x05C7) == cmap.get(0x05B8):
            print("  Nota: U+05C7 usa el mismo glifo que U+05B8 (se ven iguales; el texto conserva la distinción).")
    print("\nResultado:", "U+05C7 admitido" if ok else "falta U+05C7 en al menos un archivo")
    return 0 if ok else 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1:]))
