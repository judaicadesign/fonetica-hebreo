# Judaica Design® — Entrega a Claude: ArtScroll, Tehilim, fonética y rafé
**Fecha:** 13/10/2026 · **Estado:** expediente de trabajo; NO implica validación de los másters.
**Objetivo:** compartir con Claude el archivo de trabajo antes preparado en ChatGPT, sin que el usuario deba descargarlo desde su celular.

## Qué se ha guardado realmente

**Supabase:** proyecto `athiruoimehofqzrplnl` (acceso privado autorizado del equipo). Datos verificados:
- `public.app_state`, clave `jd_artscroll_evidence_manifest_v1`: manifiesto/inventario completo.
- `public.jd_editorial_evidence`: **37 referencias** a imágenes PNG y documentos PDF de ArtScroll con nombres, salmos, archivos de revisión GitHub y hashes históricos.
- `public.jd_rafe_review`: **73 propuestas/posiciones de shevá**; **65** tienen propuesta de token hebreo agregando U+05BF; **0 aprobadas**, **0 aplicadas a másters**.
- `public.app_state`, clave `jd_rafe_draft_psalm_001_v1`: los 6 versículos del Salmo 1 con **solo dos** rafé propuestos en 1:4; NO FINAL.
- Bucket **privado** `jd-artscroll-evidence` (Storage): **creado, pero SIN los PNG/PDF originales** a fecha de preparación.

**Limitación esencial:** las 36 capturas/PDF localizadas en la Biblioteca de ChatGPT `/Judaica Design/` aún NO fueron copiadas a Supabase Storage, porque el proveedor de archivos disponible en ChatGPT no autorizó exportar los bytes originales. El inventario y los hashes históricos NO sustituyen las imágenes. No afirmar que se han visto/cotejado las fuentes si no se han abierto realmente. Existe otra imagen en GitHub: `judaicadesign/judaica-design-system/masters/tehilim/sources/ARTSCROLL_001.png`.

## Fuente de verdad y protección editorial

1. **ArtScroll es GOLDEN MASTER** para grafías, vocalización (nikud), dagesh y meteg cuando difiere de Wikisource.
2. Wikisource es una base textual digital secundaria; NO valida el meteg ni el shevá na por sí sola.
3. Nunca tomar la salida actual del generador como evidencia de exactitud.
4. No modificar, promover ni reescribir un máster `FINAL` sin cotejo integral y aprobación editorial explícita. Cuando se descubre un error, dejar constancia y volver a cotejar; no borrar la revisión anterior.
5. El motor debe implementar **reglas lingüísticas generales**, con tests de palabras nuevas; evitar listas de excepciones que solo hagan pasar los ejemplos conocidos.
6. En transliteración JD se aplican las reglas editoriales del repositorio, no suposiciones nuevas.

## Segundo nivel: rafé para marcar shevá na

El usuario llama a estas marcas «rayitas» de shevá na. El nombre Unicode apropiado para añadirlas es **HEBREW POINT RAFE (U+05BF, ֿ)**. Shevá = **U+05B0 (ְ)**. El resultado es una **capa editorial hebrea enriquecida** (opcional/reversible), aparte del texto fiel a ArtScroll.

- Agregar U+05BF únicamente sobre una **consonante portadora de shevá na confirmado**. No sobre shevá naj/silente.
- Determinarlo a partir de **reglas gramaticales y el contexto** más evidencia visual de la rayita en ArtScroll. Meteg no siempre equivale a shevá na ni a tilde fonética.
- Preservar letras, signos de nikud, dagesh, meteg, espacios y puntuación. Probar la representación Unicode y el render final de impresión.
- Cuando no sea verificable, dejar «A REVISAR» y no introducir la marca en el máster.
- Revisar los 73 registros propuestos individualmente; **no son aprobaciones**.
- Ejemplos de propuesta del Salmo 1:4 (NO FINAL):
  - `הָרְשָׁעִים` → `הָרְֿשָׁעִים`
  - `תִּדְּפֶֽנּוּ` → `תִּדְּֿפֶֽנּוּ`
- Ocho registros no tienen token completo apto para mostrar la propuesta.

## Ubicación del trabajo ya existente

- Sistema y másters: https://github.com/judaicadesign/judaica-design-system
  - `masters/tehilim/ARTSCROLL_*_REVISION.json`
  - `masters/tehilim/ARTSCROLL_APP_TANDA_*.json`
- Generador de fonética: https://github.com/judaicadesign/fonetica-hebreo
  - `docs/SHEVA_COTEJO_20261012.json`
  - `docs/SHEVA_RULES_20261012.md`
- Fuentes PDF previamente nombradas:
  1. `ARTSCROLL - Transliterated_Tehillim_Eretz_Yisrael(1).pdf`
  2. `ArtScroll - ashkenaz bircat hamazon Interlinear Benching.pdf`
  3. `ARTSCROLL - tehillim-and-avinu-malkeinu-download-v3(1).pdf`

**NO contiene los bytes de estos PDFs**. Estaban en la Biblioteca privada de ChatGPT.

## Leer con conexión autorizada a Supabase

Ver archivo de solo lectura contiguo: [JD_ARTSCROLL_READ_ONLY_QUERIES_20261013.sql](JD_ARTSCROLL_READ_ONLY_QUERIES_20261013.sql).

Un acceso a GitHub permite que Claude lea **este documento y el código GitHub**. Para leer `public.app_state`, `public.jd_editorial_evidence` y `public.jd_rafe_review` hace falta conectar Claude de forma independiente a **Supabase con permisos legítimos**. No compartir claves `service_role` ni publicar las capturas en repositorios abiertos.

Para completar el traslado de fuentes: obtener originales, subirlos al bucket privado, verificar por lectura/descarga y SHA-256 sobre bytes reales, establecer `storage_path`, y solo entonces marcar `hash_verified`. **No inventar archivos u objetos de Storage con SQL.**

## Qué NO hacer

- No declarar que Claude ve automáticamente los PNG/PDF; no están en Storage.
- No revalidar como FINAL salmos solamente porque pasan pruebas del generador.
- No sustituir el texto hebreo aprobado por la propuesta con rafé.
- No implementar parches ad hoc por palabra como reemplazo de reglas gramaticales.
- No mostrar hashes históricos como verificados.

**Este documento es la parte legible del paquete de continuidad creado para Claude; el ZIP original de ChatGPT contenía esta guía y un archivo de consultas SQL, NO los originales de ArtScroll.**
