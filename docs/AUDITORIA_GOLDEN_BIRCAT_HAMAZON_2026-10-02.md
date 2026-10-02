# Auditoría de golden TXT de Bircat Hamazón (2026-10-02)

**Estado: revisión técnica, no aprobación final.**
**Alcance:** TXT Ashkenaz y Sefaradí de la biblioteca del proyecto, copias sin sufijo, (1) y (2), comparados con el motor de `desarrollo/auditoria-tehilim-150` (commit 29e8b6748d122126747a283ebcd815736917f407) y con respaldo `respaldo/antes-auditoria-tehilim-150-2026-10-02`.
**Salvaguarda:** no editar los TXT golden, masters litúrgicos, `main` ni derivados publicados sin resolver discrepancias y aprobar nueva versión.

## Inventario de fuentes privadas

- `ASHKENAZ - Bircat Hamazon.txt` (2026-09-28); `(1)` (2026-09-29), `(2)` (2026-09-29).
- `SEFARADI - Bircat Hamazon.txt` (2026-09-28); `(1)` (2026-09-29), `(2)` (2026-09-29).
- Los sufijos `(1)` y `(2)` son copias distintas: **no asumir** que designan una versión aprobada por el usuario.
- Las copias `(2)` duplican el encabezado hebreo inicial. Se debe depurar el encabezado si van a servir como fuente canónica; sin alterar texto litúrgico.
- El zímún sefaradí de `(2)` usa la indicación fonética «comensales y luego conductor» para evitar repetir la misma línea. Es una abreviación editorial, no una omisión de transliteración de un texto nuevo; el hebreo conserva ambas intervenciones.

## Cambios fonéticos confirmados para evaluar incorporación en ambas copias (2)

Las formas hebreas **vocalizadas** `עַמְּךָ` y `וּלְעַמְּךָ` contienen shevá silencioso y acento final:
- `עַמְּךָ`: la copia (2) escribe `'amja`; forma del motor revisado `'amjá`. Ocurre **dos veces** en cada nusaj (en Janucá y en el recuerdo del pueblo de Israel).
- `וּלְעַמְּךָ`: la copia (2) escribe `ule'amja`; forma revisada `ule'amjá`. Ocurre **una vez** en cada nusaj.

Total: **tres ubicaciones por nusaj**, seis ubicaciones en conjunto; marcar para edición controlada, sin sustitución ciega. Las copias sin sufijo eran anteriores y aún incluían variantes `'amejá` en esas mismas posiciones, después modificadas a `'amja` en las copias (2).

**Contraejemplos imprescindibles:**
- `עַמֶּךָ` tiene segol (no shevá) y no se debe transformar ciegamente desde `'ameja`.
- `עַמָּךְ` (sefaradí en otro pasaje) corresponde a `'amaj` y tampoco se altera por la regla anterior.

## Conservación del golden: reparar el motor, NO degradar el TXT

- `זִכְרוֹנֵֽנוּ`: el TXT sefaradí conserva `zijronenu`. El motor actual produce `zijronenú`, mientras que el respaldo preauditoría producía `zijronenu`. No copiar esta regresión al golden. Comparación editorial independiente: hagadá de Elie Bahbout, p. 130 (numeración impresa), `zichronênu` (acento sobre la e).
- `וֵאלֹהֵי`: en ambos diccionarios GOLD históricos figura `veElohé`, pero la función `divine()` actual da `veLohé`; la familia `א-ל-ה` con prefijos requiere auditoría para no perder la representación del comienzo de `Elohé`.
- `לְעולָם` y `חַסְדּו` en algunas formas del ashkenazí tienen niqqud incompleto: el fallback actual puede dar `le'vlam` y `jasdv`, claramente no aptos para copiar en un texto maestro. Revisar la grafía hebrea y el comportamiento seguro ante niqqud parcial.

## Otras diferencias históricas: **no corregir en masa**

