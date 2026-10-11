# Depuración del generador · 11/10/2026

Base revisada: `9604084ab28e4c5983d74492c6da220279d8eb1d`.

## Cambios verificados

- Retiradas 624 entradas que repetían exactamente la salida del motor de reglas: 530 de GOLD.sef.w, 75 de APPROVED, 17 de FINAL_FORMS y 2 de GOLDEN_EDITORIAL. Las entradas normalizadas redundantes quedan como pruebas de compatibilidad fuera del código que se descarga al navegador.
- Eliminado `transliterateHebrew`, procedimiento antiguo no utilizado por la pantalla. Eliminados también sus auxiliares sin consumidores, PFX sin consumidores y dos funciones vacías (`lexicalStress` y `applySpanishStress`). La pantalla conserva su único recorrido `phonetize`.
- El ejecutor descubre todos los tests `.mjs` del directorio, para que una prueba nueva no quede fuera por una lista manual. CI no vuelve a ejecutar las tres comprobaciones que ahora descubre el ejecutor.
- La dirección antigua `judaica-design-system/fonetica/` redirige al generador vigente `fonetica-hebreo/`, preservando parámetros y ancla. No hay una segunda copia del motor allí.

No se modificaron el hebreo, nikud, puntuación, estado editorial ni archivos máster. No se cambió la salida anterior: comparación de 150 salmos / 2.527 versículos, cero diferencias. Salmo 14: 7/7 versículos coinciden con el máster actual. Auditoría técnica: 19.649 palabras, cero flags técnicos, cero regresiones internas. Estas comprobaciones no certifican que los 150 salmos estén lingüísticamente cerrados.

## Qué constituye el motor

El motor sigue siendo mixto; no se lo presenta como exclusivamente gramatical.

1. Reglas para consonantes, begadkefat, vocales, shevá, letras mater, sílabas, familias de sufijos/prefijos y tildes españolas.
2. Información léxica: 19 formas/clases de acento y 95 esqueletos de nombres propios. Acéntos y nombres no siempre pueden deducirse del nikud aislado. La capitalización no cambia la fonética.
3. Evidencia de edición: 365 contextos registrados de ArtScroll aportan posición del acento, shevá observada y capitalización. No se trata cualquier U+05BD pegado por el usuario como prueba de procedencia ArtScroll.
4. Pronunciaciones heredadas pendientes de migración: quedan 306 entradas entre cuatro capas, para 270 claves distintas, además de 15 sustituciones por contexto del corpus y 10 campos de spelling en observaciones de ArtScroll. Los contadores no son sumables como si fueran todas palabras diferentes.

No se han convertido esos datos heredados en supuestas reglas simplemente renombrándolos. La migración posterior debe deducir familias gramaticales, contrastar variantes y contraejemplos y demostrar que el texto aprobado no se altera. Una observación de una palabra o verso no debe convertirse en una regla universal sin evidencia.

## Peso

Antes: página del generador 246.193 bytes. Después: 225.007 bytes, reducción 21.186 bytes (8,61%). La página y su puente local suman 226.144 bytes, sin las fuentes externas ni llamadas de Nakdan. El repositorio completo incluye documentación y fixtures, por lo que su tamaño no equivale a la descarga de la aplicación.

El sistema eliminó una copia antigua de 148.620 bytes y dejó una redirección de menos de 1 KB. Se conservan los TXT derivados, capturas de referencia, pruebas visuales y revisiones históricas que tienen consumidores o valor editorial. Se preserva el historial Git.

## Comprobaciones

`node scripts/run-regressions.mjs`: 13/13 comprobaciones. Incluye los 624 casos retirados, NFC/NFD, errores y respuestas tardías de Nakdan, procedencia ArtScroll, lectura de los másters actuales y puntuación del salmo 14.

`node scripts/audit-tehilim.mjs <tehilim.json>`: 150 salmos, 2.527 versículos; auditoría mecánica sin fallos. Comparación adicional antes/después en todo el corpus: cero cambios de salida.
