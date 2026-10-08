# Control editorial Tehilim — ArtScroll

**Estado general: EN REVISIÓN. NINGÚN CAPÍTULO DE ESTA TANDA ESTÁ APROBADO PARA IMPRENTA.**

Tres puertas obligatorias:

1. **Hebreo aprobado**: Wikisource como base digital; comparación exhaustiva en orden de cada letra, nikud, meteg U+05BD y marcas superiores de shevá na con la imagen ArtScroll exacta.
2. **Fonética GOLDEN aprobada**: derivada solo del hebreo confirmado; regla sefardí de Judaica Design; tilde únicamente cuando el español leería mal el acento; mayúsculas referenciales en contexto.
3. **Generador aprobado**: ejecutar cada versículo, comparar su salida con el GOLDEN y comprobar regresiones del corpus anterior.

## Capítulos importados — borradores, no aprobados

| Capítulo | Versículos | Hebreo ArtScroll | GOLDEN fonética | Prueba del motor |
|---|---:|---|---|---|
| [13](./013__ARTSCROLL_EN_REVISION.md) | 6 | Pendiente | Pendiente | Salida real registrada |
| [20](./020__ARTSCROLL_EN_REVISION.md) | 10 | Pendiente | Pendiente | Salida real registrada |
| [24](./024__ARTSCROLL_EN_REVISION.md) | 10 | Pendiente | Pendiente | Salida real registrada |
| [25](./025__ARTSCROLL_EN_REVISION.md) | 22 | Pendiente | Pendiente | Salida real registrada |
| [26](./026__ARTSCROLL_EN_REVISION.md) | 12 | Pendiente | Pendiente | Salida real registrada |
| [27](./027__ARTSCROLL_EN_REVISION.md) | 14 | Pendiente | Pendiente | Salida real registrada |
| [28](./028__ARTSCROLL_EN_REVISION.md) | 9 | Pendiente | Pendiente | Salida real registrada |
| [29](./029__ARTSCROLL_EN_REVISION.md) | 11 | Pendiente | Pendiente | Salida real registrada |
| [30](./030__ARTSCROLL_EN_REVISION.md) | 13 | Pendiente | Pendiente | Salida real registrada |
| [83](./083__ARTSCROLL_EN_REVISION.md) | 19 | Pendiente | Pendiente | Salida real registrada |
| [91](./091__ARTSCROLL_EN_REVISION.md) | 16 | Pendiente | Pendiente | Salida real registrada |
| [112](./112__ARTSCROLL_EN_REVISION.md) | 10 | Pendiente | Pendiente | Salida real registrada |
| [120](./120__ARTSCROLL_EN_REVISION.md) | 7 | Pendiente | Pendiente | Salida real registrada |
| [121](./121__ARTSCROLL_EN_REVISION.md) | 8 | Pendiente | Pendiente | Salida real registrada |
| [127](./127__ARTSCROLL_EN_REVISION.md) | 5 | Pendiente | Pendiente | Salida real registrada |
| [130](./130__ARTSCROLL_EN_REVISION.md) | 8 | Pendiente | Pendiente | Salida real registrada |
| [142](./142__ARTSCROLL_EN_REVISION.md) | 8 | Pendiente | Pendiente | Salida real registrada |

**17 capítulos y 188 versículos importados.** Las 188 salidas del motor coinciden al volver a ejecutarlas. Esto no equivale a aprobación editorial.

## Correcciones guardadas

- 24:6: ArtScroll דֹּרְשָׁיו y shevá na → doreshav; se distingue del texto de Wikisource.
- 20: 12 meteg de grafías aportadas explícitamente por el editor; no inferir los faltantes.
- 20:4–5: ve'olatejá y 'atsatejá.
- ציון: Tsiyón / miTsiyón / umiTsiyón con prefijos minúsculos.
- 26:2: distinguir ketiv y qere de Wikisource. ArtScroll presenta lectura vocalizada; otros signos pendientes.
- 27:13: quitar puntos masoréticos extraordinarios de Wikisource en לוּלֵא que no aparecen en ArtScroll.
- 30:4: quitar el ketiv sin nikud מיורדי adicional que Wikisource intercala; en ArtScroll hay una sola palabra vocalizada en esa posición. El nikud final de la lectura restante sigue pendiente.

Motor de desarrollo corregido en commits eb523534 y 07a69e5b; pruebas internas sin fallos. No está implementada la lectura segura de meteg para todo texto ni el control automático de procedencia de Wikisource / ArtScroll.

## Otros salmos y etapas pendientes

Los 10 salmos que aparecen en los dos PDFs ArtScroll ya tienen borradores: 13, 20, 83, 91, 112, 120, 121, 127, 130 y 142. Los salmos 24–30 proceden de capturas de la aplicación ArtScroll. Siguen faltando de otros trabajos 23, 126, 137. Las páginas son legibles; el cotejo completo palabra por palabra y el GOLDEN siguen pendientes.

**NO-GO:** no publicar estos borradores como master aprobado, ni promover a main, ni usar en impresión hasta completar y certificar las tres puertas.

## Inventario de ediciones y criterio meteg

[Manifest de PDFs ArtScroll, páginas y control de procedencia](./ARTSCROLL_SOURCE_MANIFEST_2026-10-08.json). Schottenstein es autoridad editorial primaria para los salmos que incluye; Seif es fuente secundaria de pronunciación/transliteración y única edición de los salmos que no están en Schottenstein. El motor común IGNORA el meteg externo; no inferir acentos desde Unicode U+05BD importado. El aprendizaje inverso a partir de ArtScroll exige pares auditados por palabra y aparición; nunca sustituir el control editorial por meteg de Wikisource.

## Control reproducido de esta tanda

17 archivos, 188 versículos; 188/188 salidas guardadas idénticas a ejecución del generador de desarrollo; 0 fallos en regresiones internas. La prueba solo certifica consistencia del volcado, no ArtScroll ni GOLDEN. 15 casos de meteg externo no alteran la fonética de modo normal.
