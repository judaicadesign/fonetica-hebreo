# Judaica Design® — Registro de arreglos de fonética
Fecha: 06/11/2026  
Repositorio: https://github.com/judaicadesign/fonetica-hebreo  
Documento de traspaso para Claude y para el titular.

> **Estado vigente:** la Parte A (Claude, 06/11/2026, rama `fix/reglas-kamats-begadkefat-perfecto-20261106`) reemplaza los
> parches lingüísticos de la Parte B (Codex). La Parte B queda como historial: sus correcciones del editor siguen vigentes;
> sus excepciones de palabra/frase fueron retiradas.

# Parte A — Reemplazo de parches por reglas (Claude, 06/11/2026)

Niveles de evidencia: 1 ArtScroll cotejado · 2 decisión del titular · 3 regla gramatical · 4 predicción del motor · 5 pendiente.
Fuente gramatical: Gesenius-Kautzsch-Cowley (GKC), *Hebrew Grammar*, §9u-v (kamats katán), §20-21 (daguesh, begadkefat),
§29 (acento y pausa), §49h-m (perfecto consecutivo).

## A.1 Revisión crítica de lo que hizo Codex

| Parche de Codex | Problema | Qué lo reemplaza |
| --- | --- | --- |
| `REVIEWED_QAMATS_QATAN`: posiciones de kamats katán copiadas del corpus revisado | Es una lista de palabras: solo «sabe» las grafías que ya estaban en el corpus. La causa real del síntoma era otra: la copia convertía U+05C7 en U+05B8 y destruía la información. | Se elimina la conversión al copiar (A.4) y el katán se decide por estructura y contexto (A.2). |
| `QAMATZ_QATAN_FORMS` (lista previa: כָּל, צָרְכִּי, חָרְבַּן, מָרְדְּכַי…) | Lista de formas. | Cubiertas por reglas 2-4 de A.2 (las mismas salidas). |
| Excepción de frase «כי בנו בחרת» en `mergeContextualNiqqud` | Condición por palabras exactas; no se aplica a ningún otro texto. | Regla begadkefat (A.3) que ofrece la alternativa en cualquier contexto equivalente. |
| Sufijo -נוּ: «ב sin daguesh = preposición» | Usa el daguesh (un fenómeno de sandhi) como si fuera morfología. | El acento de בָּנוּ/בָנוּ (preposición) ya no depende del daguesh (A.3). |
| `VAV_CONVERSIVE` (17 formas, con וְשַׁבְתִּי agregado) | Lista de formas. | Regla del perfecto consecutivo (A.5). |
| Protección de la elección manual frente a respuestas tardías de Nakdan | Correcta. | **Se conserva** sin cambios (pruebas de UI siguen pasando). |

## A.2 Kamats katán: reglas implementadas (`qamatsQatanReason` en `index.html`)

Principio: kamats en sílaba **cerrada y átona** = o (GKC §9u). Un U+05B8 no prueba «a». Orden de decisión:

1. **U+05C7 explícito → o** (evidencia del texto).
2. **Marcas que prueban kamats gadol → a:** meteg sobre el kamats (GKC §9u, §16) o rafé de shevá na en la letra siguiente (convención JD/ArtScroll).
3. **Ante jataf kamats → o** (צׇהֳרַיִם, פׇּעֳלוֹ, נׇעֳמִי; GKC §9v). Excepción: artículo/preposición con kamats ante gutural (הָאֳנִיָּה) → a.
4. **Shevá + daguesh kal en la begadkefat siguiente → o** (קׇרְבָּן, חׇרְבַּן, מׇרְדְּכַי, וּבְשׇׁכְבְּךָ): el daguesh kal prueba que la shevá es muda y la sílaba está cerrada (GKC §21). Excepción: desinencias átonas del perfecto singular (-ְתָּ, -ְתָּה, -ְתִּי, -ְתְּ), donde la sílaba del kamats es la tónica (כּוֹנָנְתָּה = konanta).
5. **Makaf → o** en sílaba final cerrada: la palabra pierde su acento (כׇּל־, יִכְתׇּב־שָׁם; GKC §9u, §29f).
6. **Imperfecto qal CִCְCָC (prefijo י/ת):** con kamats es o forma pausal de verbo en «a» (יִשְׁכָּב) o forma átona de verbo en «o» (יִשְׁמׇר־).
   - seguido de otra palabra sin puntuación ni acento disyuntivo → **o** (no puede ser alargamiento pausal);
   - con puntuación o acento disyuntivo → **a** (pausa);
   - sin contexto (palabra sola en su línea) → **a por defecto + aviso** en el editor con botón «Leer «o» (poner ׇ)»;
   - si el mismo texto muestra la raíz con jolam (יִשְׁמֹר) → o.
   - Quedan fuera por regla: 2.ª/3.ª radical gutural (siempre «a»), finales ם/ן/ך (sufijos de sustantivo: יִתְרָם), prefijo א (אֶשְׁכָּר «tributo», Tehilim 72:10) y נ (participio nifal נִשְׁבָּר).
