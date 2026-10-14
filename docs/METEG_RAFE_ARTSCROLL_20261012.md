# Meteg, rafe y acento: hallazgos del 12 de octubre de 2026

## Convención de ArtScroll (párrafo "Gramática Hebrea" del sidur)
- El acento va por lo general en la última sílaba. Si no, se indica con **meteg** (línea vertical debajo de la letra).
- Un **shevá na** se indica con una línea encima de la letra (rafe), salvo en la primera letra de la palabra, que siempre es shevá na.
- Las reglas para identificar el shevá na son las del Gaón de Vilna y de Rabí Yaacov Emden (Dikduk Eliyahu, "Shaar HaShva", págs. כו–כז).

## Evidencia visual (ArtScroll Bircat Hamazón, PDF págs. 6 y 7 = libro págs. 8 y 9)
| Palabra | Marcas en ArtScroll | Lectura | Fonética |
|---|---|---|---|
| תּוֹרָתְךָ (pág. 8) | sin meteg, rafe en la ת | acento final | Toratejá |
| בְּרִיתְךָ (pág. 8) | sin meteg, rafe en la ת | acento final | Beritejá |
| תּוֹרָתֶךָ (pág. 9, segol) | con meteg | acento en el segol | Toratéja (sin tilde: el español ya acentúa la "te") |

Criterio editorial: **Torá se escribe siempre con T mayúscula**, también dentro de la palabra (haTorá, Toratejá, Toratéja).

## Cambios en el motor (este commit)
1. Sustantivos femeninos en -תְךָ (shevá + ךָ) llevan acento final aunque la vocal anterior sea kamats, tsere o jolam. Antes solo se cubría jirik/patáj/jatef. Los verbos con sufijo objeto (por ejemplo שֹׁמְרֶךָ, יְשַׂגֶּבְךָ) no entran en la regla.
2. Formas fijadas corregidas: תּוֹרָתְךָ → Toratejá y בְּרִיתְךָ → beritejá (antes beritjá, sin la e de la shevá na).
3. Regla de mayúscula: cualquier palabra cuya raíz sea תורה/תורת recibe la T mayúscula.
4. Instantáneas de versículos que arrastraban la lectura anterior, actualizadas: 2:8 (vaajuzatejá), 18:16 (Miga'aratejá), 18:36 (Ve'anvatejá), 20:4 (ve'olatejá), 20:5 ('atsatejá), 6:2 (Bajamatejá), 83:16 (uvSufatejá) y 121:8 (tsetejá). Ninguna es una verificación nueva contra ArtScroll: son la salida del motor con la regla corregida. Conviene revisar 121:8 (צֵאתְךָ) contra la página impresa.

## Pendiente
- Derivar el meteg por reglas para agregarlo al hebreo cuando la opción esté activada (hoy se conserva el que viene en el texto, pero no se infiere ni se usa para el acento).
- Derivar el rafe del shevá na por reglas (hoy se respeta el que viene escrito, pero no se agrega solo). Las reglas del Gaón 6 y 7 siguen pendientes de verificación.
- שִׁירוּ con meteg debe dar shíru: el motor todavía ignora el meteg para el acento.
- Caso וַיְהִי / Vayehí: según el Gaón (regla 6, excepción de las raíces היה y חיה) la shevá sería naj (vayhí). Falta revisar qué marca ArtScroll sobre esa yod.
