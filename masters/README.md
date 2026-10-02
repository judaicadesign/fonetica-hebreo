# Biblioteca de textos maestros — Judaica Design

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

**Todavía no están cargados aquí los masters litúrgicos aprobados**. Antes hay que identificar los archivos fuentes exactos de Judaica Design y establecer qué variante/revisión fue efectivamente validada. No declarar aprobado lo que no haya pasado esa comparación.