7. Reglas morfológicas previas que se conservan (con motivo explícito): כל proclítico; imperativo + -ֵנוּ; geminado con daguesh fuerte; estativo + sufijo; preposición + CָCְCָה; infinitivo constructo לִCְCָC; vav conversiva con acento retraído; qotl plural + sufijo.
8. **Dependencia léxica que sigue:** `QAMATZ_QATAN_ROOTS` (חכמ, קדש, עני, שרש, חפש, אזנ). Sin meteg ni rafé, חׇכְמָה (sustantivo) y שָׁמְרָה (perfecto) tienen la misma forma escrita. Documentado como pendiente.

Resultado del caso reportado: יִשְׁמָר en el pasuk → yishmor (regla 6, ligado); יִשְׁמָר solo en su línea → Yishmar + aviso para marcarlo; יִשְׁמׇר copiado desde el generador (ahora conserva U+05C7) → Yishmor.

## A.3 Begadkefat, acento y meteg en «כי בנו בחרת»

- **Daguesh (b/v):** GKC §21: la begadkefat inicial pierde el daguesh kal tras palabra terminada en vocal (א ה ו י como letras vocales) **si las palabras van unidas**; lo conserva tras pausa o acento disyuntivo, tras ו/י consonánticas, הּ con mapik y tras el Nombre (leído Ad-nai).
  Sin teamim el texto no dice si hay unión o pausa. Medición en los másters JD (Supabase, 06/11): en ese mismo entorno sin puntuación hay **1156 casos con daguesh y 877 sin él**. No hay regla que decida sola. Implementación (`begadkefatAlternative`): cuando Nakdan vocaliza una palabra que el usuario dejó sin nikud y se da el entorno, se ofrece la otra lectura como alternativa (chip dorado con la explicación). La propuesta de Nakdan queda provisional; la elección del usuario queda **manual** y ninguna respuesta automática la revierte. El nikud que escribe el usuario nunca se toca.
- **Acento:** בָּנוּ/בָנוּ preposición «en nosotros» = **milel** (bánu/vánu), igual que לָנוּ; el daguesh es sandhi y no cambia la morfología. Homógrafo conocido: el verbo בָּנוּ «construyeron» (בנה) es milrá; sin análisis sintáctico se lee la preposición, mucho más frecuente en la liturgia.
- **Meteg:** el meteg visual del generador marca la sílaba tónica no final con el mismo cálculo que la fonética (בָֽנוּ, בָחַֽרְתָּ). Ahora `applyVisualMarks` usa el mismo contexto que la fonética (pausa, makaf, cadena de perfectos), para que marca y lectura no se contradigan. No se pudo reproducir un meteg mal ubicado en el código actual; queda la prueba de invariancia (marca ↔ fonética) en `tests/visual-marks-invariance.mjs` y la nueva.
- **Para ArtScroll (nivel 5):** según la regla, בָּחַרְתָּ después de בָנוּ también podría ir sin daguesh (vajarta). El generador lo ofrece como alternativa, no lo aplica. Confirmar con el libro.

## A.4 U+05C7 al copiar, pegar, guardar, reimportar e IDML

