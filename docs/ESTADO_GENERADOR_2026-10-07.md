# Estado del generador — 7 de octubre de 2026

Las decisiones editoriales viven en `DECISIONES_FONETICA_2026-10-07.json`, junto al código y las pruebas. Un registro con estado implementado significa código y caso de prueba en la rama de desarrollo; no significa publicado en main.

## Implementado y comprobado

- Diez formas vocalizadas exactas: lamo, yevoshu, odejá, Kóraj, shiru, ’ení, jáyil, ’osé, óraj, lama.
- Tres correcciones contextuales: ata en בְּנִי אַתָּה אֲנִי; yadejá en מִמְתִים יָדְךָ יְהוָה; le’ezrati ante חוּשָׁה (incluido ketiv חישה).
- HaleluYah: reconocer la expresión unida, con espacio y con maqaf, también con taamim y varika. La normalización solo sirve a la fonética y no reescribe el master hebreo.
- 83 pruebas editoriales pasan; 166 comprobaciones de invariancia ante signos masoréticos; regresiones internas y merge Nakdan pasan. Ambos masters completos pasan su prueba de procesamiento.

## Lo que todavía falta

1. Tehilim: respuesta ArtScroll para בְּצִדְקָתְךָ (31:2), צִדְקָתְךָ (36:7), יֹאבֵדוּ (37:20), יְמִינְךָ (44:4), הָרִיעוּ (47:2). Confirmar además פֹּעֲלֵי (5:6), cuya lectura fue provisional, y la diferencia de לְעֶזְרָתִי en 38:23.
2. Continuar las familias pendientes del informe. Cada nueva tanda debe traer capítulo/pasuk y contexto hebreo, resaltando la palabra. Tras respuesta del usuario, comprobar repeticiones y aplicar lo seguro sin esperar otro pedido.
3. Bircat Hamazón: alinear el master digital de Wikisource por aparición con ArtScroll. No interpretar meteg bíblico como marca editorial principal ni inferir marcas ausentes. Implementar la lectura de acento editorial de ArtScroll cuando la procedencia esté explícita.
4. Decidir tildes después de tónica y silabeo. Jayinu, hoshi’enu, ’alenu, ’enenu y Eleja ya representan el acento llano sin tilde; rajamím requiere tilde porque termina en m. Mantener hiatus cuando corresponde (raíti).
5. Botón agregar/quitar marcas: aplazado expresamente; no construirlo aún.

## Material conservado y autoridad

`antecedentes/tabla-importada-2026-10-07.txt` conserva íntegramente el archivo aportado. Es una tabla histórica no aprobada. El informe original de los 150 Tehilim queda en `tests/data/tehilim-audit-baseline-2026-10-02.json`. No confundir las 738 alertas con 738 errores certificados.

Wikisource es fuente digital principal. ArtScroll es referencia editorial para acento/nikud en la edición controlada. OSHB solo es evidencia auxiliar de la auditoría original. Wikisource también ofrece taamim.

## Conflictos detectados en tablas históricas

- No convertir cada etiqueta OK de una tabla antigua en aprobación de código: hay contradicciones internas.
- רַבּוֹתַי: la columna que afirma marca en בוֹ contradice la tónica rabotái; pendiente de comprobar la imagen, no mover acento.
- מֵעַתָּה: marca afirmada en עַ pero tónica final en la misma fila; la revisión visual posterior del Bircat no encontró esa marca. No aplicar la corrección antigua me’ata.
- מְהֵרָה y בִּמְהֵרָה: la revisión visual posterior del Bircat no encontró las marcas afirmadas en la tabla; conservar meherá/bimherá hasta contrastar cada aparición.
- -eja: la tabla antigua afirma finales en pasajes de Bircat donde la revisión posterior encontró marcas internas; no convertir toda la familia en -ejá. Yadejá se limita al contexto de Tehilim 17:14.
- וּפִנּוּ: revisión posterior del Bircat sin marca: ufinú; la propuesta ufinu era errónea.
- חָסַר: marca comprobada, jásar; implementado en tablas GOLD de main/desarrollo y master Ashkenaz. Ashkenaz incorpora חָֽסַר en el hebreo. El resto del master sigue en revisión.
- מֶשֶׁךְ: marca comprobada, méshej; pendiente de la fase Bircat.
- לֶחֶם con segol: léjem; לָחֶם con kamatz en el final: lájem. No unificar las vocales.
- רָאִיתִי: conservar raíti para el hiato; no eliminar la tilde basándose solo en que sería llana en hebreo.
- רַחֲמִים: rajamím, acento final necesita tilde; la explicación histórica sin tilde era incorrecta.

