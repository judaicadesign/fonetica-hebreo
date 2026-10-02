# Norma editorial de fonética — Judaica Design

**Estado:** borrador operativo para auditoría de los 150 Tehilim.  
**Rama:** `desarrollo/auditoria-tehilim-150` — NO modifica la versión pública.  
**Objetivo:** la misma lectura hebrea recibe la misma representación fonética en cada publicación.

## Separación de responsabilidades

1. **Contenido litúrgico / nusaj** (Ashkenaz, Sefaradí, Jabad, etc.): define el texto hebreo exacto, orden, agregados, variantes y traducción correspondiente. Cada nusaj tiene su propio texto maestro.
2. **Perfil fonético**: define cómo representar una misma lectura. El perfil editorial actual es *sefaradí / israelí moderno en grafía comprensible para argentinos* y se aplica a todos los nusajim. No confundir nusaj Ashkenaz con pronunciar “en acento ashkenazí”.
3. **Nakdan**: agrega niqqud a textos que no lo tienen, con modos moderno, rabínico o zemirot/piyutim. No fija ni corrige unilateralmente la norma fonética. El niqqud ingresado por el usuario y sus correcciones manuales tienen prioridad; las elecciones automáticas son revisables.
4. **Traducción española**: tiene un master editorial propio, con versión, estilo, fuentes y aprobación. No sale ni se modifica automáticamente por un cambio del motor fonético.

## Convenciones invariantes del perfil actual

- **ע** se representa con `'`; **א** nunca se representa con `'` por sí misma.
- **ח / כ sin dagesh = j**; **כּ = k**; **צ = ts**; **שׁ = sh**; **שׂ = s**; **בּ = b** y **ב sin dagesh = v**.
- La **ג dura** antes de e / i se escribe `gue / gui`, incluso cuando la vocal e procede de un shevá vocalizado.
- **י consonántica = y** cuando corresponde; no debe perderse en secuencias como `vayipol`.
- Las tildes siguen la lectura real del hebreo, pero **se escriben solo si las reglas habituales de lectura del español argentino no permiten reproducir esa sílaba tónica**. Las tildes también deben marcar hiatos necesarios.
- Las mayúsculas reverenciales, nombres propios y mayúsculas de comienzo de oración se distinguen. No capitalizar una palabra corriente por aparecer en una tabla.
- Una misma secuencia de hebreo *y la misma lectura/contexto* tiene **una sola representación canónica**, independientemente de si aparece en un birkón Ashkenaz, Sefaradí, Jabad o en una canción.
- **No imponer la misma fonética a vocalizaciones distintas** de una escritura hebrea sin niqqud: por ejemplo, `חַדֵּשׁ` y `חָדָשׁ` no son intercambiables.
- **No resolver problemas mediante listas crecientes de palabras con fonética completa.** Identificar primero patrones de niqqud, shevá, dagesh, morfología, sufijos, acento y contexto. Cuando el niqqud no permite deducir por sí solo el acento y no hay taamim, puede existir *información prosódica mínima* auditada, con contraejemplos y justificación.

## Ejemplo de consistencia entre publicaciones

Para `כָּאָמוּר פּוֹתֵחַ אֶת יָדֶךָ וּמַשְׂבִּיעַ`, nuestro perfil da:
`Kaamur potéaj et yadeja umasbía'`.

La grafía tiene que ser consistente en las tres variantes de Birkat Hamazón **cuando el texto y la lectura coincidan**. Este ejemplo es un contrato de conversión: **no sustituye la validación de los textos litúrgicos maestros** (incluido el resto del pasaje).

No copiar transliteraciones antiguas como autoridad si contradicen el hebreo; validar primero la forma correcta, fijarla una sola vez y propagar esa revisión a todas las variantes.

## Textos maestros versionados

Cada texto aprobado deberá registrar:

- ID persistente, título, `nusaj`, estado: *borrador / en revisión / aprobado*.
- Fuente y fecha de comprobación del **hebreo con niqqud**.
- Versión del **perfil fonético** y commit exacto del motor utilizado.
- Fonética validada y, en paralelo, traducción española aprobada cuando corresponda.
- Fecha, revisor, versión de contenido y registro de cambios.
- Dependencias: todas las publicaciones y masters derivados que reutilizan este texto.

Una actualización del conversor **no reescribe automáticamente las publicaciones aprobadas**. Un cambio editorial se aprueba en el master y se propaga de forma controlada a birkonim y derivados, con registro.

## Puertas de calidad de GitHub

1. Todas las regresiones internas anteriores deben dar **0 fallos**.
2. Pruebas editoriales transversales deben dar **0 fallos**: misma cadena hebrea en los distintos nusajim, canción israelí, texto bíblico, nombres y lectura litúrgica.
3. Todo arreglo debe aportar caso positivo **y contraejemplo**; comprobar que no se rompió otro prefijo, dagesh, sufijo, acento o uso.
4. Auditoría de **Tehilim 1–150**: fuente externa con niqqud, taamim y, donde exista, morfología; rastrear los casos no determinados por el niqqud. Una edición independiente solo se usa como referencia, **sin sustituir silenciosamente Wikisource**.
5. Errores y excepciones no resueltas se cuantifican por categoría y capítulo. No afirmar `99,99 %` ni declarar publicación masiva segura sin comparar las salidas con un corpus de referencia independiente.
6. Las modificaciones se realizan en la rama de desarrollo y pasan a `main` únicamente después de superar las pruebas y una revisión editorial de lanzamiento. Ante un fallo, regresar al commit o rama estable anterior.

## Objetivo de publicación

El proyecto final es un **sistema editorial**: motor fonético + normas de estilo + repositorio de textos maestros + pruebas automatizadas + versionado de publicaciones. El libro de Tehilim sirve como prueba de estrés del motor; **no debe producir reglas que rompan textos modernos, sidurim, Perek Shirá, Shemá, zemirot o nombres propios**.