- Se eliminó la conversión U+05C7 → U+05B8 de `hebrewForExport` en `index.html`, `beta/index.html` y `beta/pruebas.html`; se actualizó el texto de ayuda.
- Recorridos revisados: botón «Copiar hebreo», Ctrl+C/Cortar (evento `copy`), «Pegar texto», borrador local (no convierte), Transcriptor (no convierte). `judaica-design-system` no tiene conversión de U+05C7 (búsqueda en el repo público, 06/11).
- **Fuente:** según el registro editorial JD la tipografía de los IDML es **FbFrankReal** (nota del 26/10/2026). El archivo de la fuente no está en el repositorio ni en Drive (solo hay especímenes PDF «frank-re» de AlefAlefAlef, que no son el archivo de la fuente): **no se pudo verificar** el archivo actualizado. Queda `tools/fuente/verificar_glifos.py`: lee el archivo .otf/.ttf, informa los nombres internos exactos y si U+05C7, U+05B8, U+05BD y U+05BF están en el cmap y en el posicionamiento GPOS. Correr sobre el archivo instalado antes de migrar IDML.
- Pendiente fuera de este repo: la herramienta de preimprenta (repositorio privado) avisaba U+05C7 como «AVISO E-16»; debe dejar de tratarlo como problema. El parámetro `keepqq:false` que el generador manda a Nakdan probablemente pide kamats común; no se cambió porque no se pudo probar Nakdan desde este entorno.

## A.5 Perfecto consecutivo y וְשַׁבְתִּי (`perfectConsecutiveMilra`)

- Regla (GKC §49h): וְ + perfecto 2.ª m. sg. (-תָּ) o 1.ª sg. (-תִּי) desplaza el acento a la última sílaba.
- No se desplaza (GKC §49k-m): **pausa mayor** (punto, punto y coma, dos puntos, sof pasuk, acento disyuntivo); ל״א en 1.ª sg. (וּמָצָאתִי); ל״ה con î fuera de qal (וְהִרְבֵּיתִי); **meteg explícito** en otra sílaba (convención ArtScroll del acento milel); **cadena de pasado**: si antes, en el mismo párrafo y sin cita intermedia, hay un perfecto sin vav de la misma persona (הֵפַרְתָּ… וְקִלְקַלְתָּ, Al Hanisim).
- Sin pausa, sin meteg y sin cadena, וְ + perfecto con valor de pasado (hebreo rabínico) no se distingue del consecutivo: se lee consecutivo y el editor muestra un aviso con el botón «Acento penúltimo (poner meteg)». Esto **no** es «sin meteg = acento final»: el acento final sale de la morfología, y la pausa, la cadena y las clases verbales lo bloquean.
- Protección del editor (Codex) conservada: la elección manual invalida respuestas automáticas pendientes.

## A.6 Ambigüedades que siguen necesitando revisión

1. Kamats + shevá sin meteg ni rafé (חׇכְמָה vs. שָׁמְרָה): sigue la lista léxica `QAMATZ_QATAN_ROOTS`; la migración lo lista como «ambiguo» con pista.
2. Imperfecto CִCְCָC aislado (aviso en el editor).
3. Begadkefat tras vocal sin teamim (alternativa en el editor).
4. וְ + perfecto rabínico en pasado sin meteg (aviso en el editor).
5. Homógrafo בָּנוּ preposición/verbo (se lee preposición).

## A.7 Cambios de salida que contradicen textos aprobados — **decisión del titular**

`docs/registro-20261106/impacto-motor-masters.json` compara el motor anterior (main 2a897d5) con el nuevo sobre los másters del repositorio `judaica-design-system` (Tehilim 1-150, BH Ashkenazí), el BH Sefaradí de prueba y muestras de contexto de las celdas de Supabase. 13 palabras cambian:

| Palabra | Antes | Ahora | Fundamento | Estado |
| --- | --- | --- | --- | --- |
| וְסָלַחְתָּ (Tehilim 25:11), וְאָמַרְתָּ, וְשָׁמַרְתָּ, וְהַאֲזַנְתָּ, וְשָׁכַבְתָּ | acento penúltimo | acento final | perfecto consecutivo; coincide con los teamim (nivel 3) | revisar en los másters |
| הִתְמַהְמָֽהְתִּי (119:60) | hitmahmohti | hitmahmahti | meteg sobre el kamats = gadol; atnaj en el texto masorético (nivel 3) | revisar |
| וְשָׂבָעְתָּ seguido de punto (Devarim 8:10) | vesava'tá | vesava'ta | pausa (atnaj): GKC §49m cita esta forma | **contradice la lista previa y el BH Sefaradí aprobado** |
| וְטָהֳרָה / וּבְטָהֳרָה | vetahorá / uvtahorá | vetohorá / uvtohorá | kamats ante jataf kamats (GKC §9v) | **contradice el BH Sefaradí Combinado (Aprobado)** |

