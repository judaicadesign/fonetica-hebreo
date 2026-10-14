# Cotejo ArtScroll — 8 salmos (14/10/2026)

Fuente: capturas de ArtScroll subidas por Judaica Design (Tehilim 11, 14, 16, 63, 76, 83, 84, 130).
Método: puntuación, rafé y meteg leídos de las imágenes, con ampliación 3x de cada marca. Los másters no se tocaron: las versiones propuestas están en esta carpeta.

| Salmo | Versos | Puntuación añadida | Rafé añadidos | Meteg añadidos |
|---|---|---|---|---|
| 11 | 7 | 13 | 6 | 1 |
| 14 | 7 | 0 (el FINAL ya la tiene) | 4 | 0 |
| 16 | 11 | 15 | 7 | 3 |
| 63 | 12 | 17 | 9 | 22 |
| 76 | 13 | 16 | 5 | 26 |
| 83 | 19 | 23 | 14 | 5 |
| 84 | 13 | 18 | 8 | 26 |
| 130 | 8 | 15 | 5 | 0 |

## Archivos
- `TEHILIM_NNN_HEBREO_ARTSCROLL_PROPUESTA_numbered.txt`: hebreo propuesto, formato `etiqueta<TAB>texto`.
- `TEHILIM_ARTSCROLL_8_PROPUESTA.json`: por verso, hebreo actual, hebreo propuesto, fonética actual y fonética generada.

## Cambios que conviene mirar
- 14 (FINAL): solo se agrega rafé: en `לַמְנַצֵּחַ` (14:1) y en `יָדְעוּ`, `אֹכְלֵי`, `אָכְלוּ` (14:4). Falta tu aprobación para pisar el FINAL.
- 130:8: ArtScroll escribe `עֲוֹנוֹתָיו`; el máster tenía `עֲוֺנֹתָיו`.
- 76:8 y 63:2: paseq (׀) agregado. El generador no lo muestra en la fonética.
- 83:5 y 83:13: dos puntos tras `אָמְרוּ`.
- 76: ArtScroll imprime meteg en 26 lugares; el máster no tenía ninguno.
- 11 y 14 conservan `יְיָ`; el resto, `יְהֹוָה`.

## Dudas de lectura (revisar contra el original)
- 63:5 `אֲבָרֶכְךָ`: rafé sobre la kaf con shevá (no sobre la final).
- 76:5 `מֵהַרְרֵי`: rafé sobre la primera resh.
- 63:10 `שֻׁעָלִים`: no verifiqué si ArtScroll imprime qubuts o shevá.
- El detector de meteg puede perder marcas muy cortas. En 83:8 `יֹשְׁבֵי` se conserva el meteg del máster, que se ve en la captura pero no se detectó.

## Generador
- Regla nueva: una vav con jolam tras una consonante con jatáf o vocal plena es consonante. Antes `עֲוֹנוֹתָיו` salía `'aonotav`; ahora sale `'avonotav`. Test: `tests/vav-holam-hataf-20261014.mjs`.
- Con el rafé, la shevá suena (`שָׂנְאָה` → saneá, `נָפְלוּ` → náfelu).
- Con el meteg sobre una sílaba no final, el acento pasa a esa sílaba (`שָׁמָּה` → shama).
- Regresiones: 26/26.
