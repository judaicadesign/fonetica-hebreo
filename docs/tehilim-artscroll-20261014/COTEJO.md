# Cotejo ArtScroll — 8 salmos (14/10/2026)

Fuente: capturas de ArtScroll subidas por Judaica Design (Tehilim 11, 14, 16, 63, 76, 83, 84, 130).
Método: puntuación, rafé y meteg leídos de las imágenes, con ampliación de cada marca. Regla de Judaica Design: donde ArtScroll pone `יהוה` se escribe `יי`.

| Salmo | Versos | Puntuación añadida | Rafé añadidos | Meteg añadidos |
|---|---|---|---|---|
| 11 | 7 | 13 | 6 | 1 |
| 14 | 7 | 0 (ya la tenía) | 4 | 0 |
| 16 | 11 | 15 | 7 | 3 |
| 63 | 12 | 17 | 9 | 22 |
| 76 | 13 | 16 | 7 | 26 |
| 83 | 19 | 23 | 14 | 5 |
| 84 | 13 | 18 | 12 | 26 |
| 130 | 8 | 15 | 5 | 0 |

## Archivos
- `TEHILIM_NNN_HEBREO_FINAL_numbered.txt`: máster hebreo, formato `etiqueta<TAB>texto`.
- `TEHILIM_8_SALMOS_HEBREO_Y_FONETICA.txt`: hebreo y fonética, para leer.
- `TEHILIM_8_SALMOS_FINAL.json`: por verso, hebreo final y anterior, fonética generada y anterior.

## Cambios a tener presentes
- 14: solo se agrega rafé, en `לַמְנַצֵּחַ` (14:1) y en `יָדְעוּ`, `אֹכְלֵי`, `אָכְלוּ` (14:4).
- 130:8: ArtScroll escribe `עֲוֹנוֹתָיו`; el máster tenía `עֲוֺנֹתָיו`.
- 76:8 y 63:2: paseq (`׀`, la rayita vertical entre dos palabras). El generador no lo muestra en la fonética.
- 83:5 y 83:13: dos puntos tras `אָמְרוּ`.
- 76: ArtScroll imprime meteg en 26 lugares; el máster no tenía ninguno.
- `יהוה` se escribe `יְיָ` en los 8 salmos.

## Generador
- Regla nueva: una vav con jolam tras una consonante con jatáf o vocal plena es consonante. Antes `עֲוֹנוֹתָיו` salía `'aonotav`; ahora `'avonotav`. Test: `tests/vav-holam-hataf-20261014.mjs`.
- El rafé hace sonar la shevá (`שָׂנְאָה` → saneá, `נָפְלוּ` → náfelu).
- El meteg sobre una sílaba no final pasa el acento a esa sílaba (`שָׁמָּה` → shama).

## Verificación
Las dudas de lectura (63:5, 63:11, 76:5, 83:8 y 130:8) se resolvieron ampliando la imagen: no queda ninguna abierta.
Una pasada con criterios más amplios encontró 6 rafé sobre lamed que la primera no vio (76:6, 76:12, 84:3, 84:5, 84:8, 84:12); ya están incluidos.
