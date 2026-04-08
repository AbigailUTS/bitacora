# Bitácora Web

## Descripción del proyecto

Bitácora Web es una aplicación administrativa de reportes y gestión de datos construida con Next.js. Permite crear, visualizar y administrar información relacionada con clasificaciones, dependencias, ubicaciones y reportes. La interfaz está organizada en módulos para facilitar la administración de registros, generar reportes y revisar el historial.

### Qué hace la aplicación

- Gestiona clasificaciones y áreas administrativas.
- Administra dependencias y ubicaciones relacionadas.
- Crea reportes con estado y datos asociados.
- Visualiza reportes en paneles y genera gráficos o historial.
- Incluye controles de acceso para usuarios administrativos.

## Cómo ejecutar el proyecto por primera vez

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Entra en la carpeta del proyecto:

```bash
cd bitacora
```

3. Instala las dependencias con pnpm:

```bash
pnpm install
```

4. Inicia el servidor de desarrollo:

```bash
pnpm dev
```

5. Abre el navegador en:

```text
http://localhost:3000
```

6. Si deseas usar otro gestor de paquetes, puedes ejecutar también:

```bash
npm install
npm run dev
```

## Uso de las secciones de la aplicación

La aplicación está dividida en áreas funcionales que se acceden desde el menú principal.

- **Dashboard**: Vista principal con resumen de la información y acceso a los paneles principales.
- **Clasificaciones**: Permite ver, crear y editar categorías o etiquetas usadas en el sistema.
- **Dependencias**: Gestiona las dependencias institucionales o áreas relacionadas al reporte.
- **Ubicaciones**: Administra lugares o ubicaciones físicas asociadas a los reportes.
- **Reportes**: Permite generar y consultar reportes, así como revisar el estado actual de cada uno.
- **Historial de reportes**: Muestra un registro de reportes anteriores para seguimiento y auditoría.
- **Panel de gráficos**: Visualiza datos relevantes en forma de gráficos y métricas.

### Flujo recomendado

1. Registra las clasificaciones y dependencias necesarias.
2. Agrega ubicaciones vinculadas a cada dependencia.
3. Genera reportes y asignales la clasificación adecuada.
4. Revisa el historial para validar el seguimiento.
5. Usa los paneles de gráficos para obtener indicadores rápidos.

## Estructura básica del proyecto

- `app/`: Contiene las páginas principales de Next.js.
- `components/`: Componentes reutilizables de interfaz y paneles.
- `lib/`: Servicios y conexión a datos, como Supabase.
- `public/`: Recursos estáticos como imágenes.
- `styles/`: Archivos de estilos globales y configuraciones.

## Requisitos del sistema

### Requisitos mínimos

- Sistema operativo: Windows 10 o superior.
- Editor recomendado: Visual Studio Code.
- Node.js: versión 18.x o 20.x.
- Gestor de paquetes: pnpm (recomendado), npm o yarn.
- Memoria RAM: 8 GB.
- Espacio en disco: 2 GB libre.
- Navegador moderno: Microsoft Edge, Chrome o Firefox.

### Requisitos recomendados

- Sistema operativo: Windows 11.
- Editor: Visual Studio Code con extensiones para TypeScript, ESLint y Prettier.
- Node.js: versión 20.x.
- Gestor de paquetes: pnpm.
- Memoria RAM: 8 GB o más.
- Espacio en disco: 5 GB libre.
- Conexión estable a internet para instalar dependencias y servicios externos.

---

## Notas adicionales

- Asegúrate de tener `pnpm` instalado globalmente si deseas usarlo:

```bash
npm install -g pnpm
```

- Software recomendado para una computadora nueva:
  - Git: https://git-scm.com/
  - Visual Studio Code: https://code.visualstudio.com/
  - Node.js: https://nodejs.org/
  - pnpm: https://pnpm.io/
  - Navegador moderno: https://www.microsoft.com/edge, https://www.google.com/chrome, https://www.mozilla.org/firefox/
  - Extensiones útiles: ESLint, Prettier y TypeScript para VS Code.

- Si la aplicación usa un servicio de base de datos como Supabase, revisa los archivos de configuración y variables de entorno.

- Para producción, consulta la documentación de Next.js sobre el despliegue:
  - https://nextjs.org/docs/deployment

- Para solicitar el archivo o informacion de .env.local ponerse en contacto con los desarrolladores.