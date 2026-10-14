# Judaica Design® — Contexto para Claude

Para continuar el proyecto Tehilim / ArtScroll / fonética **leé primero**:
- [Transferencia ArtScroll y rafé, 13/10/2026](docs/JD_ARTSCROLL_HANDOFF_FOR_CLAUDE_20261013.md)
- [Consultas de lectura Supabase](docs/JD_ARTSCROLL_READ_ONLY_QUERIES_20261013.sql)
- [Cotejo de shevá, 12/10/2026](docs/SHEVA_COTEJO_20261012.json)

Principios imprescindibles:
1. ArtScroll es la referencia editorial prioritaria; no inventar meteg, shevá na, rafé ni aprobaciones.
2. Generador construido por **reglas gramaticales**, no una lista creciente de excepciones por palabra.
3. Conservar másters etiquetados FINAL; señalar las discrepancias y pedir cotejo antes de modificarlos.
4. El **rafé Unicode U+05BF** identifica visualmente la consonante con **shevá na** confirmado (U+05B0). No aplicarlo a shevá naj. Mantener la variante hebrea anotada separada y reversible.
5. Supabase contiene un inventario privado, pero **aún no contiene los PNG/PDF ArtScroll originales**. No afirmar que fueron leídos solo porque figuran sus nombres o hashes.
6. Claude solo puede consultar las tablas privadas de Supabase si cuenta con una integración y autorización apropiadas.

7. Donde ArtScroll imprime `יהוה`, el máster lleva `יי` (`יְיָ`, `לַיְיָ`).
8. Salmo que el usuario sube en captura: se rehace el máster hebreo con la puntuación, shevá, rafé, meteg y número de pasuk de ArtScroll, y se genera su fonética. Si la lectura está verificada, pasa directo a FINAL sin pedir aprobación; solo se consultan las dudas reales, en una lista.
9. Último lote (14/10/2026): `docs/tehilim-artscroll-20261014/` (salmos 11, 14, 16, 63, 76, 83, 84, 130).

Este archivo es una referencia de continuidad, no un cambio al generador ni una autorización para publicar materiales protegidos.
