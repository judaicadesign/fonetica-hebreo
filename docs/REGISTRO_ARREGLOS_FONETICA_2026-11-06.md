# Judaica Design® — Registro de arreglos de fonética
Fecha: 06/11/2026  
Repositorio: https://github.com/judaicadesign/fonetica-hebreo  
Documento de traspaso para Claude y para el titular. Describe lo implementado; no modifica el motor.

## 1. Respuesta directa: ¿regla o excepción?

| Caso | Implementación real | Clasificación y límite |
| --- | --- | --- |
| בנו en «כי בנו בחרת» | En la fusión de Nakdan se reconoce ese contexto y se retira el daguesh de la ב de la propuesta automática בָּנוּ. | **Corrección contextual específica**, equivalente a una excepción de frase. No es una regla general de begadkefat. |
| Acento de בָנוּ | Se amplió el entorno del sufijo átono -נוּ: la forma breve sin daguesh de ב se incorpora junto a ל. | Cambio en la regla existente del sufijo, apoyado en la forma escrita. No es un analizador morfológico completo de homógrafos. |
| יִשְׁמָר aislado | Se reutilizan las posiciones de kamats katán explícito en palabras del corpus revisado, admitiendo el kamats común usado al copiar. | **Concordancia léxica derivada del corpus**, con un mecanismo reutilizable. No equivale a una deducción gramatical universal del kamats katán. |
| וְשַׁבְתִּי sin meteg | Se incorporó la forma al conjunto existente VAV_CONVERSIVE. | Forma explícita dentro de una clase de lecturas verificadas; tampoco se eliminó toda dependencia léxica. |
| Elección sin meteg que se revertía | Se aplica exactamente la opción elegida y se invalidan las actualizaciones automáticas pendientes. | Corrección general del flujo del editor, independiente de la palabra. |

**Conclusión de mantenimiento:** los resultados solicitados funcionan, pero no corresponde describir todos estos cambios como una revisión general de reglas. La corrección de בנו y la concordancia de kamats katán conservan dependencia contextual o léxica. Esto debe distinguirse del objetivo del proyecto de priorizar reglas gramaticales y evitar listas crecientes de excepciones. Queda pendiente una generalización lingüística independiente, si se decide abordarla; no se realizó en este arreglo.

## 2. בנו: diagnóstico, cambio y alcance

### Síntoma
Al vocalizar texto sin nikud en la frase «כי בנו בחרת», Nakdan proponía בָּנוּ, con daguesh en la ב. El titular indicó que su ArtScroll lleva בָנוּ.

### Código
Archivo: `index.html`. Funciones: `mergeContextualNiqqud` y `stressAccent`.

La corrección automática requiere simultáneamente:

1. Palabra de origen sin vocalización propia: בנו.
2. Palabra anterior: כי; palabra siguiente: בחרת.
3. Solo espacios en los límites entre esas palabras; puntuación intermedia bloquea la corrección.
4. Propuesta de Nakdan equivalente a בָּנוּ según la normalización existente.
5. Se retira únicamente el primer U+05BC, correspondiente a la ב de esa forma. **No se elimina el punto de la וּ**, necesario para el shuruk.

La condición previa que conserva cualquier palabra ya vocalizada sigue ejecutándose antes de esta corrección. Una elección manual permanece manual. No se retiran indiscriminadamente los daguesh de otras palabras ni de otros contextos.

Se ajustó también el entorno de -נוּ para obtener **vanu**, sin acento final artificial, en la forma preposicional בָנוּ.

### Límites
No se implementó una regla universal de pérdida de daguesh tras vocal ni un análisis sintáctico general. No debe ampliarse esta condición copiando frases una por una sin revisar primero la regla y sus contraejemplos.

## 3. יִשְׁמָר: diagnóstico, cambio y alcance

### Síntoma
El pasuk completo podía dar «yishmor», pero la palabra pegada sola con kamats común U+05B8 daba «Yishmar».

### Evidencia disponible
El corpus revisado ya contiene Tehilim 121:8 con **יִשְׁמׇר**, es decir, kamats katán explícito U+05C7. La rutina de exportación del editor convierte U+05C7 en U+05B8 para compatibilidad con fuentes de InDesign. Al volver a pegar esa grafía aislada se perdía la distinción vocálica.

La solución no se apoya en una nueva lectura de un PDF o PNG ArtScroll: utiliza el corpus ya existente y el caso reportado por el titular.

### Código
Archivo: `index.html`.

- `REVIEWED_QAMATS_QATAN`: mapa generado al iniciar desde las palabras con U+05C7 de `REVIEWED_ARTSCROLL_VERSES`.
- Clave: palabra vocalizada normalizada, igualando U+05C7 y U+05B8.
- Valor: posiciones de letras que llevan kamats katán explícito en ese corpus.
- `isQamatzQatan`: consulta esas posiciones antes de las heurísticas existentes.

No se reemplaza la palabra visible ni se escribe un kamats katán nuevo en el texto del usuario. Se reutiliza su identidad vocálica para la pronunciación.

### Resultado
- יִשְׁמָר → **Yishmor**.
- יִשְׁמׇר → **Yishmor**.
- El pasuk completo conserva «yishmor».
- No se transforma todo kamats final en O; יִשְׁכָּב sigue dando **Yishkav**.

