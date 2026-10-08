# Control editorial Tehilim — ArtScroll

**Estado general: EN REVISIÓN. NINGÚN CAPÍTULO DE ESTA TANDA ESTÁ APROBADO PARA IMPRENTA.**

Tres puertas obligatorias:

1. **Hebreo aprobado**: Wikisource como base digital; comparación exhaustiva en orden de cada letra, nikud, meteg U+05BD y marcas superiores de shevá na con la imagen ArtScroll exacta.
2. **Fonética GOLDEN aprobada**: derivada solo del hebreo confirmado; regla sefardí de Judaica Design; tilde únicamente cuando el español leería mal el acento; mayúsculas referenciales en contexto.
3. **Generador aprobado**: ejecutar cada versículo, comparar su salida con el GOLDEN y comprobar regresiones del corpus anterior.

## Capítulos importados — borradores, no aprobados

| Capítulo | Versículos | Hebreo ArtScroll | GOLDEN fonética | Prueba del motor |
|---|---:|---|---|---|
| [13](./013__ARTSCROLL_EN_REVISION.md) | 6 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [20](./020__ARTSCROLL_EN_REVISION.md) | 10 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [24](./024__ARTSCROLL_EN_REVISION.md) | 10 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [25](./025__ARTSCROLL_EN_REVISION.md) | 22 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [26](./026__ARTSCROLL_EN_REVISION.md) | 12 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [27](./027__ARTSCROLL_EN_REVISION.md) | 14 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [28](./028__ARTSCROLL_EN_REVISION.md) | 9 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [29](./029__ARTSCROLL_EN_REVISION.md) | 11 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |
| [30](./030__ARTSCROLL_EN_REVISION.md) | 13 | Parcial / pendiente | Pendiente | Salida real registrada (no comparada con GOLDEN) |

**Total de versículos en borrador: 107.**

## Correcciones guardadas

- 24:6: ArtScroll דֹּרְשָׁיו y shevá na → doreshav; se distingue del texto de Wikisource.
- 20: 12 meteg de grafías aportadas explícitamente por el editor; no inferir los faltantes.
- 20:4–5: ve'olatejá y 'atsatejá.
- ציון: Tsiyón / miTsiyón / umiTsiyón con prefijos minúsculos.
- 26:2: distinguir ketiv y qere de Wikisource. ArtScroll presenta lectura vocalizada; otros signos pendientes.
- 27:13: quitar puntos masoréticos extraordinarios de Wikisource en לוּלֵא que no aparecen en ArtScroll.
- 30:4: quitar el ketiv sin nikud מיורדי adicional que Wikisource intercala; en ArtScroll hay una sola palabra vocalizada en esa posición. El nikud final de la lectura restante sigue pendiente.

Motor de desarrollo corregido en commits eb523534 y 07a69e5b; pruebas internas sin fallos. No está implementada la lectura segura de meteg para todo texto ni el control automático de procedencia de Wikisource / ArtScroll.

## Otros salmos pendientes de completar

23, 83, 91, 112, 120, 121, 126, 127, 130, 137, 142 y otros mencionados durante la auditoría. Los dos PDFs fueron adjuntados nuevamente el 8/10/2026 y sus 22 páginas se pudieron abrir como imágenes legibles. El PDF Schottenstein contiene 13, 20, 91, 112, 120, 127, 130; el PDF Seif transliterado contiene 20, 83, 121, 130, 142. Los salmos 24–30 proceden de capturas de una app ArtScroll y son fuente visual separada. Hay que cotejar todas sus palabras, vocales, meteg y marcas de shevá na: que el archivo sea legible NO implica aprobación.

**NO-GO:** no publicar estos borradores como master aprobado, ni promover a main, ni usar en impresión hasta completar y certificar las tres puertas.

## Inventario de ediciones y criterio meteg

[Manifest de PDFs ArtScroll, páginas y control de procedencia](./ARTSCROLL_SOURCE_MANIFEST_2026-10-08.json). Schottenstein es autoridad editorial primaria para los salmos que incluye; Seif es fuente secundaria de pronunciación/transliteración y única edición de los salmos que no están en Schottenstein. El motor común IGNORA el meteg externo; no inferir acentos desde Unicode U+05BD importado. El aprendizaje inverso a partir de ArtScroll exige pares auditados por palabra y aparición; nunca sustituir el control editorial por meteg de Wikisource.
