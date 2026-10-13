# Meteg deducido desde los teamim (Leningrad Codex) — 13/10/2026

**Fuente de teamim:** OpenScriptures `morphhb` (Westminster Leningrad Codex, `wlc/Ps.xml`), leído por git (Wikisource, HebrewBooks y Sefaria están bloqueados desde el entorno). **Código:** `tools/taamim/`. **Salida:** `METEG_PREDICHO_TEAMIM_20261013.json` (150 salmos).

## Regla
1. El tamaz (taʿam) marca la sílaba tónica, salvo los que se escriben antes (yetiv, telishá guedolá, dehi, ole, guerésh mukdam) o después (segolta, zarká, pashtá, telishá ketaná) de ella.
2. Si la tónica no es la última sílaba (el patáj furtivo cuenta como sílaba) → **meteg** en esa sílaba.
3. Si la sílaba lleva vav-shuruk o jolam escrito con vav, el meteg va en la consonante anterior (שְׁאֵלֽוּנוּ, הֱקִיצֽוֹתִי).
4. Palabras con maqqef: sin tónica propia. Sin teamim concluyentes: se usa el motor.

## Validación contra ArtScroll
| Muestra | Palabras decisivas | Coinciden |
|---|---|---|
| Salmos 137 y 126 (ArtScroll exacto, extraído del PDF) | 79 | **78 (98,7 %)** |
| Salmos 1–7, 14, 126, 137 (máster) | 525 | 495 (94 %) |

Única discrepancia con el PDF exacto: 137:7 הָאֹמְרִים (los teamim la dan penúltima; ArtScroll no pone meteg).

## Discrepancias con el máster (30)
- **25 «milel sin meteg»**: sobre todo -ֶךָ (נַחֲלָתֶךָ, בִרְכָתֶךָ, בְצִדְקָתֶךָ, בְּאַפֶּךָ, פָּנֶיךָ) y segolados (אֶרֶץ, רֶשַׁע). En el PDF ArtScroll estas formas **sí** llevan meteg (פָנֶֽיךָ, יָדֶֽךָ, אֶֽרֶץ, לֶֽחֶם). Probables omisiones del máster; falta confirmar en ArtScroll.
- **4 «milra con meteg»**: לַמְנַצֵּֽחַ (patáj furtivo; ya resuelto), כַּֽמֹּץ, כַּצִּֽנָּה, מִטָּֽתִי, כְּאַרְיֵֽה: posible meteg secundario (gaʿya) de ArtScroll; no se deduce de los teamim.

## Límites
- 4303 palabras sin teamim concluyentes (solo yetiv/segolta/etc.) quedan para el motor.
- Las capturas de la app se leen a ojo con poca certeza; no se usaron como evidencia.
- Nada se aplicó a los máster: la tabla JSON es una propuesta.
