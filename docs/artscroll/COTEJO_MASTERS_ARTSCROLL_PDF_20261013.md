# Cotejo de los máster contra el PDF ArtScroll (ashkenaz, Interlinear Benching) — 13/10/2026

**Método.** El hebreo del PDF está en fuentes Type3. Se extrajo glifo por glifo (forma + posición) y se reconstruyó el texto con nikud, dagesh, meteg y rafe, sin OCR. 270 formas distintas, de las cuales ~140 son hebreas. Cada diferencia se verificó contra los glifos crudos. Herramientas: `tools/artscroll-pdf/`. Texto extraído: `ASHKENAZ_PDF_EXTRAIDO_20261013.txt`. Rafe: `ASHKENAZ_PDF_RAFE_20261013.json`.

**Alcance.** El PDF es la edición en inglés = referencia secundaria (política del repo). Una diferencia no es automáticamente un error. No se modificó ningún máster. יהוה del PDF = יְיָ del máster.

## 1. Salmos 137 y 126 (`tehilim.json`)
Letras, nikud, dagesh y meteg: **idénticos al PDF** (84 palabras en 137, 50 en 126). Solo difieren:

| Dónde | Máster | PDF |
|---|---|---|
| 137:6 | אֶזְכְּרֵֽכִי | rafe en la כּ |
| 137:7 | הָאֹמְרִים | rafe en la מ |
| 137:8 | הַשְּׁדוּדָה | rafe en la שׁ |
| 137:8 | שֶׁיְשַׁלֶּם | rafe en la י |
| 126:1 | כְּחֹלְמִים | rafe en la ל |
| 126:2 | יֹאמְרוּ | rafe en la מ |
| 126:6 | הַזֹּרְעִים | rafe en la ר |
| 126:1 | הַמַּעֲלוֹת, (coma) | הַמַּעֲלוֹת; (punto y coma) |
| 126:2 | בַגּוֹיִם: | בַגּוֹיִם׃ (sof pasuk) |
| 126:6 | וּבָכֹה, | וּבָכֹה (sin coma) |

Los rafe son la capa enriquecida opcional (el máster ArtScroll-fiel hoy solo tiene 2).

## 2. Birkat Hamazón ashkenazí (`ASHKENAZ_HEBREO_METEG_EN_REVISION.txt`)
Rafe en el PDF: 51 (49 palabras distintas). Meteg: 250. El máster no tiene rafe.

### Diferencias de letras/nikud/meteg
| # | Máster | PDF | Nota |
|---|---|---|---|
| 1 | ליְיָ | לַיְיָ | falta patáj |
| 2 | חַסְדּו | חַסְדּוֹ | falta jolam |
| 3 | וּבְּבִנְיַן | וּבְבִנְיַן con rafe en la ב | dagesh de más: parece un rafe leído como dagesh |
| 4 | גִבּוֹרִים | גִּבּוֹרִים | dagesh |
| 5 | הַשַׁבָּת | הַשַּׁבָּת | dagesh |
| 6 | שֶׁלֹא (línea 36) | שֶׁלֹּא | el máster lo trae con dagesh en la línea 33 |
| 7 | תְּהֵא (línea 36) | תְהֵא | PDF sin dagesh en esta frase |
| 8 | עַבְדֶֽךָ | עַבְדֶּֽךָ | dagesh |
| 9 | הַמַּצוֹת | הַמַּצּוֹת | dagesh |
| 10 | וְחָנֵֽנוּ | וְחָנֵּֽנוּ | dagesh |
| 11 | יִזְדַּקֵק | יִזְדַּקֵּק | dagesh |
| 12 | עֻלֵֽנוּ | עֻלֵּֽנוּ | dagesh |
| 13 | גַם זָקַֽנְתִּי | גַּם | dagesh |
| 14 | חֶמְדָה | חֶמְדָּה | dagesh |
| 15 | בְּמַעַשֵׂה | בְּמַעֲשֵׂה | jatáf patáj |
| 16 | בַּעֲלִי | בַּעְלִי | shevá |
| 17 | נוֹתֵן | נֹתֵן | jolam jaser |
| 18 | יִשְׁבֹּר | יִשְׁבּוֹר | |
| 19 | לִשְׁבּוֹת | לִשְׁבָּת | |
| 20 | בִּשְׁלֹשָׁה | בִּשְׁלוֹשָׁה | |
| 21 | הַשָּׁבוּעוֹת | הַשָּׁבֻעוֹת | |
| 22 | כַּךְ | כֵּן | otra palabra |
| 23 | אַֽתָּה | אָֽתָּה | qamats bajo la א; podría ser errata del PDF |
| 24 | נָתַן | נָֽתַן | falta meteg |
| 25 | יַשְׁמִיעַ | יַשְׁמִֽיעַ | falta meteg |
| 26 | מִגְדּוֹל / מַגְדִּיל | מַגְדִּל | |

### Texto que el PDF tiene y el máster no
- הִנְנִי מוּכָן וּמְזוּמָּן… + línea en yiddish רַבּוֹתַי מִיר וֶועלֶען בֶּענְטְשֶׁען.
- En על הנסים: וְעַל הַנִּפְלָאוֹת, וְעַל הַנֶּחָמוֹת.
- Harajamán: יַעֲשֶׂה לָנוּ נִסִּים וְנִפְלָאוֹת…
- El máster no tiene contrapartida del PDF para el zimún de siete bendiciones (líneas 14-15 del máster, sin meteg; la línea 9 sí lo trae).

### Puntuación
El máster reescribió comas y puntos (el PDF usa «,» donde el máster pone «.», y al revés). El PDF también usa «׃» antes de citas.

## 3. Defectos del propio PDF
- Pág. 19: זָקַֽנְתִּי sin qamats bajo la ז (verificado a 600 dpi). El máster está bien.

## 4. Rafe: lo que muestra ArtScroll
Todos los rafe están en shevá na. Casos: tras jolam (בּוֹרְֿאֵֽנוּ, הָאֹמְֿרִים), tras dagesh jazak (הַגְּֿבוּרוֹת), tras kamats (מָרְדְּֿכַי), en sustantivos femeninos -תְֿךָ (תּוֹרָתְֿךָ, בְּרִיתְֿךָ). Insumo directo para derivar rafe por reglas.