### Límites
La concordancia exige la grafía vocalizada correspondiente. No infiere automáticamente todos los prefijos, formas verbales ni palabras ausentes del corpus. No debe confundirse con una regla gramatical universal ni usarse como prueba de aprobación de otra ocurrencia textual.

## 4. Meteg y וְשַׁבְתִּי: cambios anteriores relacionados

- `renderNakdanChoice`: una opción explícita reemplaza el nikud anterior exactamente; ya no reutiliza las marcas anteriores mediante `preserveReadingMarks`.
- `preserveReadingMarks` continúa protegiendo las marcas aportadas durante la fusión automática de Nakdan.
- Al fijar una opción se incrementa `runId`, se cancela el temporizador y se aborta la petición pendiente. Una respuesta tardía ya no vuelve a poner el meteg que el usuario quitó.
- Se vuelve a habilitar Copiar cuando existe fonética después de fijar la lectura.
- La forma sin meteg וְשַׁבְתִּי produce **veshavtí**. Con meteg explícito en la sílaba anterior produce **veshavti**.

No generalizar «sin meteg = acento final» a todas las palabras: eso sería incorrecto y no fue implementado.

## 5. Registro Git

Todos los enlaces siguientes corresponden a cambios ya guardados en el repositorio:

| Commit | Cambio |
| --- | --- |
| [a31c451](https://github.com/judaicadesign/fonetica-hebreo/commit/a31c45137d3406e498a6c57cfe6c3836615bf005) | Reemplazo exacto de la opción explícita de nikud. |
| [be6e98c](https://github.com/judaicadesign/fonetica-hebreo/commit/be6e98cd06b94ebb0edcf5e4bf81266d19cb41f4) | Acento final de וְשַׁבְתִּי sin meteg. |
| [a42b700](https://github.com/judaicadesign/fonetica-hebreo/commit/a42b700cb0376a6e217aab5b1e66dc536077ba7e) | Pruebas específicas de veshavtí y meteg. |
| [cb8d28f](https://github.com/judaicadesign/fonetica-hebreo/commit/cb8d28f6ce2da87a640f958f4cf6b7f79e5f5420) | Protección de la elección manual frente a respuestas tardías. |
| [d1774d1](https://github.com/judaicadesign/fonetica-hebreo/commit/d1774d138477b58e74ef304d228bf119c4f48af0) | Regresión de interfaz para respuesta tardía. |
| [afbc3d2](https://github.com/judaicadesign/fonetica-hebreo/commit/afbc3d27d216fc6024dc2e7f708eefc372416dc0) | Concordancia de kamats katán, contexto de בנו y ajuste del sufijo. |
| [6324752](https://github.com/judaicadesign/fonetica-hebreo/commit/63247524d240d987627e0f3b52e3646925b6e4f1) | Prueba aislada de kamats, בנו, nikud explícito y contraejemplos. |
| [ac482ae](https://github.com/judaicadesign/fonetica-hebreo/commit/ac482ae8024d4d6d4424ea7f7284b2df65d82521) | Prueba del recorrido real del editor con respuesta Nakdan simulada. |

## 6. Pruebas y publicación

Archivos:
- `tests/isolated-qamats-banu-20261106.mjs`
- `tests/veshavti-stress-20261105.mjs`
- `tests/ui/editor.spec.mjs`

Comandos reproducibles:
```sh
node tests/isolated-qamats-banu-20261106.mjs
node tests/veshavti-stress-20261105.mjs
npm test
npm ci
npx playwright install --with-deps chromium
npm run test:ui
```

Evidencia registrada en esta entrega:
- Pasaron las 44 regresiones existentes; después se añadió y pasó la prueba nueva de kamats/בנו.
- Se comprobó también el flujo del editor: respuesta automática, reprocesamiento y pegado aislado.
- [CI Editor UI](https://github.com/judaicadesign/fonetica-hebreo/actions/runs/42178189658): success.
- [CI de regresiones y auditoría existente](https://github.com/judaicadesign/fonetica-hebreo/actions/runs/42178189664): success.
- [Publicación Pages](https://github.com/judaicadesign/fonetica-hebreo/actions/runs/42178189017): success.
- Se descargó la página pública y se verificaron los resultados sobre su motor publicado.

Estas pruebas verifican comportamiento y regresiones. No constituyen una nueva aprobación editorial de todos los salmos.

## 7. Continuidad para Claude

1. Leer este archivo antes de modificar las funciones indicadas.
2. Consultar los diffs de los commits y las pruebas; no depender de recuerdos del chat.
3. Mantener la prioridad del nikud explícito y de las elecciones manuales.
4. No presentar la condición de בנו ni la concordancia del corpus como una regla universal.
5. Si se reemplazan por reglas gramaticales, demostrar el alcance con contraejemplos independientes y conservar las pruebas del editor.
6. No modificar másters FINAL como parte de una corrección del generador sin la autorización editorial correspondiente.

El enlace a este registro queda incorporado en `CLAUDE.md`, que conserva el principio de priorizar reglas gramaticales. Claude podrá leerlo si tiene acceso al repositorio y usa una versión actualizada; no recibe el contenido de este chat automáticamente.
