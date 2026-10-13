# Rafe y meteg derivados por reglas (13/10/2026)

Rama `feature/meteg-rafe-reglas`. No se modificó ningún master.

## 1. Interruptor en el generador
Tarjeta nueva "3. Hebreo con meteg y rafe": dos casillas (meteg, rafe) que muestran el texto hebreo con las marcas.
La fonética es idéntica con o sin marcas: `applyVisualMarks()` solo cambia una palabra si `phonetize()` da exactamente lo mismo antes y después
(prueba `tests/visual-marks-invariance.mjs`). No toca el recuadro donde se pega el texto.

## 2. Rafe (shevá na)
Criterio de impresión de ArtScroll, medido sobre las 309 shevás del medio de palabra del PDF (51 con rafe):
- No lleva rafe la shevá inicial de palabra (0 de 309).
- No lleva rafe la inicial del tema tras un prefijo (וּמְ-, הַיְ-, וְהַ-), salvo que tenga dagesh, preceda a la misma letra o siga a otra shevá.
- Sí lleva rafe toda shevá na del medio de la palabra.

Resultado final: **rafe idéntico a ArtScroll en 1160 de 1160 palabras** (excluidos 3 defectos del PDF/yidish).
Antes de esta rama el motor reconocía 46 de los 51 rafe. Las cinco que fallaban eran un solo patrón: shevá tras qamats largo con prefijo.

Reglas agregadas al motor (`shevaVocalized`, `prefixBoundarySheva`):
1. Artículo o preposición fusionada con qamats delante de ר/guturales, también tras prefijos (וְהָרְחָבָה, וְלָרְשָׁעִים).
2. 3ª plural del perfecto CָCְCוּ con prefijos (וְקָבְעוּ, וְשָׁמְעוּ, וּבָרְכוּ…).
3. Participio Pi'el con alargamiento compensatorio (וּמְבָרְכִים).
4. 3ª plural Hitpa'el/Nitpa'el con ר (שֶׁנִּתְבָּרְכוּ, וְהִתְפָּרְדוּ).
5. 3ª femenino CָCְCָה: solo las formas verificadas en ArtScroll (hoy: עָמְדָה). Ver pendientes.

### Palabras cuya fonética cambia (19 en todo el vocabulario de los masters)
Confirmadas por rafe de ArtScroll: כְּשֶׁעָמְדָה Keshe'amedá (antes Keshe'amdá) · וְקָבְעוּ Vekave'ú · וּמְבָרְכִים Umevarejim · וְהָרְחָבָה Veharejavá · שֶׁנִּתְבָּרְכוּ Shenitbarejú.
Mismo patrón gramatical con prefijo (la forma sin prefijo ya se leía con shevá na): וְאָמְרוּ Veamerú · וְיָשְׁבוּ Veyashevú · וְעָזְבוּ Ve'azevú · וְדָרְכוּ Vedarejú · וְדָרְשׁוּ Vedareshú · וּבָרְכוּ Uvarejú · וְשָׁמְעוּ Veshame'ú · וְיִתְבָּרְכוּ Veyitbarejú · וְהִתְפָּרְדוּ Vehitparedú · יִתְפָּרְדוּ Yitparedú · הִוָּסְרוּ Hivaseru · וְהִנָּשְׂאוּ Vehinaseú · וְלָרְשָׁעִים Velaresha'im · עָמְדָה 'Amedá.
Los masters de Bircat Hamazón (ashkenaz) tienen hoy las cinco primeras con shevá muda: requieren tu aprobación.

## 3. Meteg
ArtScroll pone meteg en la sílaba tónica cuando no es la última. El perfil Sefaradí israelí del generador acentúa algunas palabras distinto de la tradición
(אַעֲלֶה, לְשׁוֹנִי), así que el meteg no sale de la fonética pública sino de un modelo de acento tradicional:
- Entrenado con 12.952 palabras de los 150 Tehilim, con acento verificado por teamim (Códice de Leningrado, OpenScriptures).
- En los Tehilim el 99,8 % de los acentos no finales caen en la penúltima sílaba: el meteg va en la penúltima.
- Validación por salmo no visto: 92,8 %. **Validación en ArtScroll Bircat Hamazón (texto no usado para aprender): 96,4 % de las palabras (1118/1160).**
- Palabras unidas por maqqef: la primera no recibe meteg.
- Código y datos: `tools/stress_tree/` (train.py, inject.mjs, etiquetas). El árbol está dentro de `index.html` entre `STRESS_TREE:BEGIN/END`.

Fallas típicas (42 palabras): vav conversiva (וְאָכַלְתָּ, וּבֵרַכְתָּ: milrá), palabras que ArtScroll deja sin meteg (בָּבֶל, שֶׁלֹּא, מִשֶּׁלּוֹ),
meteg secundario/ga'ya (עָֽרוּ, שִֽׁירוּ, וְעֹֽשֶׂה). Se corrigen agregando excepciones verificadas, no con más datos de Tehilim.

### El meteg no siempre es solo visual
En 8 de las 646 palabras con meteg de los masters, el meteg es una ga'ya que vuelve muda la shevá siguiente:
שֹֽׁפְטֵי Shofté · וְתֹֽאבְדוּ · וְיֹֽאבְדוּ · אָֽכְלוּ Ajlú · נָֽפְלוּ Naflú · סָּֽגְרוּ Sagrú · יֹֽשְׁבֵי Yoshvé · נִֽירְשָׁה Nirshá.
Sin ese meteg, el motor las leería con shevá na (Shofeté, Ajelú…). Por eso `applyVisualMarks` conserva el meteg de la fuente cuando quitarlo cambiaría la fonética.
Para textos sin teamim ni meteg (Jabad) esas 8 formas quedan pendientes de una regla de ga'ya.

## 4. Pendientes que necesitan tu ojo en el ArtScroll impreso
- ¿Lleva rafe sobre la פ שָׁפְרָה (Tehilim 16:6)? Hoy se lee "shafrá" (shevá muda). Misma duda para דָּבְקָה, כָּלְתָה, עָתְקָה, שָׁכְנָה, שָׂבְעָה, נָתְנָה (perfecto 3ª f.).
  Gramaticalmente son iguales a עָמְדָה (que ArtScroll marca con rafe), pero hay sustantivos con qamats katan (חָכְמָה), por eso no se generalizó sin evidencia.
- Capa de rafe para los masters hebreos (58 marcas verificadas: 51 en Bircat Hamazón + 7 en Salmos 137/126) y correcciones de Bircat Hamazón del informe de cotejo: esperan tu aprobación y acceso de escritura a judaica-design-system.
- Reglas 6 y 7 de Shaar HaShva (Gaón de Vilna) y reglas de Rab Yaakov Emden: todavía no se contrastaron con datos.

## 5. Cómo reproducir
```
node tools/rafe_engine_check.mjs docs/artscroll/ASHKENAZ_PDF_EXTRAIDO_20261013.txt   # shevá vocal del motor vs rafe de ArtScroll
node tools/marks_eval.mjs docs/artscroll/ASHKENAZ_PDF_EXTRAIDO_20261013.txt --list    # rafe y meteg derivados vs ArtScroll
node scripts/run-regressions.mjs                                                       # 20 pruebas
```
