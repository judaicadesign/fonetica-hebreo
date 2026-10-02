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

## Segunda iteración — corpus completo y salida publicada (2026-10-02)

**Rama:** `desarrollo/auditoria-tehilim-150`. **Motor bajo prueba:** commit `d7a34994b3c21e767243df573f6291b9d68182b9`. Esta sección registra resultados de GitHub Actions [ejecución 36985669172](https://github.com/judaicadesign/fonetica-hebreo/actions/runs/36985669172).

### Nuevas observaciones instrumentadas

El auditor ahora conserva por separado la comparación de `rawTranslit` y una comprobación acotada de la **salida real** `phonetize`. Para esta última, solo se compara el acento si la forma final coincide con la forma generada estructuralmente tras ignorar tildes y mayúsculas; los casos que cambian letras, sílabas u otras convenciones editoriales quedan expresamente **no alineados** y requieren otro método. Los resultados no equivalen a estimaciones de exactitud.

| Métrica | Línea de base anterior | Segunda iteración |
|---|---:|---:|
| Salmos | 150 | 150 |
| Unidades OSHB `<w>` | 19.656 | 19.656 |
| Comparables por taam local — capa estructural | 8.084 | 8.084 |
| Candidatos señalados — capa estructural | 934 | 868 |
| Candidatos en salida final alineable | 832¹ | 804 |
| Casos finales alineables | 7.604¹ | 7.604 |
| Casos sin alineación final automática | 480¹ | 480 |
| Fixtures editoriales | 20 | 33 |
| Fallos en pruebas editoriales, internas y merge Nakdan | 0 | 0 |

¹ Cifras registradas después de instrumentar `phonetize` y **antes** de los cambios morfológicos finales, por lo que son otra línea de base dentro de esta misma iteración. No forman parte del inventario inicial publicado en la sección anterior.

También se ejecutaron **66 pruebas adicionales** que insertan meteg o taam en los casos editoriales vocalizados y confirman invariancia de la fonética editorial; se añadió un contraejemplo en el que cambia el niqqud. El código de prueba, el auditor y el workflow están en la rama de desarrollo.

### Dos familias morfológicas corregidas sin entradas de palabra completa

1. **Preposición simple con shevá + sufijo -ךָ**: se recupera el acento final en el patrón de dos letras (`לְךָ` → `Lejá`; `בְּךָ` → `Bejá`). La regla de sufijos nominales de varias sílabas se conserva (`בֵּיתְךָ` → `Beteja`).
2. **No confundir sufijos pronominales con segolados**: `לָהֶם` → `Lahem`, `לָכֶם` → `Lajem`, `בָּהֶם` → `Bahem`, sin alterar los contraejemplos de sustantivos `לֶחֶם`, `שֶׁכֶם` y `דֶּרֶךְ`.
3. **Diferenciación acotada de formas verbales frente a segolados**: en contextos gráficos de Pi'el perfecto i-e con dagesh interno (`דִּבֶּר` → `Diber`) y Qal e-a con א final (`אֶשָּׂא` → `Esá`). No se introdujo una tabla de pronunciaciones de palabras aisladas. Se conservan `רֶגַע`, `סֶלַע` y `שָׁקֶר` como contraejemplos.

**Control de alcance:** un intento demasiado amplio de restringir la heurística segolada empeoró el corpus a 1.115 candidatos estructurales y 1.038 finales. Ese intento se descartó; la regla final acotada redujo ambos valores a **868 y 804** respectivamente. Este episodio demuestra que **0 fallos en fixtures no equivale a ausencia de regresiones en el corpus**.

### Privacidad y puertas de calidad

- `main` y la rama de respaldo permanecieron sin modificación. El trabajo se hizo en `desarrollo/auditoria-tehilim-150`.
- GitHub Actions ejecutó los tests editoriales, la auditoría completa de los 150 salmos y un acceso HTTP a la **URL habitual** `https://judaicadesign.github.io/fonetica-hebreo/`: **404** en la ejecución 36985669172. Este chequeo **no confirma si GitHub Pages está deshabilitado en Settings ni descarta un dominio personalizado**. Verificar la configuración directamente con permisos de administración antes de dar por cerrada la auditoría de exposición.
- El corpus OSHB se consulta con comprobación de SHA; ni el código privado ni los textos maestros se publican como sitio.
- **NO-GO editorial:** siguen 804 candidatos de acento entre casos finales alineables, 480 sin alineación, signos de cantilación no locales y ketiv/qere que requieren metodología adicional. No se ha medido la fidelidad total de la fonética de todos los textos y géneros, ni la fiabilidad contextual en línea de Dicta/Nakdan. No asignar porcentaje global de precisión.
- Antes de aprobar producción, ampliar casos contrastados por morfología, comprobar consonantes/vocales/sufijos de la salida **en contexto**, incorporar masters litúrgicos aprobados por versión y comprobar las traducciones independientemente.
