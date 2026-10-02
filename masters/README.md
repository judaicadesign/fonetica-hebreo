# Biblioteca de textos maestros — Judaica Design

## Acceso fácil · textos actualmente disponibles

**[ABRIR BIBLIOTECA DE BIRCAT HAMAZÓN — ASHKENAZ Y SEFARADÍ](./bircat-hamazon/README.md)**

- Dos TXT con **hebreo y fonética**, guardados para revisión sin alterar sus versiones originales.
- Estado actual: **EN REVISIÓN**, no usarlos todavía como referencia definitiva de impresión.
- [Leer la revisión del hebreo](./bircat-hamazon/REVISION_IVRIT_2026-10-02.md).
- Los textos incorporan solo los cambios fonéticos expresamente autorizados a `'amjá` y `ule'amjá`. El hebreo original todavía contiene problemas puntuales de niqqud y encabezados repetidos.


Esta carpeta contendrá las **versiones editoriales aprobadas**. No publicar ni completar un master con texto inventado o tomado de memoria: se importará una versión específica comprobada en las fuentes del proyecto.

## Identidad editorial

La clave de contenido incluye `obra + nusaj + edición`. No mezclar variantes de contenido.

Ejemplos de IDs propuestos (solo identificadores, **no textos aún aprobados**):

- `birkat-hamazon--ashkenaz`
- `birkat-hamazon--sefaradi`
- `birkat-hamazon--jabad`
- `shema`, `perek-shira`, `tehilim`

El perfil **fonético** es independiente del nusaj: `sefaradi-israeli-es-AR`.

## Contrato de cada master

Cada registro incluirá: `id`, `title`, `nusaj`, `status`, `contentVersion`, `hebrewText`, `phoneticText`, `spanishTranslation` (si aplica), fuentes bibliográficas, revisor, fecha de revisión, motor utilizado (commit SHA exacto), historial de cambios y dependencias de productos.

**Estados:** `draft` → `in-review` → `approved`.

- Solo un registro **approved** puede ser fuente de una publicación final.
- La traducción debe verificarse independientemente de la fonética; ambas se editan/versionan como campos maestros.
- Un master aprobado **no se reescribe al actualizar el motor**. Una nueva revisión se hace como versión nueva y se propaga explícitamente a los productos derivados.
- Cada publicación (birkón, cuadríptico, etc.) registra el **ID + versión exacta** del texto maestro utilizado.
- Una corrección aprobada de texto Jabad debe propagarse sistemáticamente a las variantes/archivos derivados indicados en el inventario, nunca por reemplazos globales indiscriminados.
- No resolver una diferencia de nusaj reutilizando el master de otro nusaj.

## Regla de equivalencia de fonética

Una expresión hebrea y su lectura deben tener la misma fonética en cualquier registro. Si no coinciden, el control editorial debe detectar la discrepancia antes de generar un PDF de imprenta. Esto es diferente de exigir que los tres nusajim tengan el mismo contenido.

## Pendiente de migración

**Hay dos candidatos a maestro de Bircat Hamazón en revisión**, pero todavía **no existe ningún master litúrgico con estado `approved`** en esta carpeta. Antes de aprobar deben cerrarse el cotejo íntegro del hebreo y la fonética y fijarse la edición fuente. No declarar aprobado lo que no haya pasado esa comparación.
