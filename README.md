# Judaica Design · Biblioteca editorial y conversor

Este repositorio privado guarda el **conversor de hebreo a fonética** y la **biblioteca editorial de textos con versiones**.

## Entradas rápidas

- **[ABRIR BIBLIOTECA EDITORIAL](./masters/README.md)** — catálogo de textos para reutilizar.
- **[Bircat Hamazón: Ashkenaz y Sefaradí](./masters/bircat-hamazon/README.md)** — leer o descargar los archivos hebreo + fonética.
- [Revisión pendiente del hebreo](./masters/bircat-hamazon/REVISION_IVRIT_2026-10-02.md) — observaciones antes de declarar textos definitivos.
- [Seguimiento de la auditoría del generador](./docs/AUDITORIA_TEHILIM_150.md).

**Estado actual:** los dos textos de Bircat Hamazón están **EN REVISIÓN**, **NO APROBADOS para impresión**. Se han conservado con las correcciones fonéticas `'amjá` y `ule'amjá` aprobadas por el editor. El hebreo sigue en cotejo.

## Sin programar

Para **ver un texto**, hacé clic en su nombre en la Biblioteca. Para **copiar el texto**, usá la opción `Raw`. Para **bajarlo a tu equipo**, elegí `Download raw file` o el ícono de descarga en la página del TXT. Podés abrirlo en Word.

Si abriste GitHub y ves una lista de carpetas, entrá en `masters` y luego en `bircat-hamazon`.

**Importante:** esta es la rama de auditoría `desarrollo/auditoria-tehilim-150`. La rama `main` está protegida de los cambios de desarrollo. No mezclar borradores con textos definitivos.

**Tehilim:** por ahora únicamente sirve como corpus para poner a punto el generador; no iniciar diseño ni maquetación del libro.


## Trabajo activo de fonética

Estado y pendientes: [ESTADO_GENERADOR_2026-10-07.md](docs/ESTADO_GENERADOR_2026-10-07.md).
Registro de decisiones y alcance: [DECISIONES_FONETICA_2026-10-07.json](docs/DECISIONES_FONETICA_2026-10-07.json).
No convertir tablas históricas en cambios automáticos; las confirmaciones de ArtScroll se contrastan y quedan cubiertas por pruebas.
