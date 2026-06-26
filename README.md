# David Aponte — Adaptación visual premium

Proyecto estático construido con el contenido y los recursos reales suministrados en el ZIP `David_Aponte_Assets_Reales`.

## Estructura

- `index.html`: landing completa.
- `css/styles.css`: sistema visual y responsive.
- `js/main.js`: navegación, revelados, escenas de scroll, servicios y formulario.
- `assets/`: imágenes reales del sitio de David Aponte.
- `robots.txt` y `sitemap.xml`: configuración SEO básica.
- `CAMBIOS.md`: resumen del rediseño.
- `CONTENIDO_NO_UBICADO.md`: datos que no estaban disponibles en la fuente.

## Cómo abrir

Abre `index.html` en un navegador moderno. Para probar los embeds y evitar restricciones del navegador, se recomienda servir la carpeta con un servidor local:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Publicación

La estructura es compatible con GitHub Pages. Sube todos los archivos respetando las rutas.

## Formulario

El formulario abre la aplicación de correo del usuario y prepara un mensaje para `finanzaspersonales@financial-lab.com`. No requiere backend.

## Rendimiento y animación

El sitio usa scroll nativo. Las escenas principales se calculan solo cuando ocurre un evento de scroll y no mantienen bucles permanentes. Se respetan las preferencias `prefers-reduced-motion`.

## Fuente incluida

La carpeta `source/` conserva los textos extraídos, los manifiestos de assets, las URLs de origen y los IDs reales de los videos usados para comprobar la integridad del contenido.
