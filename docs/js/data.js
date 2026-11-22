// Datos del sitio. Para actualizar contenido basta con editar este archivo.
window.DATA = {
  // Pega aquí el ID del tema en Spotify (lo que va después de /track/ en el link) para el reproductor embebido.
  spotifyTrackId: "0VV0AMmgLBUhzuFedr3F3e",
  spotifySearch: "https://open.spotify.com/search/Dance%20No%20More%20Harry%20Styles",

  burbujas: [
    { id: "matcha", img: "burbuja_matcha", emoji: "🍵", r: 52, frase: "Mi bebida favorita: el Iced Banana Bread Matcha de FUMU." },
    { id: "makis", img: "burbuja_makis", emoji: "🍣", r: 46, frase: "Mi comida favorita son los makis." },
    { id: "cafe", img: "burbuja_cafe", emoji: "☕", r: 48, frase: "Puedo tomar café las 24 horas del día, en cualquier lugar y momento." },
    { id: "signos", emoji: "♐", r: 36, frase: "Nací un 25 de noviembre, pero no creo en los signos." },
    { id: "marvel", emoji: "🎬", r: 40, frase: "Me encanta todo el universo cinematográfico de Marvel." },
    { id: "hg", img: "burbuja_juegos_hambre", emoji: "📚", r: 44, frase: "Soy fan de la saga de Los Juegos del Hambre." },
    { id: "musica", emoji: "🎧", r: 38, frase: "Me encanta escuchar géneros musicales de todo tipo." },
    { id: "trotar", img: "uruguay_cesped", emoji: "🌅", r: 46, frase: "Mi plan favorito: trotar durante el atardecer." },
    { id: "postres", emoji: "🍰", r: 38, frase: "También me encanta preparar postres." },
    { id: "vallas", img: "tacos_salida", emoji: "🏃", r: 50, frase: "Vivo entre vallas: 400 metros y 10 obstáculos." },
    { id: "data", img: "utec_honors", emoji: "📊", r: 44, frase: "Estudio Ciencia de Datos en UTEC." },
    { id: "cumple", emoji: "🎂", r: 34, frase: "Esta semana cumplo 22 años." }
  ],

  familia: [
    { nombre: "Paola", rol: "Mamá", edad: 51, img: "cara_paola" },
    { nombre: "Dante", rol: "Papá", edad: 50, img: "cara_dante" },
    { nombre: "Paolo", rol: "Yo", edad: 21, img: "cara_paolo" },
    { nombre: "Daniela", rol: "Hermana", edad: 19, img: "cara_daniela" },
    { nombre: "Dacio", rol: "Hermano", edad: 10, img: "cara_dacio" }
  ],

  viajes: [
    { id: "lima", nombre: "Lima, Perú", coords: [-77.04, -12.05], base: true, texto: "Nací en Barranco el 25 de noviembre de 2004. Aquí empieza todo.", fotos: ["portada_montana"] },
    { id: "ny", nombre: "Nueva York, EE. UU.", coords: [-74.0, 40.71], texto: "Visité el IBM Research Center: mi primera experiencia impactante con el mundo tech. Sueño con trabajar algún día en un lugar así de importante.", fotos: ["ibm_quantum", "nueva_york", "ibm_pantalla"] },
    { id: "orlando", nombre: "Orlando, EE. UU.", coords: [-81.38, 28.54], texto: "El mismo viaje, en versión familiar y con fuegos artificiales.", fotos: ["disney", "dacio_y_yo"] },
    { id: "brasil", nombre: "Santa Catarina, Brasil", coords: [-48.64, -26.8], texto: "Un viaje familiar en el que descubrí que me encanta la playa y el açaí, e hice amigos de distintos países.", fotos: ["brasil_familia"] },
    { id: "uruguay", nombre: "Uruguay", coords: [-56.16, -34.9], texto: "Gané mi primera medalla internacional en el Grand Prix Sudamericano Estrella Puente, gracias al entrenamiento de verano en el norte del país y al apoyo de mi entrenadora Patricia Martínez Pinto.", fotos: ["uruguay_podio", "uruguay_carrera", "uruguay_cesped"] },
    { id: "arequipa", nombre: "Arequipa, Perú", coords: [-71.54, -16.4], texto: "Controles de la Federación con Jimena y Jeimy, con el Misti de fondo.", fotos: ["arequipa_misti"] },
    { id: "tumbes", nombre: "Tumbes, Perú", coords: [-80.45, -3.57], texto: "Campamento de alto rendimiento: el verano que preparó mi mejor temporada.", fotos: ["tumbes_equipo"] }
  ],

  lineaDeportiva: [
    { anio: 2013, titulo: "Empiezo a los 8 años", texto: "Pruebas combinadas en el colegio San Luis, con Julio Alberto Chauca Lino Montes, referente del atletismo de los 80 y 90 y Gerente Deportivo de la FDPA.", tipo: "club" },
    { anio: 2016, titulo: "ADECORE y JDEN", texto: "Competencias escolares organizadas por el IPD, hasta 2019. Múltiple campeón nacional escolar.", tipo: "logro" },
    { anio: 2018, titulo: "Juegos Sudamericanos Escolares", texto: "Seleccionado nacional escolar.", tipo: "seleccion" },
    { anio: 2020, titulo: "Liga de Atletismo La Victoria", texto: "Empiezo a entrenar con Patricia Martínez Pinto, mi entrenadora hasta hoy.", tipo: "club" },
    { anio: 2023, titulo: "Campeón Nacional Universitario", texto: "400 m con vallas, FEDUP.", tipo: "logro" },
    { anio: 2024, titulo: "Bicampeón universitario y UTEC Honors", texto: "Segundo título nacional universitario y reconocimiento a la excelencia extraacadémica en deporte.", tipo: "logro" },
    { anio: 2025, titulo: "Juegos Bolivarianos y tricampeonato", texto: "Represento al Perú en los XX Juegos Bolivarianos Ayacucho Lima 2025 y gano mi tercer título universitario.", tipo: "seleccion" },
    { anio: 2026, titulo: "Primera medalla internacional", texto: "Grand Prix Sudamericano en Uruguay, mejor marca de 54.70 en la VIDENA y Juegos Panamericanos Universitarios Lima 2026.", tipo: "seleccion" },
    { anio: 2027, titulo: "La meta: Lima 2027", texto: "Mi sueño más grande: los Juegos Panamericanos.", tipo: "meta" }
  ],

  // Marcas por año en 400 m con vallas (segundos). Agrega más años para activar el gráfico de progresión.
  marcas400cv: [
    { anio: 2026, marca: 54.70, lugar: "VIDENA, Lima", fecha: "28 mar 2026" }
  ],

  trayectoria: [
    { item: "UTEC, Ciencia de Datos", inicio: "2022-03", fin: "2027-12", tipo: "estudio" },
    { item: "Semana Universitaria, líder de Computación", inicio: "2023-08", fin: "2025-12", tipo: "liderazgo" },
    { item: "San Benito, base de datos", inicio: "2024-03", fin: "2024-07", tipo: "proyecto" },
    { item: "Mundial U20, Floor Manager", inicio: "2024-08", fin: "2024-09", tipo: "liderazgo" },
    { item: "Mood Coach, app con IA", inicio: "2025-04", fin: "2025-07", tipo: "proyecto" },
    { item: "International Student Network", inicio: "2025-08", fin: "2025-12", tipo: "liderazgo" },
    { item: "Hochschild Mining", inicio: "2026-04", fin: "2026-11", tipo: "trabajo" }
  ],

  skills: [
    { k: "Python", v: 92 },
    { k: "SQL y PostgreSQL", v: 90 },
    { k: "Excel", v: 95 },
    { k: "Power BI", v: 88 },
    { k: "Tableau", v: 84 },
    { k: "AWS", v: 82 },
    { k: "SAP SuccessFactors", v: 86 },
    { k: "Google Workspace", v: 93 }
  ]
};
