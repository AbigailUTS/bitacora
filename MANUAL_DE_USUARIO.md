# Manual de Usuario - Bitácora Web

## Índice

1. [Visión general](#visi%C3%B3n-general)
2. [Acceso e inicio de sesión](#acceso-e-inicio-de-sesi%C3%B3n)
3. [Navegación principal](#navegaci%C3%B3n-principal)
4. [Dashboard](#dashboard)
5. [Gestión de clasificaciones](#gesti%C3%B3n-de-clasificaciones)
6. [Gestión de dependencias](#gesti%C3%B3n-de-dependencias)
7. [Gestión de ubicaciones](#gesti%C3%B3n-de-ubicaciones)
8. [Creación y administración de reportes](#creaci%C3%B3n-y-administraci%C3%B3n-de-reportes)
9. [Historial de reportes](#historial-de-reportes)
10. [Panel de gráficos](#panel-de-gr%C3%A1ficas)
11. [Roles y controles de acceso](#roles-y-controles-de-acceso)
12. [Recomendaciones de uso](#recomendaciones-de-uso)
13. [Resolución de problemas comunes](#resoluci%C3%B3n-de-problemas-comunes)
14. [Configuración y despliegue](#configuraci%C3%B3n-y-despliegue)
15. [Glosario de términos](#glosario-de-t%C3%A9rminos)

---

## Visión general

Bitácora Web es una aplicación administrativa para la gestión de reportes, clasificaciones, dependencias y ubicaciones. Está diseñada para ayudar al personal administrativo a capturar, organizar y analizar información asociada a eventos, incidencias o actividades institucionales.

El sistema se organiza en módulos, cada uno con tareas específicas, y ofrece una experiencia guiada para administrar datos y generar reportes completos.

---

## Acceso e inicio de sesión

### 1. Abrir la aplicación

- Abre un navegador moderno como Microsoft Edge, Google Chrome o Mozilla Firefox.
- Navega a `http://localhost:3000` cuando el servidor de desarrollo esté en ejecución.

### 2. Usuario y permisos

- La aplicación puede tener un mecanismo de autenticación en la capa de proyecto. Si se requiere credenciales, utiliza el usuario y contraseña asignados por el administrador.
- Si estás en un entorno de prueba local, sigue las instrucciones del equipo técnico para configurar o solicitar accesos.

### 3. Inicio de sesión

- En la página de inicio, ingresa tu usuario y contraseña.
- Si la aplicación está integrada con Supabase o similar, el proceso de autenticación se valida contra la base de datos.
- Tras iniciar sesión correctamente, serás redirigido al Dashboard principal.

### 4. Cierre de sesión

- Busca un botón o enlace de cierre de sesión en el menú o encabezado.
- Usa el cierre de sesión para proteger tus datos cuando termines de trabajar.

---

## Navegación principal

La aplicación está estructurada en secciones accesibles desde el menú lateral o superior.

### 1. Secciones principales

- **Dashboard**: Página inicial con resumen de información clave.
- **Clasificaciones**: Área para registrar y administrar las etiquetas o categorías.
- **Dependencias**: Administración de unidades o áreas institucionales.
- **Ubicaciones**: Gestión de lugares físicos o espacios vinculados a los reportes.
- **Reportes**: Generación y seguimiento de reportes activos.
- **Historial de reportes**: Consulta de reportes previos y su seguimiento.
- **Panel de gráficos**: Visualización de datos en métricas y gráficos.

### 2. Uso del menú

- Haz clic en cada elemento del menú para cambiar de sección.
- Los cambios de sección suelen actualizar el contenido sin recargar toda la página, aprovechando las ventajas de Next.js.
- Si tu sesión expira, el sistema puede redirigirte de nuevo a la pantalla de acceso.

---

## Dashboard

### 1. Objetivo

El Dashboard ofrece un resumen rápido del estado general del sistema. Es la primera pantalla que verás tras iniciar sesión.

### 2. Contenido típico

- Resumen de reportes recientes.
- Accesos directos a las secciones más usadas.
- Indicadores de estado o métricas clave.
- Botones para crear nuevos elementos si están habilitados.

### 3. Cómo usarlo

- Revisa las tarjetas de información para conocer qué áreas requieren atención.
- Usa los accesos directos para ir directamente a la creación o gestión de registros.

---

## Gestión de clasificaciones

### 1. ¿Qué son las clasificaciones?

Las clasificaciones son etiquetas o categorías que se aplican a los reportes para organizarlos por tipo, prioridad, área u otro criterio relevante.

### 2. Acceder al módulo

- Selecciona **Clasificaciones** en el menú principal.

### 3. Crear una clasificación

- Busca el botón de `Agregar` o `Nueva clasificación`.
- Completa el formulario con el nombre y la descripción de la clasificación.
- Guarda el registro para que quede disponible al generar reportes.

### 4. Editar una clasificación

- Ubica la clasificación que deseas cambiar en la lista.
- Haz clic en el ícono de edición o en el nombre del registro.
- Modifica los campos necesarios y guarda los cambios.

### 5. Eliminar una clasificación

- Identifica la clasificación que ya no se debe usar.
- Presiona el botón de eliminación (generalmente un ícono de papelera).
- Confirma la acción si el sistema solicita confirmación.
- Nota: elimina solo cuando estés seguro, ya que puede afectar reportes vinculados.

### 6. Buenas prácticas

- Usa nombres claros y consistentes.
- Mantén descripciones breves para entender el propósito de cada clasificación.
- Evita duplicados para facilitar la búsqueda y filtrado.

---

## Gestión de dependencias

### 1. ¿Qué es una dependencia?

Una dependencia representa una unidad organizativa, área administrativa o departamento asociado a la información de los reportes.

### 2. Acceder al módulo

- Selecciona **Dependencias** en el menú principal.

### 3. Crear una dependencia

- Haz clic en `Agregar dependencia`.
- Ingresa el nombre de la dependencia y cualquier detalle requerido.
- Guarda el registro.

### 4. Editar una dependencia

- Selecciona dependencia existente.
- Modifica su nombre, descripción o datos adicionales.
- Guarda los cambios.

### 5. Eliminar una dependencia

- Elimina solo si ya no hay registros que dependan de esta unidad.
- Confirma la eliminación si el sistema lo solicita.
- Ten en cuenta que puede afectar la consistencia de datos históricos.

### 6. Uso en combinación con ubicaciones

- Las ubicaciones suelen vincularse a dependencias.
- Asegúrate de registrar primero la dependencia y luego crear las ubicaciones correspondientes a ella.

---

## Gestión de ubicaciones

### 1. ¿Qué es una ubicación?

La ubicación define el lugar físico o el espacio asociado a un reporte, por ejemplo una oficina, área de trabajo o edificio.

### 2. Acceder al módulo

- Selecciona **Ubicaciones** en el menú principal.

### 3. Crear una ubicación

- Haz clic en `Agregar ubicación`.
- Ingresa el nombre de la ubicación y, si aplica, su relación con una dependencia.
- Guarda el registro.

### 4. Editar una ubicación

- Selecciona una ubicación existente.
- Actualiza los datos necesarios.
- Guarda los cambios.

### 5. Eliminar una ubicación

- Elimina cuando ya no exista o haya cambiado la estructura física.
- Comprueba que no esté vinculada a reportes en curso.
- Confirma la acción si el sistema solicita autorización.

### 6. Sugerencias de uso

- Mantén una nomenclatura uniforme para ubicaciones.
- Incluye el nombre de la dependencia o el área en la ubicación si la aplicación no lo hace automáticamente.
- Usa ubicaciones para filtrar reportes más fácilmente.

---

## Creación y administración de reportes

### 1. ¿Para qué sirve el módulo de reportes?

Este módulo permite generar reportes nuevos, ver su estado, modificar su contenido y consultar información relevante de cada registro.

### 2. Acceder al módulo

- Selecciona **Reportes** en el menú principal.

### 3. Crear un reporte

- Pulsa el botón `Crear reporte` o `Nuevo reporte`.
- Completa los campos del formulario:
  - Clasificación: asigna la categoría correspondiente.
  - Dependencia: selecciona el área responsable.
  - Ubicación: indica el lugar asociado.
  - Descripción: describe el evento, incidencia o motivo del reporte.
  - Estado: selecciona el estado inicial (por ejemplo, pendiente, en revisión, resuelto).
- Revisa la información y guarda el reporte.

### 4. Editar un reporte

- Encuentra el reporte en la lista o mediante búsqueda.
- Abre el registro y actualiza los campos que deban modificarse.
- Guarda los cambios para mantener la información actualizada.

### 5. Cambiar el estado de un reporte

- Selecciona el reporte que necesite actualización.
- Modifica el campo de estado para reflejar el progreso.
- Guarda para que el cambio se registre y se refleje en los paneles.

### 6. Eliminar un reporte

- Solo elimina reportes cuando sea necesario y autorizado.
- Usa el botón de eliminación y confirma la acción.
- Evita eliminar información crítica sin respaldo o autorización.

### 7. Filtrado y búsqueda

- Usa los filtros disponibles para buscar reportes por clasificación, dependencia, ubicación o estado.
- Filtra también por fecha cuando esa opción esté habilitada.
- Aprovecha la búsqueda para encontrar reportes específicos rápidamente.

### 8. Recomendaciones para reportes

- Describe claramente el motivo y la acción tomada.
- Selecciona la clasificación y dependencia correctas.
- Actualiza el estado conforme avanza el seguimiento.
- Incluye datos adicionales solo si son relevantes para el seguimiento.

---

## Historial de reportes

### 1. Objetivo del historial

El historial permite revisar reportes antiguos, verificar su estado final y realizar auditorías de seguimiento.

### 2. Acceder al módulo

- Selecciona **Historial de reportes** en el menú principal.

### 3. Consultar reportes históricos

- Usa la lista de reportes para revisar eventos pasados.
- Filtra por fechas, clasificaciones o dependencias según lo necesites.
- Abre un reporte histórico para ver su detalle.

### 4. Uso en auditoría

- El historial es útil para comprobar acciones realizadas en el pasado.
- Verifica la trazabilidad de cambios de estado.
- Usa el historial para medir resultados y conocer tendencias.

### 5. Buenas prácticas

- Consulta el historial antes de crear un reporte duplicado.
- Revisa la última información grabada para evitar errores.
- Mantén la información histórica completa y precisa.

---

## Panel de gráficos

### 1. Propósito

El panel de gráficos presenta indicadores visuales que ayudan a interpretar el comportamiento de los reportes y las áreas de gestión.

### 2. Acceder al módulo

- Selecciona **Panel de gráficos** en el menú principal.

### 3. Tipos de visualizaciones

- Gráficos de barras, líneas o áreas.
- Indicadores de totales por clasificación, dependencia o estado.
- Tablas resumidas o paneles de métricas.

### 4. Cómo interpretar los gráficos

- Revisa qué clasificaciones tienen mayor volumen de reportes.
- Observa las dependencias con más actividad.
- Identifica tendencias de estado para priorizar acciones.
- Usa los datos para tomar decisiones basadas en resultados.

### 5. Acciones recomendadas

- Verifica los reportes pendientes si el gráfico muestra muchos estados no resueltos.
- Consulta el detalle de un área cuando el gráfico refleje un pico de incidencias.
- Usa el panel como apoyo en reuniones de seguimiento.

---

## Roles y controles de acceso

### 1. Usuarios administrativos

- Los usuarios con permisos administrativos pueden ver y editar más secciones.
- Pueden crear, modificar y eliminar clasificaciones, dependencias, ubicaciones y reportes.

### 2. Usuarios estándar

- Pueden tener acceso limitado a ciertas funciones.
- Es posible que puedan ver reportes y generar solicitudes sin administración completa.

### 3. Reglas de acceso

- El sistema suele ocultar o deshabilitar botones según el rol del usuario.
- Si no ves una opción, puede ser porque tu rol no la permite.
- Consulta con el administrador para ampliar permisos si lo necesitas.

---

## Recomendaciones de uso

### 1. Flujo recomendado

1. Registra primero las clasificaciones y dependencias.
2. Crea las ubicaciones relacionadas con cada dependencia.
3. Genera reportes con clasificación y ubicación clara.
4. Revisa el historial para validación y seguimiento.
5. Utiliza el panel de gráficos para obtener una visión general.

### 2. Organización de datos

- Mantén etiquetas y nombres coherentes.
- Evita duplicar clasificaciones o dependencias.
- Usa descripciones precisas para cada reporte.

### 3. Mantenimiento periódico

- Revisa y actualiza clasificaciones según cambien los procesos.
- Elimina ubicaciones obsoletas solo después de confirmar que no afectan reportes activos.
- Monitorea el historial y los gráficos para detectar patrones.

---

## Resolución de problemas comunes

### 1. No puedo iniciar sesión

- Verifica tu usuario y contraseña.
- Comprueba que el servidor local esté en ejecución (`pnpm dev`).
- Si el problema persiste, revisa la configuración de autenticación o contacta al administrador.

### 2. No veo una sección del menú

- Tu rol puede no tener permisos para esa sección.
- Refresca la página y vuelve a iniciar sesión.
- Consulta al administrador si la ausencia es un error.

### 3. Un reporte no se guarda

- Revisa que todos los campos obligatorios estén completos.
- Asegúrate de tener conexión estable con el servidor local.
- Verifica mensajes de error en la interfaz.

### 4. No encuentro un registro

- Usa la búsqueda o los filtros disponibles.
- Revisa la ortografía y las fechas aplicadas.
- Consulta el historial para ver si el registro fue eliminado.

### 5. Datos inconsistentes entre secciones

- Las relaciones entre dependencias, ubicaciones y reportes deben estar bien vinculadas.
- Actualiza primero los registros maestros (clasificaciones, dependencias, ubicaciones) antes de modificar reportes.

---

## Configuración y despliegue

### 1. Preparar el entorno local

- Clona el repositorio y accede a la carpeta del proyecto.
- Instala dependencias con `pnpm install`.
- Inicia el servidor con `pnpm dev`.
- Asegúrate de tener Node.js 18.x o 20.x.

### 2. Variables y servicios

- Si la aplicación usa Supabase, revisa los archivos de configuración y variables de entorno.
- Configura las credenciales de base de datos según el entorno.

### 3. Despliegue en producción

- Revisa la documentación de Next.js para desplegar en Vercel, Netlify o tu servidor preferido.
- Asegura que las variables de entorno estén definidas en el entorno de producción.
- Haz pruebas funcionales después del despliegue.

### 4. Mantenimiento

- Mantén actualizadas las dependencias del proyecto.
- Realiza copias de seguridad de la configuración y la base de datos.
- Documenta cualquier cambio en el sistema para el equipo.

---

## Glosario de términos

- **Dashboard**: Pantalla principal con resumen e indicadores.
- **Clasificación**: Categoría o etiqueta usada para agrupar reportes.
- **Dependencia**: Unidad administrativa o área responsable de un reporte.
- **Ubicación**: Lugar físico asociado al reporte.
- **Reporte**: Registro que documenta un evento, incidencia o actividad.
- **Historial**: Registro de reportes anteriores.
- **Panel de gráficos**: Visualización de datos e indicadores.
- **Supabase**: Servicio de backend usado para autenticación y base de datos, si aplica.
- **Next.js**: Framework de React usado para construir la aplicación.

---

## Contacto y soporte

- Si necesitas ayuda adicional, consulta al equipo de desarrollo.
- Comparte errores concretos y pasos para reproducirlos.
- Mantén comunicación clara sobre cambios y actualizaciones necesarias.
