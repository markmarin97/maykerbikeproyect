# MaykerBike

Aplicación web de sorteo para MaykerBike creada con React, Vite, TypeScript y Tailwind CSS.

## Comandos

- `npm install` — instalar dependencias
- `npm run dev` — iniciar servidor de desarrollo
- `npm run build` — crear la versión de producción
- `npm run preview` — previsualizar la versión de producción

## Estructura principal

- `src/` — código fuente React
- `public/` — activos públicos y backend simulado
- `package.json` — scripts y dependencias
- `tsconfig.json` — configuración de TypeScript
- `vite.config.ts` — configuración de Vite

## Notas

- El proyecto usa React 19 y Vite 8.
- Asegúrate de tener Node.js instalado antes de ejecutar los comandos.

## Despliegue

### GitHub Pages

1. Instala dependencias: `npm install`
2. Genera la versión de producción: `npm run build`
3. Sube el contenido de `dist/` a la rama `gh-pages`, o usa una acción de GitHub para desplegarlo automáticamente.
4. En la configuración del repositorio, habilita GitHub Pages apuntando a la rama `gh-pages` o `main` según tu flujo.

### Netlify

1. Conecta el repositorio en Netlify.
2. Usa el comando de build `npm run build`.
3. Configura el directorio de publicación como `dist/`.
4. Despliega y Netlify actualizará tu sitio en cada push.