Los másters **no se modificaron**. En Tehilim 1-150 (versículo completo) solo cambian 25:11 y 119:60.

## A.8 Migración de textos (`tools/migracion-kamats/migrar.mjs`) — preparada, no aplicada a másters

- Clasifica cada U+05B8: **seguro** (reglas 3-5 y otras estructurales), **revisar** (morfológicas/contextuales), **ambiguo** (sin regla; con pista «probable gadol» cuando corresponde), gadol (no se lista).
- Aplica por defecto solo «seguro», en una **copia** (`*.kamats-katan.*`); nunca toca el original; registra SHA-256 de entrada y salida, CSV y JSON por palabra; acepta TXT, JSON (tehilim.json o celdas `{clave:{body}}`) e IDML (historias `Stories/*.xml`, mimetype sin comprimir).
- Repetible: una segunda pasada no produce cambios (probado).
- Diagnóstico ejecutado (solo lectura, `docs/registro-20261106/diagnostico-kamats-masters-repo.csv`): Tehilim 1-150: 1 seguro, 2 revisar, 86 ambiguos (el texto ya usa U+05C7; los ambiguos son en su mayoría perfectos con shevá na); BH Ashkenazí EN REVISIÓN: 25 seguros, 8 revisar; BH Sefaradí de prueba: 32 seguros, 5 revisar, 3 ambiguos.
- **No ejecutado** sobre las celdas de Supabase ni sobre IDML reales (no accesibles desde este entorno). Procedimiento: exportar el máster/IDML, correr con `--solo-diagnostico`, revisar el CSV, correr sin esa opción, cotejar la copia y recién entonces reemplazar con aprobación.

## A.9 Archivos, commits, pruebas y publicación

Archivos: `index.html` (motor y editor), `editor.css` (avisos), `beta/index.html`, `beta/pruebas.html`, `tests/reglas-kamats-begadkefat-perfecto-20261106.mjs` (nuevo), `tests/migracion-kamats-20261106.mjs` (nuevo), `tests/ui/editor.spec.mjs` (3 pruebas nuevas reemplazan la de Codex), `tests/vav-meteg-gaya.mjs`, `tests/bh-sefaradi-salmo67-20261015.mjs`, `tests/fixtures/rule-derived-pronunciations.json` (4 valores: tohorá ×2, ve'asitá, vekilkaltá aislados), `tests/isolated-qamats-banu-20261106.mjs` (eliminado: probaba el parche), `tools/comparar-motor.mjs`, `tools/migracion-kamats/migrar.mjs`, `tools/fuente/verificar_glifos.py`, `docs/registro-20261106/*`.

Commits (rama `fix/reglas-kamats-begadkefat-perfecto-20261106`): `5f18c0e` código y pruebas; el commit siguiente, este registro y `CLAUDE.md`.

Pruebas ejecutadas el 06/11/2026:
- `npm test`: **46/46** regresiones (antes 45; se quitó 1 y se agregaron 2).
- Playwright `tests/ui/editor.spec.mjs` con Chrome local: **16/16** (accesibilidad axe en 4 anchos, alternativa begadkefat + elección manual + respuesta automática posterior, aviso de imperfecto aislado + ׇ + copia/evento copy + reimportación, aviso de perfecto + meteg). `public-sites.spec.mjs` no se corrió (prueba el sitio publicado).
- `scripts/audit-tehilim.mjs`: 150 salmos, 19 649 palabras, 0 fallas de regresión; `cantillation_leak` 390 → 403 por diseño (las reglas nuevas usan meteg y acentos como evidencia).
- Palabras nuevas fuera de los casos reportados: פׇּעֳלוֹ, נׇעֳמִי, הָאֳנִיָּה, קׇרְבָּן, יִכְתׇּב־שָׁם, יִזְכָּר, יִלְמָד, יִגְדָּל, יִתְרָם, נִשְׁבָּר, יִשְׁאָל, וְזָכַרְתָּ, וְלָקַחְתָּ, וּבָנִיתָ, וּמָצָאתִי, וְהִרְבֵּיתִי, פֶּלֶא tras הוּא, entre otras.

Publicación: **nada publicado**. Los cambios quedan en la rama; GitHub Pages sigue sirviendo `main`. Para publicar: aprobar las decisiones de A.7, fusionar la rama y verificar la página publicada.

# Parte B — Historial: arreglo de Codex (06/11/2026, reemplazado en lo lingüístico)

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
