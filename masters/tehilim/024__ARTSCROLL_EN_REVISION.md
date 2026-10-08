# Tehilim 24 — máster provisional de cotejo ArtScroll

**ESTADO: EN REVISIÓN — NO APROBADO PARA IMPRENTA.**

- Texto base: [Wikisource, תהלים כד/ניקוד](https://he.wikisource.org/wiki/תהלים_כד/ניקוד), edición con nikud SIN taamim.
- Autoridad editorial: capturas de ArtScroll enviadas por el editor el 8/10/2026.
- Motor probado: `desarrollo/auditoria-tehilim-150`, commit posterior a `07a69e5b`.
- Corrección confirmada contra imagen: **24:6 דֹּרְשָׁיו** (ArtScroll) reemplaza **דֹּרְשָׁו** (Wikisource). Shevá na en resh se pronuncia: **doreshav**.
- **No se certificaron todos los meteg** en esta importación. No agregar marcas no verificadas o derivadas de Wikisource con taamim. El niqqud de la base debe recibir una segunda lectura exacta contra la imagen ArtScroll antes de aprobar.
- Las formas fonéticas de abajo son la **salida real del motor**, no un GOLDEN aprobado; queda auditoría individual de fonética, signos, tildes, mayúsculas.

## Texto hebreo de trabajo y fonética del motor

### פסוק א

**Hebreo:** לְדָוִד מִזְמוֹר לַיהֹוָה הָאָרֶץ וּמְלוֹאָהּ תֵּבֵל וְיֹשְׁבֵי בָהּ.

**Generador:** LeDavid mizmor laAd-nai haarets umeloah tevel veyoshvé vah.

### פסוק ב

**Hebreo:** כִּי הוּא עַל יַמִּים יְסָדָהּ וְעַל נְהָרוֹת יְכוֹנְנֶהָ.

**Generador:** Ki Hu 'al yamim yesadah ve'al neharot yejonenehá.

### פסוק ג

**Hebreo:** מִי יַעֲלֶה בְהַר יְהֹוָה וּמִי יָקוּם בִּמְקוֹם קׇדְשׁוֹ.

**Generador:** Mi ya'alé vehar Ad-nai umí yakum bimkom kodshó.

### פסוק ד

**Hebreo:** נְקִי כַפַּיִם וּבַר לֵבָב אֲשֶׁר לֹא נָשָׂא לַשָּׁוְא נַפְשִׁי וְלֹא נִשְׁבַּע לְמִרְמָה.

**Generador:** Nekí japáyim uvar levav asher lo nasá lashav nafshí veló nishbá' lemirmá.

### פסוק ה

**Hebreo:** יִשָּׂא בְרָכָה מֵאֵת יְהֹוָה וּצְדָקָה מֵאֱלֹהֵי יִשְׁעוֹ.

**Generador:** Yisá verajá meet Ad-nai utsdaká meElohé yish'ó.

### פסוק ו

**Hebreo:** זֶה דּוֹר דֹּרְשָׁיו מְבַקְשֵׁי פָנֶיךָ יַעֲקֹב סֶלָה.

**Generador:** Ze dor doreshav mevakshé faneja Ya'akov sela.

### פסוק ז

**Hebreo:** שְׂאוּ שְׁעָרִים רָאשֵׁיכֶם וְהִנָּשְׂאוּ פִּתְחֵי עוֹלָם וְיָבוֹא מֶלֶךְ הַכָּבוֹד.

**Generador:** Seú she'arim rashejem vehinasú pitjé 'olam veyavó Mélej hakavod.

### פסוק ח

**Hebreo:** מִי זֶה מֶלֶךְ הַכָּבוֹד יְהֹוָה עִזּוּז וְגִבּוֹר יְהֹוָה גִּבּוֹר מִלְחָמָה.

**Generador:** Mi ze Mélej hakavod Ad-nai 'izuz veguibor Ad-nai guibor miljamá.

### פסוק ט

**Hebreo:** שְׂאוּ שְׁעָרִים רָאשֵׁיכֶם וּשְׂאוּ פִּתְחֵי עוֹלָם וְיָבֹא מֶלֶךְ הַכָּבוֹד.

**Generador:** Seú she'arim rashejem usú pitjé 'olam veyavó Mélej hakavod.

### פסוק י

**Hebreo:** מִי הוּא זֶה מֶלֶךְ הַכָּבוֹד יְהֹוָה צְבָאוֹת הוּא מֶלֶךְ הַכָּבוֹד סֶלָה.

**Generador:** Mi Hu ze Mélej hakavod Ad-nai tsevaot Hu Mélej hakavod sela.

## Diferencias concretas al contrastar Wikisource con la captura ArtScroll

La edición de Wikisource **con taamim** imprime U+05BD en posiciones que no se ven impresas como meteg en la captura de ArtScroll 24. **No trasladar esas marcas al máster**:

| Versículo | Wikisource con taamim | ArtScroll (captura) | Tratamiento del máster |
|---|---|---|---|
| 24:1 | `לַֽיהֹוָה` | `לַיהֹוָה` | Sin U+05BD en ל |
| 24:3 | `מִֽי־יַעֲלֶה` | `מִי יַעֲלֶה` | Sin U+05BD en מ |
| 24:7 / 24:9 | `רָֽאשֵׁיכֶם` | `רָאשֵׁיכֶם` | Sin U+05BD en ר, en ambas ocurrencias |
| 24:10 | `סֶֽלָה` | `סֶלָה` | Sin U+05BD en ס |

Estas son **diferencias de marcas identificadas**, no una certificación de que se haya inspeccionado exhaustivamente cada punto vocálico y cada shevá de los diez versículos. Los asteriscos encima de ciertas letras en ArtScroll son ayudas de shevá na y **nunca** se copian como meteg.

Se conserva la diferencia textual confirmada en 24:6: ArtScroll `דֹּרְשָׁיו`, Wikisource `דֹּרְשָׁו`; la fonética resultante es `doreshav`.

## Validaciones editoriales pendientes

- [x] Fuente digital y diez pesukim importados, con diferencia textual 24:6 contrastada contra captura.
- [ ] Cotejo íntegro de nikud, incluidas variantes y grafía del Nombre divino.
- [ ] Cotejo íntegro de meteg y su ubicación en cada repetición.
- [ ] Revisión de rayitas auxiliares de shevá na por aparición.
- [ ] GOLDEN fonético revisado, tildes y mayúsculas por contexto.
- [ ] Comparación GOLDEN vs salida ejecutada: igualdad en los 10 pesukim.
