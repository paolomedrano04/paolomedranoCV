# Paolo Medrano Terán | El balance de la vida

CV en formato scrollytelling, en tres actos (Personal, Deportiva y Profesional), hecho con **D3.js v7** y JavaScript puro. No necesita instalación ni compilación.

## Cómo verlo

- **En línea:** activa GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). Quedará en `https://paolomedrano04.github.io/paolomedranoCV/`.
- **En local:** abre `index.html` en el navegador.

## Visualizaciones con D3

| Sección | Visualización | Técnica D3 |
|---|---|---|
| Portada y cierre | Balanza que se inclina según el acto | `transition`, `tween`, easing elástico |
| Datos curiosos | Burbujas con fotos, arrastrables | `forceSimulation`, `forceCollide`, `drag` |
| Familia | Edades con fotos (lollipop) | `scaleLinear`, `axisBottom`, transiciones escalonadas |
| Viajes | Mapa con rutas desde Lima | `geoMercator`, `geoPath`, TopoJSON, animación de trazos |
| Deportiva | Línea de tiempo 2013 a 2027 | `scalePoint`, tooltips |
| Mi prueba | Carrera de 400 m con vallas guiada por el scroll | `getPointAtLength` sobre una pista a escala real |
| Profesional | Gantt de trayectoria | `scaleTime`, `timeParse` |
| Habilidades | Radar | coordenadas polares, easing elástico |

Además, el fondo y la paleta cambian con cada acto (IntersectionObserver y variables CSS).

## Estructura

```
index.html          textos y estructura
css/styles.css      estilos y paletas por acto
js/data.js          datos editables (burbujas, familia, viajes, marcas, trayectoria, skills)
js/main.js          todas las visualizaciones
js/vendor/          d3.min.js y topojson-client.min.js
data/               mapa mundial (world-atlas 110m)
img/                fotos
fonts/              Instrument Serif, Manrope y Caveat (OFL)
```

## Para editar

- **Música:** en `js/data.js`, pega en `spotifyTrackId` el ID del tema en Spotify para el reproductor embebido.
- **Progresión de marcas:** agrega años en `marcas400cv` y se activa automáticamente el gráfico de progresión.

Mapa: [world-atlas](https://github.com/topojson/world-atlas) (ISC). Fuentes con licencia SIL Open Font License.
