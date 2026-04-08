# Manual de Desarrollo - Bitácora Web

## Índice

1. [Descripción del proyecto](#descripci%C3%B3n-del-proyecto)
2. [Requisitos y entorno de desarrollo](#requisitos-y-entorno-de-desarrollo)
3. [Instalación y arranque local](#instalaci%C3%B3n-y-arranque-local)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Flujo de trabajo para desarrollar](#flujo-de-trabajo-para-desarrollar)
6. [Componentes clave](#componentes-clave)
7. [Servicios y acceso a datos](#servicios-y-acceso-a-datos)
8. [Rutas y páginas de Next.js](#rutas-y-p%C3%A1ginas-de-nextjs)
9. [Manejo de estilos y diseño](#manejo-de-estilos-y-dise%C3%B1o)
10. [Uso de TypeScript](#uso-de-typescript)
11. [Linter y calidad de código](#linter-y-calidad-de-c%C3%B3digo)
12. [Configuración de despliegue](#configuraci%C3%B3n-de-despliegue)
13. [Pruebas y validación](#pruebas-y-validaci%C3%B3n)
14. [Consejos y buenas prácticas](#consejos-y-buenas-pr%C3%A1cticas)
15. [Glosario técnico](#glosario-t%C3%A9cnico)

---

## Descripción del proyecto

Bitácora Web es una aplicación administrativa construida con Next.js 16 y React 19 para gestionar datos de reportes, clasificaciones, dependencias y ubicaciones. La aplicación integra servicios de backend mediante Supabase y proporciona paneles de visualización, gestión de registros y registro histórico.

El objetivo del manual es guiar a nuevos desarrolladores para contribuir, extender y desplegar la aplicación de manera segura y ordenada.

---

## Requisitos y entorno de desarrollo

### Requisitos de software

- Node.js: versión 18.x o 20.x.
- pnpm: recomendado para instalar dependencias.
- Git: para control de versiones.
- Visual Studio Code: editor recomendado.
- Navegador moderno: Microsoft Edge, Chrome o Firefox.

### Dependencias principales

- `next` 16.1.1
- `react` 19.2.3
- `react-dom` 19.2.3
- `@supabase/supabase-js` 2.40.0
- `recharts` 3.8.1
- `react-select` 5.10.2
- `date-fns` 4.1.0
- `jspdf` y `jspdf-autotable` para generación de PDF

### Dependencias de desarrollo

- `typescript` 5
- `eslint` 9
- `eslint-config-next` 16.1.1
- `tailwindcss` 4
- `@tailwindcss/postcss` 4
- `@types/node`, `@types/react`, `@types/react-dom`

---

## Instalación y arranque local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd bitacora
```

### 2. Instalar dependencias

```bash
pnpm install
```

Si no tienes `pnpm` instalado:

```bash
npm install -g pnpm
```

### 3. Ejecutar el servidor de desarrollo

```bash
pnpm dev
```

Accede a la aplicación en:

```text
http://localhost:3000
```

### 4. Comandos útiles

- `pnpm dev`: ejecuta la aplicación en modo desarrollo.
- `pnpm build`: construye la aplicación para producción.
- `pnpm start`: arranca la aplicación construida.
- `pnpm lint`: ejecuta ESLint.

---

## Estructura del proyecto

### Raíz del proyecto

- `app/`: páginas y rutas principales de Next.js.
- `components/`: componentes de interfaz y paneles reutilizables.
- `lib/`: servicios, utilidades y clientes de datos.
- `public/`: activos estáticos como imágenes.
- `README.md`: guía general del proyecto.
- `package.json`: scripts, dependencias y metadatos.
- `tsconfig.json`: configuración de TypeScript.
- `next.config.ts`: configuración de Next.js.
- `postcss.config.mjs`: configuración de PostCSS para Tailwind.
- `eslint.config.mjs`: configuración de ESLint.

### Detalle de carpetas principales

- `app/menu/page.tsx`: página de menú o navegación.
- `app/register/page.tsx`: página para registro o acceso.
- `app/reset/page.tsx`: página para restablecer datos o contraseña.
- `components/modals/`: modales globales para acciones específicas.
- `components/panels/`: paneles administrativos de cada entidad.
- `lib/*Service.ts`: módulos de servicio que abstraen llamadas a API o a Supabase.
- `lib/supabaseClient.ts`: cliente de Supabase exportado para uso global.
- `lib/useIsAdmin.ts`: hook personalizado para detectar permisos administrativos.
- `lib/models/reporte.ts`: modelo o tipos relacionados a reportes.

---

## Flujo de trabajo para desarrollar

### 1. Revisión inicial

- Revisa la `README.md` y `MANUAL_DE_USUARIO.md` para entender la funcionalidad general.
- Examina las carpetas `components/`, `app/` y `lib/` para conocer la organización del código.

### 2. Configurar el entorno local

- Instala dependencias y arranca la aplicación.
- Si la aplicación usa variables de entorno, crea un archivo `.env.local` con las claves necesarias.
- Asegúrate de que el servidor de desarrollo levante sin errores.

### 3. Crear una nueva rama

- Usa un nombre descriptivo para la rama:

```bash
git checkout -b feature/nombre-de-la-funcionalidad
```

### 4. Desarrollar la funcionalidad

- Modifica o agrega componentes en `components/`.
- Añade o actualiza páginas en `app/` si necesitas nuevas rutas.
- Usa servicios en `lib/` para mantener la lógica de acceso a datos separada de la UI.

### 5. Probar localmente

- Verifica la navegación y el comportamiento en el navegador.
- Comprueba los componentes reutilizables y los paneles afectados.
- Ejecuta `pnpm lint` para validar el formato y reglas de ESLint.

### 6. Preparar la solicitud de cambios

- Haz commits pequeños y claros.
- Sincroniza con la rama principal antes de crear un Pull Request:

```bash
git fetch origin
git rebase origin/main
```

- Describe en el PR los cambios, pruebas realizadas y dependencias nuevas.

---

## Componentes clave

### Componentes de interfaz

- `components/Sidebar.tsx`: menú lateral principal.
- `components/DashboardLayout.tsx`: diseño del dashboard y contenedor común.
- `components/HoverCard.tsx`: tarjetas con interacción hover.
- `components/ReporteCard.tsx`: tarjeta para mostrar resumen de reporte.
- `components/ConfirmationModal.tsx`: modal de confirmación genérico.

### Modales

- `components/modals/AreasAdminModal.tsx`: modal para administrar áreas o clasificaciones.
- `components/modals/PrintReportesModal.tsx`: modal para impresión y generación de PDF.
- `components/modals/ReporteModal.tsx`: modal para ver o editar detalles de reportes.
- `components/RoleModal.tsx`: modal para gestión de roles o permisos.

### Paneles administrativos

- `components/panels/ClasificacionesAdminPanel.tsx`
- `components/panels/DependenciasAdminPanel.tsx`
- `components/panels/UbicacionAdminPanel.tsx`
- `components/panels/ReportesPanel.tsx`
- `components/panels/HistorialReportesPanel.tsx`
- `components/panels/GraficasPanel.tsx`
- `components/panels/GenerarReportePanel.tsx`
- `components/panels/EstatusReportesPanel.tsx`

---

## Servicios y acceso a datos

### Supabase

- `lib/supabaseClient.ts` contiene la configuración y exportación del cliente de Supabase.
- Usa este cliente en los servicios bajo `lib/` para consultas y operaciones con la base de datos.

### Servicios de dominio

- `lib/areasService.ts`: funciones para gestionar áreas o clasificaciones.
- `lib/clasificacionesService.ts`: servicios para clasificaciones.
- `lib/dependenciasService.ts`: servicios de dependencias.
- `lib/ubicacionesService.ts`: servicios de ubicaciones.
- `lib/reportesService.ts`: servicios para crear, obtener y actualizar reportes.

### Reglas de separación

- Mantén la lógica de llamadas a la API en `lib/`.
- Deja que los componentes se enfoquen en renderizar UI y manejar eventos.
- Usa tipos e interfaces para definir la forma de los datos que llegan de Supabase.

---

## Rutas y páginas de Next.js

### Convenciones de `app/`

- Cada carpeta bajo `app/` corresponde a una ruta.
- `page.tsx` define la página principal de esa ruta.
- Los componentes y páginas pueden usar `export default function` o componentes funcionales.

### Páginas existentes

- `/`: Página raíz, generalmente el dashboard o página inicial.
- `/menu`: Página de menú principal.
- `/register`: Página de registro o alta de usuario.
- `/reset`: Página de restablecimiento.

### Añadir nuevas rutas

- Crea una carpeta nueva bajo `app/` con `page.tsx`.
- Añade rutas anidadas creando subcarpetas.
- Usa `Link` de `next/link` para navegar internamente.

---

## Manejo de estilos y diseño

### Tailwind CSS

- La aplicación usa Tailwind CSS versión 4.
- Configura estilos globales y utilidades desde `app/globals.css`.

### Estilos globales

- `app/globals.css` contiene estilos aplicados a toda la app.
- Añade clases utilitarias de Tailwind a los componentes para estilo rápido.

### Buenas prácticas de CSS

- Prefiere clases de Tailwind en lugar de CSS personalizado cuando sea posible.
- Usa componentes de presentación para separar estilos de la lógica.
- Evita estilos globales innecesarios que puedan interferir con otros componentes.

---

## Uso de TypeScript

### Configuración

- `tsconfig.json` define las opciones de compilación.
- El proyecto está en modo `strict`.
- Se usa alias `@/*` para resolver rutas desde la raíz.

### Reglas principales

- Usa `interface` o `type` para definir props y modelos.
- Tipa los resultados de servicios y funciones asíncronas.
- Aprovecha `React.Dispatch`, `React.SetStateAction` y tipos componentes según convenga.

### Inclusión de archivos

- El `include` incluye `**/*.ts`, `**/*.tsx`, `**/*.mts` y archivos generados de Next.js.
- Evita incluir `node_modules`.

---

## Linter y calidad de código

### ESLint

- Ejecuta `pnpm lint` para validar el código.
- La configuración se basa en `eslint-config-next`.

### Reglas recomendadas

- Mantén el código limpio y coherente.
- Usa `prettier` si está configurado en tu editor, aunque no forme parte de `package.json`.
- Corrige advertencias antes de subir cambios.

### Hooks de editor

- Activa la integración de ESLint y TypeScript en VS Code.
- Valida errores en tiempo real para acelerar el desarrollo.

---

## Configuración de despliegue

### Generar build de producción

```bash
pnpm build
```

### Ejecución en producción

```bash
pnpm start
```

### Puntos importantes

- Asegúrate de configurar las variables de entorno necesarias en el servidor de producción.
- Verifica que el build se complete con éxito antes de iniciar `next start`.
- Comprueba que el servidor tenga la versión correcta de Node.js.

### Despliegue en entornos gestionados

- Para Vercel, configura la carpeta raíz como el proyecto y define las variables de entorno.
- Para servicios personalizados, usa la salida de `pnpm build` y `pnpm start`.

---

## Pruebas y validación

### Validación manual

- Recorre las rutas clave del proyecto.
- Prueba creación, edición y eliminación de registros.
- Verifica que los permisos de usuario funcionen como se espera.

### Validación de código

- Ejecuta `pnpm lint` antes de mergear.
- Revisa los tipos de TypeScript y corrige errores de compilación.

### Extensiones futuras

- Si se añaden pruebas unitarias, usa frameworks como `vitest`, `jest` o `react-testing-library`.
- Documenta nuevos scripts de prueba en `package.json`.

---

## Consejos y buenas prácticas

### Planificación

- Define primero el alcance de la funcionalidad.
- Revisa los componentes existentes antes de crear código duplicado.

### Mantenimiento del código

- Extrae lógica repetida a hooks o servicios.
- Mantén los componentes pequeños y especializados.
- Documenta cambios importantes en los comentarios o en el PR.

### Colaboración

- Usa ramas descriptivas.
- Haz commits atómicos y claros.
- Pide revisión de código cuando modifiques partes críticas.

---

## Glosario técnico

- **Next.js**: framework React con enrutamiento y renderizado híbrido.
- **PNPM**: gestor de paquetes rápido y eficiente.
- **Supabase**: backend as a service para autenticación y base de datos.
- **Tailwind CSS**: framework de utilidades CSS.
- **ESLint**: linter para JavaScript y TypeScript.
- **TypeScript**: superset de JavaScript con tipado estático.
- **Hook**: función de React para manejar estados o efectos.
- **Componente**: bloque reutilizable de UI.

---

## Soporte para desarrolladores

- Revisa el `README.md` y el `MANUAL_DE_USUARIO.md` para entender el alcance funcional.
- Si necesitas datos de acceso o variables de entorno, consulta al equipo de infraestructura.
- Documenta cualquier cambio significativo en el repositorio para futuros desarrolladores.
