# Auditoría masiva Tehilim — primera pasada (2026-10-02)

**Estado: EN PROCESO — NO habilita publicación del Tehilim completo.**

## Fuente de contraste

Open Scriptures Hebrew Bible / morphhb, archivo `wlc/Ps.xml`, blob Git SHA `2da40d4bfc7d1772eccb6f49cf027f460b8be4f4`. Se utiliza como **fuente técnica de comprobación masorética**, no como reemplazo de los textos maestros de Judaica Design ni de la versión de Wikisource acordada para maquetación.

## Cobertura real de la primera pasada

- 150 capítulos; 2.527 versículos; **19.656 unidades** `<w>` examinadas.
- 19.510 unidades con niqqud en el origen; **146 unidades sin niqqud** (entre ellas grafías de ketiv/qere que requieren distinguir lectura del texto y texto escrito; no se deben convertir en excepciones arbitrarias).
- 14.670 unidades contienen signos de cantilación U+0591–U+05AF; 3.934 contienen meteg U+05BD.
- 8.206 formas gráficas diferentes después de quitar cantilación y meteg.
- **Esta prueba NO valida todavía la posición del acento de cada palabra ni la fonética completa frente a una edición humana.** Solo mide propiedades técnicas e invariantes.

## Hallazgo de la primera pasada: meteg / ga'ya

Antes del cambio:
- 88 ocurrencias (en **66 salmos**) se transliteraban de manera distinta simplemente por la presencia de meteg U+05BD, aunque el hebreo vocalizado restante fuera idéntico.
- Ejemplos de divergencia: `וְֽכָל → vejal` vs. `וְכָל → vejol`, `וַֽיְהִי → vaihi` vs. `וַיְהִי → vayehí`, `תַֽחַת → tajat` vs. `תַחַת → tájat`.

Corrección realizada en rama de desarrollo, commit `e0d58f15fce293028fa1e9848f4153ae644b0f12`:
- `norm()` ahora elimina meteg como signo no determinante para la grafía fonética editorial, junto con los signos de cantilación en las claves léxicas.
- Se añadieron pruebas de regresión de ambos casos.
- Resultado tras la modificación sobre todo el corpus: **0 discrepancias por meteg**, **0 discrepancias por signos de cantilación**, **0 palabras con hebreo filtrado a la salida**, **0 salidas vacías**, **0 caracteres inválidos detectados**, **0 fallos en tests previos de regresión y merge**.

### Límites de estas métricas

- La invariancia ortográfica **no implica** que cada palabra haya sido pronunciada correctamente. Una lectura errónea pero consistentemente errónea pasaría esta prueba.
- Meteg es un signo prosódico que puede aportar información útil en análisis masorético; se elimina del *proceso de fonetización editorial* pero debe conservarse en la **fuente de contraste**. No eliminarlo de los textos maestros hebreos que el usuario provea.
- 146 unidades sin niqqud de la fuente externa requieren manejo específico: no clasificarlas automáticamente como errores del motor. La primera pasada detectó 58 salidas de esas formas sin vocal latina porque el original no contiene vocales.
- Falta revisar acento principal con taamim (especialmente las palabras con maqqef y acentos excepcionales), morfología verbal, shevá, qamats qatan, y distinguir ketiv/qere.
- Falta una batería independiente de *pares hebreo → fonética validada por expertos*, separada de las reglas con que se generó la salida; sin ella no existe estimación válida de exactitud del 99,99 %.

## Siguientes pasos y puerta de publicación

1. Hacer una auditoría contrastiva por categorías de errores de acento, verbos, sufijos, shevá, préstamos y qamats, muestreando primero las formas de alto riesgo/frecuencia.
2. Generar positivos y negativos morfológicos + material de contraste independiente. Verificar no regresión de textos litúrgicos y modernos.
3. Diferenciar explícitamente garantías de la **fonética de hebreo ya vocalizado** de la fiabilidad contextual del **Nakdan de hebreo sin vocalizar**.
4. Preparar una decisión documentada `GO / NO-GO` para uso editorial de la herramienta **sin obligar a que los 150 salmos ya estén maquetados**.
5. Recién con `GO`, solicitar pautas de InDesign del usuario ANTES de producir el Tehilim final.
