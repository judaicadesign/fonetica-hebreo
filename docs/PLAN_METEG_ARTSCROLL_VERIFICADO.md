# Modelo ArtScroll: acento editorial sin contaminar el meteg externo

**Estado:** especificación de trabajo; NO IMPLEMENTADO en el generador.

## Contrato de entrada y procedencia

- En texto libre pegado, **ignorar U+05BD** para elegir sílaba tónica. El Unicode meteg/gayya de Wikisource u otra fuente no acredita el uso editorial de ArtScroll.
- Una marca de ArtScroll solo se vuelve evidencia de acento si está referida a **edición, página PDF o captura, salmo, versículo, índice de aparición de la palabra y vocal exacta**, con estado `verified`.
- Una rayita superior de ArtScroll indica **shevá na**. Se registra en campo separado, nunca como meteg.
- El niqqud digital proviene inicialmente de Wikisource; cuando discrepa de ArtScroll, prevalece la vocalización visual de la edición aprobada. No se deben mezclar las ediciones Schottenstein y Seif silenciosamente.

## Futuros modos (no exponer como activos todavía)

1. **Texto libre:** el motor trabaja con vocales y reglas ya aprobadas, sin interpretar meteg arbitrario; si usa Nakdan, solo para añadir niqqud faltante.
2. **Máster ArtScroll aprobado:** el sistema carga texto y anotaciones editoriales versionadas. Para cada token, la anotación `artscrollStressNucleus` orienta la acentuación; después se aplica tildación española. La presencia aislada de U+05BD NO activa ese camino.
3. **Texto sin niqqud:** Nakdan puede vocalizar, pero el sistema solo propondrá meteg ArtScroll cuando reconozca una forma/contexto previamente auditado. Una coincidencia basada solo en grafía no basta para palabras con tónica dependiente del contexto.
4. **Ingeniería inversa:** extraer pares `hebreo vocalizado + contexto → sílaba tónica editorial ArtScroll`; agrupar por morfología y contrastar excepciones con otros pasukim; generar candidatos con trazabilidad, *nunca aprobarlos automáticamente*. Solo una revisión independiente puede incorporarlos al GOLDEN.

## Esquema mínimo de cada evidencia

```json
{
  "edition": "Schottenstein",
  "pdfPage": 2,
  "psalm": 20,
  "verse": 7,
  "tokenIndex": 5,
  "pointedWord": "יַעֲנֵֽהוּ",
  "metegAfterHebrewCluster": null,
  "shevaNaClusters": [],
  "artscrollStressNucleus": null,
  "status": "in_review",
  "evidenceMethod": "visual_pdf"
}
```

Los campos de posición nulos se completarán **solo después del cotejo visual**. No inferir de la palabra ni de una forma similar.

## Orden de aprobación

1. **Hebreo:** letra, nikud, meteg y shevá na por cada aparición contra la imagen, con discrepancias registradas.
2. **GOLDEN fonético:** transliteración sefardí del hebreo final, acento hebreo ya fijado; tilde solo según las reglas ortográficas españolas; capitales referenciales por contexto.
3. **Motor:** comparar por palabra y versículo el GOLDEN contra `phonetize()`; corregir reglas, no el GOLDEN para hacerlo coincidir; luego ejecutar regresiones antiguas y nuevas.
4. **Publicación:** archivar `masterId`, revisión de ArtScroll, `contentVersion`, hash del texto y commit del motor. Solo `approved` habilita producción.

## Estado de la tanda del 8-10-2026

- Inventario de ambas ediciones: `masters/tehilim/ARTSCROLL_SOURCE_MANIFEST_2026-10-08.json`.
- Quince anclas de meteg copiadas por el editor: `masters/tehilim/ARTSCROLL_STRESS_EVIDENCE_2026-10-08.json`, aún sin certificación visual integral.
- 17 capítulos y 188 versículos importados a borradores en `masters/tehilim/`, con ejecución real de motor; 188/188 salidas reproducidas idénticamente. Esto NO implica correctitud de nikud/meteg ni de fonética editorial.
- El generador general incluye 15 regresiones de invariancia frente a meteg externo. **NO** se ha activado la generación automática de meteg ArtScroll.
