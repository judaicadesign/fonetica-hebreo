# Informe de revisión de ivrit · Bircat Hamazón
**Fecha:** 2026-10-02  
**Estado:** revisión parcial con errores comprobados; **NO APROBADO**.  
**Versiones examinadas:** TXT «ASHKENAZ - Bircat Hamazon(2).txt» y «SEFARADI - Bircat Hamazon(2).txt», con seis cambios fonéticos expresamente autorizados, ninguno en el hebreo. 
**Rama:** `desarrollo/auditoria-tehilim-150` (repositorio privado). `main` intacto.

## Problemas confirmados en la copia Ashkenaz

| Ubicación | Texto heredado | Estado |
| --- | --- | --- |
| Encabezado inicial | `ברכת המזון · נוסח אשכנזברכת המזון · נוסח אשכנז` | Encabezado duplicado, corregir en versión maestra futura. |
| Birkat HaOrej | `בַּמָּּרוֹם` | El carácter mem acumula dagesh repetido. Contrastar y normalizar a `בַּמָּרוֹם` (sidur Birnbaum en Wikisource). |
| Sucot | `הַנֹֹּּפָלֶת` | El carácter nun tiene niqqud duplicado y la vocalización debe cotejarse cuidadosamente. La edición de Edot HaMizraj consultada escribe `הַנּוֹפֶלֶת`, y el siddur de la Torá y la Tierra da igual; existe otra grafía vocalizada `הַנּוֹפָלֶת` en una edición ashkenazí Birnbaum de Wikisource. **No sustituir sin fijar edición/nusaj canónico.** |
| Verso previo | `לְעולָם` | Vocalización parcial: falta el jolam de `עוֹ`; cotejar con `לְעוֹלָם`. |
| Repeticiones | `חַסְדּו` | Hay formas sin jolam sobre el vav, junto a `חַסְדּוֹ` con vocalización completa. Corregir uniformidad tras cotejo. |

Diagnóstico de integridad Unicode del bloque hebreo Ashkenaz: **2** clusters con marca Unicode idéntica duplicada (`מָּּ` y `נֹֹּּ`), uno de ellos con una vocal duplicada. No es prueba de que las demás palabras sean correctas.

## Problemas confirmados en la copia Sefaradí

- El encabezado `ברכת המזון · נוסח ע''מ` aparece dos veces en la zona de ivrit.
- Una aparición de `חַסְדּו` carece de jolam sobre vav, aunque en el mismo texto hay `חַסְדּוֹ` vocalizado.
- La inspección Unicode no encontró marcas idénticas duplicadas en una misma consonante; **esto NO valida el resto de las palabras**.
- Las secciones de zímún, Shabat, Rosh Jódesh, Ya'alé Veyavó, Janucá/Purim y Harajamán requieren cotejo lineal completo con un siddur sefaradí seleccionado; no homologar por mera similitud a Wikisource.

## Referencias de verificación externa
- [Wikisource: Nusaj Ashkenaz — Bircat Hamazón](https://he.wikisource.org/wiki/ברכת_המזון_-_אשכנז).
- [Wikisource: Birnbaum Ashkenaz — Bircat Hamazón](https://he.wikisource.org/wiki/הסידור_השלם_(בירנבוים)/אשכנז/ברכת_המזון).
- [Wikisource: Edot HaMizraj — Bircat Hamazón](https://he.wikisource.org/wiki/ברכת_המזון/עדות_מזרח).
- [Instituto Torá y Tierra: Ashkenaz — Bircat Hamazón](https://www.toraland.org.il/שימושון/סידור/אשכנז/ברכת-המזון/).
- Wikisource puede contener variantes y páginas no revisadas, por lo que es fuente de contraste y no reemplaza la elección de un siddur editorial maestro (p. ej., la edición ArtScroll previamente usada para Ashkenaz).

## Requisitos para cambiar a «APROBADO»
1. Cerrar edición canónica de cada nusaj y comparar **todo** el hebreo y sus opciones condicionales con la misma.
2. Corregir errores de texto/niqqud y los dos encabezados redundantes, manteniendo una lista de cada cambio.
3. Confirmar que la fonética del TXT coincide línea por línea con el hebreo finalmente aprobado; los ajustes recientes de `'amjá`, `ule'amjá`, `zijronenu` ya están acordados.
4. Guardar v1.0 con edición, fecha, perfil fonético y commit; solo entonces marcar `approved` y usar en publicaciones.

**Esta revisión no afecta a las publicaciones existentes, ni a la rama `main`, ni al proyecto del libro de Tehilim.**
