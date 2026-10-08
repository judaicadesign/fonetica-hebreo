# Tehilim 13 — cierre editorial

**APROBADO: 6/6 pesukim.** ArtScroll Schottenstein Edition Tehillim Simchas Yehoshua, PDF 1, capítulo 13 completo. Digitalización base Wikisource, corregida según la página impresa. No se reproducen rayas superiores de shevá na; en el hebreo solo se reproducen los meteg editoriales visibles.

Los versículos 1 y 6 cuentan con fichas GOLDEN independientes en `../verses/`.

| Pasuk | Control editorial específico | Comparación GOLDEN = generador |
|---|---|---|
| 13:1 | ArtScroll marca shevá na en מְ de לַמְנַצֵּחַ con raya superior; el máster omite esa raya, sin agregar meteg. | OK |
| 13:2 | ArtScroll imprime יהוה sin nikud. Ambas apariciones de אָנָה sin meteg inicial: aná. | OK |
| 13:3 | Shevá na sobre יְ de אֹיְבִי: oyeví. אָֽנָה no aparece marcado: aná. | OK |
| 13:4 | Nombre divino sin nikud; acentuaciones españolas verificadas según lectura en edición ArtScroll. | OK |
| 13:5 | Shevá na en אֹיְבִי → oyeví, no oyví; el kamatz pequeño de יְכׇלְתִּיו se representa con Unicode U+05C7. | OK |
| 13:6 | Tres meteg según ArtScroll, sin tildes españolas innecesarias. Texto validado anteriormente en archivo específico 013_06. | OK |

- [x] Texto consonántico y vocalización cotejados contra imagen impresa.
- [x] Meteg ArtScroll reproducidos en el máster en sus posiciones verificadas; sin extrapolar desde Wikisource.
- [x] Marcas superiores de shevá na leídas como instrucción fonética y no insertadas como meteg.
- [x] GOLDEN español con las tildes estrictamente necesarias y mayúsculas convencionales.
- [x] Seis salidas del motor iguales al GOLDEN, 0 fallos en regresiones internas.

**Límite:** este cierre solo corresponde al Salmo 13 de esta edición; no aprueba otros capítulos ni convierte meteg importado libremente en acento.