Contraste del motor actual contra su propio diccionario léxico GOLD histórico: **50 formas ashkenazíes y 6 formas sefaradíes** con discrepancia en la prueba de palabra aislada (incluye diferencias de mayúscula y contexto). Son alertas de auditoría, **no 56 errores reales**. Ejemplos: `גְּבוּרוֹת` (`gevurot` versus `guevurot`, norma editorial de g dura antes de e); `בְרִנָּה` (`beriná` versus `veriná`, ב sin dagesh); `בִּרְכַּת` (`bircat` versus `birkat`, variación gráfica del sonido k). En sentido inverso, el motor aún presenta fallos con acentos y vocales que no deben sustituir las formas aprobadas sin comprobación.

## Diferencias aisladas atribuibles al trabajo reciente en Tehilim

Contra el respaldo previo, sobre la muestra de tokens vocalizados de los TXT sin sufijo: **Ashkenaz: 5 apariciones en 4 formas únicas** (incluye `אַעֲלֶה`, `לְּךָ`, `עַמְּךָ`×2, `וּלְעַמְּךָ`). **Sefaradí: 4 apariciones en 3 formas** (`עַמְּךָ`×2, `וּלְעַמְּךָ`, `זִכְרוֹנֵֽנוּ`). Este delta de motor no constituye un cotejo exhaustivo de los pares hebreo/fonética línea por línea, ni una medida de exactitud editorial.

## Pendientes para cerrar los golden

1. Confirmar cuál de las tres copias por nusaj se declara fuente aprobada, sin asumir que `(2)` es automáticamente la definitiva.
2. Comprobar correspondencia de cada bloque hebreo y fonética en contexto (incluyendo ramas opcionales, zímún, Janucá, Purim, Shabat y Ya'alé Veyavó).
3. Reparar bugs demostrados del motor mediante reglas y tests positivos/contraejemplos; no absorber salidas erróneas en el golden.
4. Preparar lista puntual de reemplazos **una vez auditada**; no cambiar aprobados ni publicaciones sin aprobación editorial.
5. No empezar libro de Tehilim en Word/ni diseñarlo durante esta auditoría: Tehilim sigue siendo exclusivamente corpus de pruebas.

**Conclusión provisional:** ambas familias de TXT requieren una revisión menor y localizada para la acentuación `'amjá`/`ule'amjá`; aún no hay base suficiente para declararlos completamente verificados o reemitir nuevos golden.


## Decisión editorial del usuario — 2026-10-02

**Autorizado:** corregir las copias de trabajo más recientes (2), sin modificar su hebreo, reemplazando en cada nusaj:
- `'amja` → `'amjá`, **dos** apariciones de `עַמְּךָ`.
- `ule'amja` → `ule'amjá`, **una** aparición de `וּלְעַמְּךָ`.

**Acentuación confirmada:** `זִכְרוֹנֵנוּ` / `זִכְרוֹנֵֽנוּ` lleva la fuerza en la `e` de `-ne-`. Transliteración editorial **`zijronenu`**, sin tilde, porque la acentuación llana se deduce del final vocal en la ortografía castellana.

**Estado de realización:**
- Se generaron **dos TXT corregidos de trabajo** separados de los originales (Ashkenaz y Sefaradí), con tres sustituciones fonéticas exactas por archivo, manteniendo el hebreo intacto. Los originales de la Biblioteca no se sobrescribieron.
- En el motor de desarrollo la regla general para `tsere + -נוּ` hace `Zijronenu` en lugar de `Zijronenú`; añadidas **seis** regresiones, incluyendo el contraejemplo `יִבְחֲנוּ`.
- Se conserva la separación: haber autorizado estas correcciones concretas **no implica** que los textos completos o las variantes de otros nusajim queden editorialmente aprobadas. Restan auditorías y otras diferencias de motor documentadas arriba.
- `main` y los contenidos litúrgicos maestros publicados permanecen sin alteración.
