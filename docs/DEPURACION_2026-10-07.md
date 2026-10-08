# Depuración del generador · 7 de octubre de 2026

Cambios: control de nikud automático (activado inicialmente; apagarlo conserva las marcas existentes), actualización al cambiar de género, cancelación de solicitudes superadas, fonética anterior eliminada mientras se actualiza, índices de alternativas corregidos tras encabezados y preservación de ediciones manuales de meteg/nikud. La salida parcial se identifica si el servicio falla o devuelve palabras sin vocalizar. Se informa si la copia al portapapeles falla.

El comprobador ahora identifica el script del motor sin depender de su posición en el HTML. Los nuevos casos se ejecutan en CI.

Verificación: pruebas de flujo deterministas (incluyen respuestas tardías y falla del servicio), regresiones de jásar y mayúsculas reverenciales, Unicode y entrada de 60.000 caracteres. La auditoría mecánica cubre 150 capítulos, 2.527 versículos y 19.656 palabras, sin flags técnicos ni fallos de regresión.

Esto no certifica la pronunciación de todo el corpus. No se cambió el léxico de acentos ni los máster hebreos. Sigue pendiente interpretar meteg confirmado de ArtScroll según la procedencia interna y cerrar la revisión editorial de Tehilim.
