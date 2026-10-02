# Clasificación reproducible de las 738 alertas — Tehilim 1–150

Ejecución GitHub Actions: https://github.com/judaicadesign/fonetica-hebreo/actions/runs/37054309037

La ejecución terminó correctamente y produjo dos archivos adjuntos (artefacto `tehilim-audit-classification`):
- `judaica-tehilim-audit.json`: informe de casos individuales
- `judaica-tehilim-classification.json`: clasificación exhaustiva por familias

## Resultado

| Familia de revisión | Ocurrencias | Formas distintas |
|---|---:|---:|
| Verbos | 306 | 223 |
| Sufijos | 162 | 117 |
| Otros | 141 | 100 |
| Sustantivos | 122 | 91 |
| Contexto | 7 | 2 |
| **Total** | **738** | **533** |

La suma coincide exactamente con `publishedFlagged=738`. `publishedComparable=7625`; `publishedAgreement=6887`; `publishedUnaligned=459`.

## Precaución editorial

Estas familias son hipótesis de triage, **no 738 errores comprobados**. El clasificador no confirma errores ni falsos positivos. El comparador atribuye la posición tónica al índice de letra portadora del taam, lo que puede no representar la sílaba tónica del texto ni los fenómenos de acento cantilatorio.

Ejemplos frecuentes que requieren validar el método **antes** de cambiar el motor:

- `לָמוֹ → Lamó` (12), taam U+0591 en letra anterior al acento fonético.
- `יֵבֹשׁוּ → Yevoshú` (11), signos U+05A4/U+05A5/U+0591.
- `פֹּעֲלֵי → Po'alé` (10).
- `אוֹדְךָ → Odeja` (8): posible caso real de sufijo; revisar acento y vocalización contextual.
- `קֹרַח → Koraj` (8).
- `שִׁירוּ → Shirú` (8).
- `הַלְלוּ → Hallú` (8).
- `אַתָּה → Atá` (5): no corregir acento final por mera discrepancia con taam.
- `עֵינִי → 'Eni` (5).
- `יָדְךָ → Yadeja` (5): la posición del taam difiere según contexto; requiere análisis contextual.
- `חָיִל → Jayil` (5).
- `עֹשֶׂה → 'Ose` (5).

## Siguiente ciclo, orden de trabajo

1. Revisar qué códigos de taam son utilizables como señal fiable de acento léxico en el algoritmo actual; comparar las posiciones sobre ejemplos con lectura inequívoca. Separar los falsos positivos por **método de medición** antes de alterar reglas.
2. Reanalizar los 306 candidatos verbales y 162 de sufijos con referencia morfológica y excepciones comprobadas.
3. Proponer correcciones generales acotadas, con contraejemplos de regresión, solo donde haya error real.
4. Reejecutar Tehilim 1–150 y tests editoriales después de cada cambio.

**Estado:** clasificación completada; validación lingüística y correcciones del motor pendientes.
