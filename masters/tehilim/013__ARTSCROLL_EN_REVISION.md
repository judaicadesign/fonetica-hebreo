# Tehilim 13 — ArtScroll, EN REVISIÓN

Base: https://he.wikisource.org/wiki/תהלים_יג/ניקוד

Referencia principal: PDF ArtScroll Schottenstein, página 1. Fuente secundaria Seif, edición diferente.

El verso 13:6 incorpora 3 meteg citados expresamente por el editor. En 13:2 (dos veces) y 13:3 (dos veces), **אָנָה** aparece sin meteg visible sobre la vocal inicial en la página 1 de Schottenstein; de acuerdo con nuestro criterio de acento final, **aná** lleva tilde en español. La regla del generador está corregida, commit `6d77f5f`. No se han verificado exhaustivamente otros meteg ni todas las marcas auxiliares de shevá na. La salida fonética es la ejecución REAL del motor, no GOLDEN aprobado.

### 13:1

Hebreo en cotejo: לַמְנַצֵּחַ מִזְמוֹר לְדָוִד.

Generador actual: Lamnatséaj mizmor leDavid.

### 13:2

Hebreo en cotejo: עַד אָנָה יהוה תִּשְׁכָּחֵנִי נֶצַח עַד אָנָה תַּסְתִּיר אֶת פָּנֶיךָ מִמֶּנִּי.

Generador actual: 'Ad aná Ad-nai tishkajeni nétsaj 'ad aná tastir et paneja mimeni.

### 13:3

Hebreo en cotejo: עַד אָנָה אָשִׁית עֵצוֹת בְּנַפְשִׁי יָגוֹן בִּלְבָבִי יוֹמָם עַד אָנָה יָרוּם אֹיְבִי עָלָי.

Generador actual: 'Ad aná ashit 'etsot benafshí yagón bilvaví yomam 'ad aná yarum oyeví 'alái.

### 13:4

Hebreo en cotejo: הַבִּיטָה עֲנֵנִי יהוה אֱלֹהָי הָאִירָה עֵינַי פֶּן אִישַׁן הַמָּוֶת.

Generador actual: Habita 'aneni Ad-nai Elohái haíra 'enái pen ishán hamávet.

### 13:5

Hebreo en cotejo: פֶּן יֹאמַר אֹיְבִי יְכׇלְתִּיו צָרַי יָגִילוּ כִּי אֶמּוֹט.

Generador actual: Pen yomar oyeví yejoltiv tsarái yaguilu ki emot.

### 13:6

Hebreo en cotejo: וַאֲנִי בְּחַסְדְּךָ בָטַֽחְתִּי יָגֵל לִבִּי בִּישׁוּעָתֶֽךָ אָשִֽׁירָה לַיהוה כִּי גָמַל עָלָי.

Generador actual: Vaaní bejasdejá vatajti yaguel libí bishu'ateja ashira laAd-nai ki gamal 'alái.

**13:6 ya fue cerrado por separado:** [Hebreo + fonética GOLDEN verificados con ArtScroll](./verses/013_06__GOLDEN_ARTSCROLL.md). No implica que el salmo entero esté aprobado.

## Puerta de aprobación

- [x] Texto base de los 6 versículos importado.
- [ ] Nikud, meteg y shevá na verificados exhaustivamente contra Schottenstein.
- [ ] Fonética GOLDEN aprobada.
- [ ] Salida del generador comparada contra GOLDEN.

## Cotejo confirmado de grafía del Nombre (ArtScroll Schottenstein)

El PDF impreso muestra **יהוה** sin los signos de vocalización que Wikisource aplica en **יְהֹוָה**. En las 3 apariciones del capítulo se conservó la grafía impresa. Se retuvo el nikud del prefijo separado, cuando lo hay (por ejemplo לַיהוה). La pronunciación convencional del generador sigue siendo **Ad-nai**; la falta de nikud en el Nombre no autoriza vocalizarlo automáticamente con Nakdan.

## Cotejo adicional ArtScroll 13:3 y 13:5 — shevá na

La página PDF 1 de Schottenstein imprime la raya superior **sobre la יְ** de **אֹיְבִי** en ambas apariciones: esa shevá es *na*. Por lo tanto, la fonética exige la vocal **e**: **oyeví**, no **oyví**. Se corrigió el generador y se incorporó la forma a sus pruebas de regresión (commit `38cc737`). No se copia la raya superior al máster hebreo como meteg.
