# Auditoría Tehilim 1–150 — primera línea de base

**Fecha:** 2026-10-02  
**Estado:** EN CURSO — **NO APTO TODAVÍA PARA PRODUCCIÓN MASIVA**  
**Rama:** `desarrollo/auditoria-tehilim-150`  
**Respaldo estable:** `respaldo/antes-auditoria-tehilim-150-2026-10-02`

## Fuente independiente de contraste

**Open Scriptures Hebrew Bible (OSHB), Westminster Leningrad Codex, Ps.xml**, con niqqud, taamim y morfología.

- Texto fuente: https://github.com/openscriptures/morphhb/blob/master/wlc/Ps.xml
- Pin Git blob SHA: `2da40d4bfc7d1772eccb6f49cf027f460b8be4f4`
- Licencia: texto WLC de dominio público; anotaciones morfológicas OSHB CC BY 4.0.
- Atribución requerida: **Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb**.

Este corpus es una referencia independiente para el análisis lingüístico, NO reemplaza automáticamente el hebreo usado en los masters de Judaica Design ni el de Wikisource.

## Primer barrido automático — 150/150 capítulos

Se procesaron **150 salmos, 2.527 versículos y 19.656 palabras** del corpus fuente.

La instrumentación compara **la posición que selecciona `stressAccent` en `rawTranslit`** con la vocal que contiene un **taam local** inequívocamente identificable. Los resultados **NO** son una comparación exhaustiva de todas las salidas publicadas, ya que algunas palabras pasan por una capa de formas editoriales preaprobadas.

| Clasificación | Casos |
| --- | ---: |
| Sin taam en el token | 4.986 |
| Múltiples signos de cantilación | 2.139 |
| Marca prepositiva / postpositiva excluida para no generar falsos positivos | 1.672 |
| No instrumentables como múltiples núcleos del motor | 1.102 |
| Marca sin correspondencia confiable al núcleo de vocal del motor | 1.673 |
| **Comparables con este método** | **8.084** |
| Acuerdo en posición tónica inferida | **7.150** |
| **Discrepancias que requieren revisión** | **934** |

El **11,6 % de los casos comparables quedó señalado para análisis**, **NO** significa un 11,6 % de errores y **NO** puede utilizarse para calcular exactitud editorial. Existen falsos positivos, acentos musicales, vocales reducidas, variantes contextuales y las limitaciones del comparador.

### Priorización morfológica de las 934 discrepancias

| Familia, según código morfológico OSHB | Casos a investigar |
| --- | ---: |
| `Sp2` — sufijos de 2.ª persona | 211 |
| `Sp1` — sufijos de 1.ª persona | 103 |
| `Ncm` — sustantivos masculinos | 84 |
| `Vqp` — verbos qal perfectos | 75 |
| `Sp3` — sufijos de 3.ª persona | 75 |
| `Vqi` — verbos qal imperfectos | 61 |
| `Vqr` — participios qal | 41 |

En algunas **formas hebreas idénticas con los mismos signos de niqqud**, distintos pasajes presentan la marca masorética en otra posición: no suponer que la vocalización por sí sola siempre alcanza para el mismo acento. Hace falta verificar contextos y los valores exactos de los signos antes de atribuir cada diferencia a la pronunciación.

## Primera corrección estructural realizada

**Confirmada:** `אֲשֶׁר → asher`, `כַּאֲשֶׁר → kaasher`. La antigua heurística de *segolados* trataba erróneamente un **hataf** inicial como si fuera una vocal plena de un sustantivo segolado y desplazaba el acento hacia el comienzo. Se corrigió el criterio estructural de segolado **sin agregar la fonética de la palabra como parche**.

- Con tests positivos y contraejemplos: `אֶרֶץ`, `דֶּרֶךְ`, `עָוֶל`.
- Todas las regresiones internas y las de Nakdan: **0 fallos** tras la corrección.
- Comparando ambos barridos de igual metodología antes/después: las discrepancias bajaron de **1.028 a 934** (94 candidatos menos); esto **no prueba por sí solo** que 94 errores reales estén corregidos.

Commit: `3f3826273ceeab974127a6946c02a39d3e0585ca`.

## Herramienta reproducible

`node tests/tehilim-taam-audit.mjs --out /tmp/tehilim-audit.json`

- Recupera el XML de la fuente de referencia y exige **SHA Git blob exacto**, para impedir analizar una versión cambiada silenciosamente.
- También acepta `--xml /ruta/Ps.xml` para ejecución sin conexión.
- Compara taamim locales; **excluye explícitamente** `U+05AD`, `U+059D` y `U+05AE` y separa palabras con marcas múltiples o sin correspondencia simple.
- Genera distribución por morfología, candidatos repetidos y palabras con datos de acentuación distintos.
- Se mantiene **separada** del control editorial general. No bloquear la publicación basándose solo en una métrica que incluye falsos positivos.

## Criterio de finalización

La herramienta NO se declara lista solo por completar 150 salmos o conseguir cero pruebas internas. Necesitamos:

1. Resolver las familias recurrentes comprobando cada hipótesis con taamim, morfología y contraejemplos.
2. Aumentar el corpus de casos válidos que hoy no se pueden medir por el método simple.
3. Verificar **la fonética efectivamente publicada por el motor**, incluidos los overrides editoriales.
4. Pruebas paralelas de sidur, Birkat Hamazón (Ashkenaz / Sefaradí / Jabad), Shemá, Perek Shirá, nombres, zemirot y canciones israelíes.
5. Revisión de forma consistente de `כָּאָמוּר פּוֹתֵחַ אֶת יָדֶךָ וּמַשְׂבִּיעַ` y de todos los textos maestros **a partir de su hebreo exacto**, no de ediciones antiguas no comprobadas.
6. Registrar y cuantificar lo que todavía queda incierto. **No prometer 99,99 % sin medir frente a una referencia fiable y representativa.**
7. No cambiar `main` ni generar el Tehilim definitivo sin pruebas de aceptación y consulta de pautas de InDesign al usuario.

## Documentación externa del método

- Unicode, posiciones de marcas: https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-9/
- Mechon Mamre: https://mechon-mamre.org/c/hr/codes.htm
- OSHB: https://github.com/openscriptures/morphhb