## Publicación

Las correcciones de este lote se guardan en desarrollo/auditoria-tehilim-150. No se declara terminado el Tehilim ni los masters, no se modifica main y no se publica una edición completa. Antes de lanzar hay que cerrar la revisión editorial indicada en NORMA_EDITORIAL.md.

## Resultado de la auditoría reproducida

738 → 667 alertas por palabras aisladas. La referencia tiene 150 capítulos, 2.527 pesukim y 19.656 tokens; se conserva el mismo blob OSHB y el mismo denominador de comparación. Esta métrica no ve las reglas que requieren palabras vecinas. Las 8 alertas de הַלְלוּ requieren analizar la expresión completa y permanecen en el informe; no contarlas como errores de acento certificados.

## Arreglo puntual publicado en main: חָסַר

Se corrigen las dos entradas de GOLD ash/sef a jásar, con pruebas para entrada con/sin meteg y el pasaje completo. Se incorpora únicamente esta marca comprobada al master hebreo Ashkenaz La modificación del TXT sefardí se revierte: falta cotejo con su referencia propia, Bircat Shelomo. El master Ashkenaz ya tenía jásar en su fonética, pero el motor conservaba jasar: las dos capas se alinean. No se declara completo el resto de meteg de ArtScroll. Las 13 decisiones de Tehilim continúan en desarrollo. Pruebas: 86 casos editoriales, 172 comprobaciones de invariancia; ambos masters pasan procesamiento; main pasa regresiones internas y prueba puntual. Guardar en main no acredita por sí solo el despliegue de un sitio externo.

## Master hebreo Ashkenaz: meteg incorporados

Se agregaron 241 meteg por aparición, hasta 242 en el bloque hebreo, cotejados con los recortes del PDF de ArtScroll. Registro completo: `masters/bircat-hamazon/METEG_ARTSCROLL_2026-10-07.json`. Se comprobaron todas las ubicaciones extraídas; tres formas de Jerusalén conservan la grafía heredada y reciben la marca en lamed. Cuatro palabras marcadas del PDF pertenecen a pasajes ausentes del TXT y no se insertan; el zímún de Sheva Berajot, ausente de este PDF, no se marca por analogía. Las consonantes, el resto del nikud y la fonética quedan intactos. Esto completa la incorporación de marcas de los pasajes alineados, no la revisión del nikud ni la lectura de meteg por el motor.

## Mayúsculas reverenciales y uso de meteg: decisión del editor

Se restablece `Baruj Atá Ad-nai` por referencia explícita a Hashem y el sufijo reverencial en `potéaj et Yadeja`. Las formas de segunda persona fuera de estos contextos no se capitalizan globalmente. Pruebas con y sin meteg y contraejemplos humanos. `Rajamim` y `le’olam` no necesitan tilde por ser agudas terminadas en m. `Raíti` conserva tilde de hiato ra-í-ti.

El editor rechaza un activador manual de lectura de meteg: Codex coteja y edita los masters. La futura lectura del meteg usará el registro editorial del master; el carácter pegado por sí solo no identifica fuente. No se presenta esa lectura como ya implementada. El TXT entregado es una copia de consulta del master, no una tarea de carga o edición para el usuario.

Rectificación: `(Kaamur: potéaj et Yadeja…)` conserva el verbo en minúscula. La regla general editorial es capitalizar referencias a Hashem; el motor actualmente reconoce contextos específicos, no todas las referencias semánticas. No describir esos reconocimientos parciales como cobertura completa de la regla.
