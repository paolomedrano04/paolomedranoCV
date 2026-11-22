/* El balance de la vida — scrollytelling con D3.js */
(() => {
  const D = window.DATA;
  const img = (n) => `img/${n}.jpg`;
  const tip = d3.select("#tooltip");
  const showTip = (ev, html) => tip.html(html).style("opacity", 1).style("left", ev.clientX + 14 + "px").style("top", ev.clientY + 14 + "px");
  const hideTip = () => tip.style("opacity", 0);
  const COLOR = { personal: "#c4683a", deporte: "#d7263d", pro: "#2bb3a3", oro: "#d4a72c" };

  /* ---------- Una sola observación por elemento: se dispara al entrar ---------- */
  function onVisible(el, fn, threshold = 0.3) {
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fn(); io.disconnect(); } }), { threshold });
    io.observe(el);
  }

  /* ---------- Balanza: Personal a la izquierda, Profesional a la derecha y el deporte como punto de apoyo ---------- */
  function balanza(svgSel, { escala = 1, etiquetas = true } = {}) {
    const svg = d3.select(svgSel);
    if (svg.empty()) return () => {};
    const W = 520, H = 380, px = W / 2, py = 120, L = 190, cuerda = 90;
    svg.attr("viewBox", `0 0 ${W} ${H}`);
    const g = svg.append("g").attr("transform", `scale(${escala})`);
    // poste y base (el deporte sostiene todo)
    g.append("path").attr("d", `M${px - 70},${H - 30} L${px + 70},${H - 30}`).attr("stroke", "currentColor").attr("stroke-width", 6).attr("stroke-linecap", "round");
    const poste = g.append("path").attr("d", `M${px - 62},${H - 34} L${px},${py + 6} L${px + 62},${H - 34} Z`).attr("fill", COLOR.deporte);
    if (etiquetas) g.append("text").attr("x", px).attr("y", H - 46).attr("text-anchor", "middle").attr("class", "lbl-bal").text("Deportiva").attr("fill", "#fff").style("font", "700 13px Manrope");
    const brazo = g.append("g").attr("transform", `translate(${px},${py})`);
    brazo.append("line").attr("x1", -L).attr("x2", L).attr("stroke", "currentColor").attr("stroke-width", 7).attr("stroke-linecap", "round");
    brazo.append("circle").attr("r", 10).attr("fill", COLOR.oro);
    const platos = [
      { x: -L, nombre: "Personal", color: COLOR.personal },
      { x: L, nombre: "Profesional", color: COLOR.pro }
    ].map((p) => {
      const pg = g.append("g");
      pg.append("line").attr("class", "cuerda").attr("x1", -34).attr("y1", cuerda).attr("x2", 0).attr("y2", 0).attr("stroke", "currentColor").attr("opacity", .5);
      pg.append("line").attr("class", "cuerda").attr("x1", 34).attr("y1", cuerda).attr("x2", 0).attr("y2", 0).attr("stroke", "currentColor").attr("opacity", .5);
      pg.append("path").attr("d", `M-58,${cuerda} Q0,${cuerda + 40} 58,${cuerda} Z`).attr("fill", p.color);
      if (etiquetas) pg.append("text").attr("y", cuerda + 54).attr("text-anchor", "middle").text(p.nombre).style("font", "700 14px Manrope").attr("fill", "currentColor");
      return { ...p, g: pg };
    });
    let ang = 0;
    function dibujar(a) {
      ang = a;
      brazo.attr("transform", `translate(${px},${py}) rotate(${a})`);
      const r = (a * Math.PI) / 180;
      platos.forEach((p) => p.g.attr("transform", `translate(${px + p.x * Math.cos(r)},${py + p.x * Math.sin(r)})`));
    }
    dibujar(0);
    return function inclinar(destino, dur = 1200, ease = d3.easeElasticOut.amplitude(1).period(.45)) {
      const i = d3.interpolateNumber(ang, destino);
      svg.transition().duration(dur).ease(ease).tween("tilt", () => (t) => dibujar(i(t)));
      poste.transition().duration(600).attr("opacity", 1);
    };
  }
  const INCL = { intro: 0, personal: -12, deporte: 0, pro: 12, final: 0 };

  const balHero = balanza("#balanza-hero");
  // la balanza duda y luego se equilibra
  setTimeout(() => balHero(-14, 900, d3.easeCubicInOut), 300);
  setTimeout(() => balHero(12, 900, d3.easeCubicInOut), 1300);
  setTimeout(() => balHero(0, 1600), 2300);

  const miniSvg = d3.select("#balanza-mini").append("svg").attr("width", "100%").attr("height", "100%").style("color", "var(--fg)");
  const balMini = balanza(miniSvg.node(), { etiquetas: false });

  const balFinal = balanza("#balanza-final");
  balFinal(-10, 10);
  onVisible(document.querySelector("#final"), () => balFinal(0, 2200), 0.4);

  /* ---------- Cambio de acto: colores y balanza mini ---------- */
  let actoActual = "intro";
  const ioActo = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const a = e.target.dataset.act;
      if (a === actoActual) return;
      actoActual = a;
      document.body.dataset.act = a;
      balMini(INCL[a]);
    });
  }, { rootMargin: "-50% 0px -50% 0px" });
  document.querySelectorAll("section.acto").forEach((s) => ioActo.observe(s));

  /* ---------- Barra de progreso ---------- */
  const barra = document.querySelector("#progreso div");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    barra.style.width = (100 * h.scrollTop) / (h.scrollHeight - h.clientHeight) + "%";
  }, { passive: true });

  /* ---------- Reveal ---------- */
  const ioRev = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); ioRev.unobserve(e.target); } }), { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => ioRev.observe(el));

  /* ---------- Música: Spotify iFrame API, arranca con la primera interacción ---------- */
  const musica = document.getElementById("musica");
  const box = document.getElementById("spotify-embed");
  musica.href = D.spotifySearch;
  if (D.spotifyTrackId) {
    let ctrl = null, sonando = false, pendiente = false;
    box.innerHTML = '<div id="spotify-player"></div>';
    box.hidden = false;
    box.classList.add("oculto");
    const arrancar = () => {
      if (sonando) return;
      if (!ctrl) { pendiente = true; return; }
      try { ctrl.play(); sonando = true; musica.classList.add("sonando"); } catch (e) {}
    };
    window.onSpotifyIframeApiReady = (API) => {
      API.createController(document.getElementById("spotify-player"),
        { uri: `spotify:track:${D.spotifyTrackId}`, width: "100%", height: 80 },
        (c) => {
          ctrl = c;
          c.addListener("playback_update", (e) => { const p = !e.data.isPaused; sonando = p; musica.classList.toggle("sonando", p); });
          c.addListener("ready", () => { if (pendiente) arrancar(); });
        });
    };
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    document.body.appendChild(s);
    // Los navegadores solo permiten audio tras una interacción: la primera la usamos para arrancar
    const primera = (e) => {
      if (e.target.closest && e.target.closest("#musica")) return;
      arrancar();
      ["pointerdown", "keydown", "touchstart"].forEach((t) => window.removeEventListener(t, primera, true));
    };
    ["pointerdown", "keydown", "touchstart"].forEach((t) => window.addEventListener(t, primera, true));
    musica.addEventListener("click", (e) => {
      e.preventDefault();
      if (!ctrl) return;
      ctrl.togglePlay();
    });
    musica.addEventListener("contextmenu", (e) => { e.preventDefault(); box.classList.toggle("oculto"); });
  }

  /* ---------- Burbujas (force layout) ---------- */
  (function burbujas() {
    const W = 560, H = 560;
    const svg = d3.select("#viz-burbujas").attr("viewBox", `0 0 ${W} ${H}`);
    const frase = d3.select("#burbuja-frase");
    const nodos = D.burbujas.map((b, i) => ({ ...b, x: W / 2 + Math.cos(i) * 120, y: H / 2 + Math.sin(i * 2) * 120 }));
    const defs = svg.append("defs");
    const g = svg.selectAll("g").data(nodos).join("g").style("cursor", "pointer");
    g.append("circle").attr("r", (d) => d.r).attr("fill", "var(--card)").attr("stroke", "var(--accent)").attr("stroke-width", 2);
    g.each(function (d) {
      const n = d3.select(this);
      if (d.img) {
        defs.append("clipPath").attr("id", `clip-${d.id}`).append("circle").attr("r", d.r - 3);
        n.append("image").attr("href", img(d.img)).attr("x", -d.r).attr("y", -d.r).attr("width", d.r * 2).attr("height", d.r * 2)
          .attr("preserveAspectRatio", "xMidYMid slice").attr("clip-path", `url(#clip-${d.id})`);
      } else {
        n.append("text").text(d.emoji).attr("text-anchor", "middle").attr("dy", ".35em").style("font-size", d.r * 0.9 + "px");
      }
    });
    const elegir = (ev, d) => {
      frase.text(d.frase);
      g.select("circle").attr("stroke-width", (o) => (o === d ? 5 : 2));
    };
    g.on("mouseenter click", elegir);
    const sim = d3.forceSimulation(nodos)
      .force("x", d3.forceX(W / 2).strength(0.05))
      .force("y", d3.forceY(H / 2).strength(0.05))
      .force("col", d3.forceCollide((d) => d.r + 5).strength(0.9))
      .alpha(0)
      .on("tick", () => g.attr("transform", (d) => `translate(${d.x},${d.y})`));
    g.attr("transform", (d) => `translate(${d.x},${d.y})`);
    g.call(d3.drag()
      .on("start", (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on("drag", (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
      .on("end", (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
    onVisible(document.querySelector("#burbujas"), () => sim.alpha(1).restart(), 0.2);
  })();

  /* ---------- Familia: edades ---------- */
  (function familia() {
    const datos = D.familia, W = 560, fila = 82, m = { t: 20, r: 40, b: 40, l: 120 };
    const H = m.t + m.b + fila * datos.length;
    const svg = d3.select("#viz-familia").attr("viewBox", `0 0 ${W} ${H}`);
    const x = d3.scaleLinear().domain([0, 55]).range([m.l, W - m.r]);
    const y = (i) => m.t + fila * i + fila / 2;
    svg.append("g").attr("class", "eje").attr("transform", `translate(0,${H - m.b + 10})`).call(d3.axisBottom(x).ticks(6).tickFormat((d) => d + " años"));
    const defs = svg.append("defs");
    const filas = svg.selectAll("g.f").data(datos).join("g").attr("class", "f");
    filas.append("text").attr("x", m.l - 16).attr("y", (d, i) => y(i) - 4).attr("text-anchor", "end").text((d) => d.nombre)
      .style("font", "400 26px 'Instrument Serif'").attr("fill", "var(--fg)");
    filas.append("text").attr("x", m.l - 16).attr("y", (d, i) => y(i) + 16).attr("text-anchor", "end").text((d) => d.rol)
      .style("font", "700 11px Manrope").style("text-transform", "uppercase").attr("fill", "var(--accent)");
    const lin = filas.append("line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", (d, i) => y(i)).attr("y2", (d, i) => y(i))
      .attr("stroke", (d) => (d.rol === "Yo" ? "var(--accent)" : "var(--muted)")).attr("stroke-width", (d) => (d.rol === "Yo" ? 5 : 3)).attr("stroke-linecap", "round");
    const cara = filas.append("g").attr("transform", (d, i) => `translate(${x(0)},${y(i)})`);
    cara.each(function (d, i) {
      defs.append("clipPath").attr("id", `cara-${i}`).append("circle").attr("r", 28);
      d3.select(this).append("circle").attr("r", 31).attr("fill", d.rol === "Yo" ? "var(--accent)" : "var(--card)");
      d3.select(this).append("image").attr("href", img(d.img)).attr("x", -28).attr("y", -28).attr("width", 56).attr("height", 56).attr("clip-path", `url(#cara-${i})`);
    });
    const num = filas.append("text").attr("x", x(0)).attr("y", (d, i) => y(i) + 5).attr("dx", 42).style("font", "700 14px Manrope").attr("fill", "var(--fg)").text("");
    onVisible(document.querySelector("#viz-familia"), () => {
      const t = d3.transition().duration(1800).ease(d3.easeCubicOut);
      lin.transition(t).delay((d, i) => i * 150).attr("x2", (d) => x(d.edad));
      cara.transition(t).delay((d, i) => i * 150).attr("transform", (d, i) => `translate(${x(d.edad)},${y(i)})`);
      num.transition(t).delay((d, i) => i * 150).attr("x", (d) => x(d.edad))
        .tween("text", function (d) { const it = d3.interpolateRound(0, d.edad); return (u) => (this.textContent = it(u)); });
    });
  })();

  /* ---------- Plot twists ---------- */
  document.querySelectorAll(".twist").forEach((b) => b.addEventListener("click", () => b.classList.toggle("volteada")));

  /* ---------- Mapa de viajes ---------- */
  (function mapa() {
    if (!window.WORLD) return;
    const W = 760, H = 640;
    const svg = d3.select("#viz-mapa").attr("viewBox", `0 0 ${W} ${H}`);
    const paises = topojson.feature(WORLD, WORLD.objects.countries);
    const proj = d3.geoMercator().fitExtent([[20, 20], [W - 20, H - 20]], { type: "MultiPoint", coordinates: [[-100, 44], [-34, -38]] });
    const path = d3.geoPath(proj);
    svg.append("g").selectAll("path").data(paises.features).join("path").attr("d", path)
      .attr("fill", (d) => (d.id === "604" ? "var(--accent)" : "var(--card)")).attr("fill-opacity", (d) => (d.id === "604" ? 0.35 : 1))
      .attr("stroke", "var(--line)").attr("stroke-width", 0.6);
    const lima = D.viajes.find((v) => v.base);
    const destinos = D.viajes.filter((v) => !v.base);
    const arcos = svg.append("g").selectAll("path").data(destinos).join("path")
      .attr("d", (d) => path({ type: "LineString", coordinates: [lima.coords, d.coords] }))
      .attr("fill", "none").attr("stroke", "var(--accent)").attr("stroke-width", 2).attr("stroke-dasharray", "4 5").attr("opacity", 0);
    const puntos = svg.append("g").selectAll("g").data(D.viajes).join("g")
      .attr("transform", (d) => `translate(${proj(d.coords)})`).style("cursor", "pointer");
    puntos.append("circle").attr("r", 0).attr("fill", (d) => (d.base ? "var(--fg)" : "var(--accent)")).attr("stroke", "var(--bg)").attr("stroke-width", 2);
    puntos.append("text").text((d) => d.nombre.split(",")[0]).attr("x", 12).attr("dy", ".35em")
      .style("font", "700 12px Manrope").attr("fill", "var(--fg)").attr("opacity", 0);
    const panel = d3.select("#mapa-panel");
    puntos.on("click", (ev, d) => {
      puntos.select("circle").attr("r", (o) => (o === d ? 11 : 7));
      panel.html(`<p class="kicker">${d.base ? "Casa" : "Destino"}</p><h3>${d.nombre}</h3><p>${d.texto}</p><div class="fotos-panel">${d.fotos.map((f) => `<img src="${img(f)}" alt="${d.nombre}">`).join("")}</div>`);
    });
    onVisible(document.querySelector("#viz-mapa"), () => {
      arcos.attr("opacity", 1).each(function () {
        const len = this.getTotalLength();
        d3.select(this).attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
          .transition().duration(1600).delay((d, i) => 300 + i * 250).attr("stroke-dashoffset", 0)
          .on("end", function () { d3.select(this).attr("stroke-dasharray", "4 5"); });
      });
      puntos.select("circle").transition().duration(600).delay((d, i) => i * 200).attr("r", 7);
      puntos.select("text").transition().duration(600).delay((d, i) => 400 + i * 200).attr("opacity", 1);
    });
  })();

  /* ---------- Línea de tiempo deportiva ---------- */
  (function lineaDeporte() {
    const datos = D.lineaDeportiva, W = 1200, H = 380, m = { l: 40, r: 40 };
    const svg = d3.select("#viz-linea-deporte").append("svg").attr("viewBox", `0 0 ${W} ${H}`);
    const x = d3.scalePoint().domain(datos.map((d) => d.anio + "-" + d.titulo)).range([m.l + 40, W - m.r - 40]);
    const cy = H / 2;
    const linea = svg.append("line").attr("x1", m.l).attr("x2", m.l).attr("y1", cy).attr("y2", cy).attr("stroke", "var(--fg)").attr("stroke-width", 3).attr("opacity", .5);
    const col = { club: COLOR.oro, logro: COLOR.deporte, seleccion: "#f8eee8", meta: COLOR.oro };
    const ev = svg.selectAll("g.ev").data(datos).join("g").attr("class", "ev").attr("opacity", 0)
      .attr("transform", (d) => `translate(${x(d.anio + "-" + d.titulo)},${cy})`);
    ev.append("line").attr("y1", 0).attr("y2", (d, i) => (i % 2 ? 60 : -60)).attr("stroke", "var(--line)");
    ev.append("circle").attr("r", (d) => (d.tipo === "meta" ? 14 : 10)).attr("fill", (d) => col[d.tipo])
      .attr("stroke", (d) => (d.tipo === "meta" ? COLOR.oro : "none")).attr("stroke-dasharray", "3 3").attr("fill-opacity", (d) => (d.tipo === "meta" ? 0.15 : 1)).attr("stroke-width", 2);
    ev.append("text").attr("y", (d, i) => (i % 2 ? 84 : -96)).attr("text-anchor", "middle").text((d) => d.anio)
      .style("font", "400 30px 'Instrument Serif'").attr("fill", (d) => col[d.tipo] === "#f8eee8" ? "var(--fg)" : col[d.tipo]);
    ev.append("foreignObject").attr("x", -66).attr("width", 132).attr("height", 80).attr("y", (d, i) => (i % 2 ? 92 : -76))
      .append("xhtml:div").style("font", "700 12.5px/1.25 Manrope").style("text-align", "center").style("color", "var(--fg)").text((d) => d.titulo);
    ev.style("cursor", "help").on("mousemove", (e, d) => showTip(e, `<strong>${d.anio}. ${d.titulo}</strong><br>${d.texto}`)).on("mouseleave", hideTip);
    onVisible(svg.node(), () => {
      linea.transition().duration(1800).attr("x2", W - m.r);
      ev.transition().duration(500).delay((d, i) => 300 + i * 180).attr("opacity", 1);
    });
  })();

  /* ---------- Carrera de 400 m con vallas (scroll) ---------- */
  (function carrera() {
    const MARCA = D.marcas400cv.reduce((a, b) => (b.marca < a.marca ? b : a)).marca;
    document.getElementById("vel").textContent = (400 / MARCA).toFixed(2).replace(".", ",");
    const svg = d3.select("#viz-carrera");
    const s = 4.4, Lr = 84.39 * s, R = 36.8 * s, cx = 450, cy = 210;
    const d = `M${cx + Lr / 2},${cy + R} A${R},${R} 0 0 0 ${cx + Lr / 2},${cy - R} L${cx - Lr / 2},${cy - R} A${R},${R} 0 0 0 ${cx - Lr / 2},${cy + R} Z`;
    svg.append("path").attr("d", d).attr("fill", "none").attr("stroke", "#7a1f2b").attr("stroke-width", 46).attr("stroke-linejoin", "round");
    svg.append("path").attr("d", d).attr("fill", "none").attr("stroke", "rgba(255,255,255,.25)").attr("stroke-width", 1).style("stroke-dasharray", "2 6");
    const pista = svg.append("path").attr("d", d).attr("fill", "none").attr("stroke", "none");
    const total = pista.node().getTotalLength();
    const en = (m) => pista.node().getPointAtLength((m / 400) * total);
    // meta
    const meta = en(0);
    svg.append("line").attr("x1", meta.x).attr("x2", meta.x).attr("y1", meta.y - 26).attr("y2", meta.y + 26).attr("stroke", "#fff").attr("stroke-width", 4);
    svg.append("text").attr("x", meta.x).attr("y", meta.y + 46).attr("text-anchor", "middle").text("salida y meta").style("font", "700 12px Manrope").attr("fill", "var(--muted)");
    // vallas
    const vallas = d3.range(10).map((k) => 45 + 35 * k);
    vallas.forEach((m, k) => {
      const p = en(m), q = en(m + 0.5);
      const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90;
      svg.append("g").attr("transform", `translate(${p.x},${p.y}) rotate(${ang})`).attr("class", "valla")
        .call((g) => { g.append("line").attr("x1", -20).attr("x2", 20).attr("stroke", "#fff").attr("stroke-width", 5); g.append("line").attr("x1", -20).attr("x2", 20).attr("stroke", COLOR.deporte).attr("stroke-width", 5).attr("stroke-dasharray", "6 6"); });
      svg.append("text").attr("x", p.x).attr("y", p.y).attr("dy", p.y > cy ? 40 : -32).attr("text-anchor", "middle").text(k + 1).style("font", "700 11px Manrope").attr("fill", "var(--muted)");
    });
    svg.append("text").attr("x", cx).attr("y", cy - 6).attr("text-anchor", "middle").text("400 m").style("font", "400 64px 'Instrument Serif'").attr("fill", "var(--fg)");
    svg.append("text").attr("x", cx).attr("y", cy + 30).attr("text-anchor", "middle").text("10 vallas de 91,4 cm").style("font", "700 13px Manrope").attr("fill", "var(--muted)");
    const estela = svg.append("path").attr("d", d).attr("fill", "none").attr("stroke", COLOR.oro).attr("stroke-width", 5).attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0 ${total}`);
    const corredor = svg.append("g");
    corredor.append("circle").attr("r", 13).attr("fill", COLOR.oro).attr("stroke", "#fff").attr("stroke-width", 3);
    corredor.append("text").text("P").attr("text-anchor", "middle").attr("dy", ".35em").style("font", "700 12px Manrope").attr("fill", "#1b0d10");
    const reloj = document.getElementById("reloj");
    const sec = document.getElementById("carrera");
    function actualizar() {
      const r = sec.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (recorrido * 0.9)));
      const m = p * 400, pt = en(m === 400 ? 399.99 : m);
      corredor.attr("transform", `translate(${pt.x},${pt.y})`);
      estela.attr("stroke-dasharray", `${p * total} ${total}`);
      reloj.textContent = (p * MARCA).toFixed(2);
      svg.selectAll(".valla").attr("opacity", (dd, i) => (vallas[i] <= m ? 0.35 : 1));
    }
    actualizar();
    window.addEventListener("scroll", () => requestAnimationFrame(actualizar), { passive: true });
  })();

  /* ---------- Progresión (solo si hay dos o más años) ---------- */
  (function progresion() {
    const datos = D.marcas400cv.slice().sort((a, b) => a.anio - b.anio);
    if (datos.length < 2) return;
    document.getElementById("progresion").hidden = false;
    const W = 1000, H = 420, m = { t: 30, r: 40, b: 40, l: 60 };
    const svg = d3.select("#viz-progresion").attr("viewBox", `0 0 ${W} ${H}`).style("width", "100%").style("max-width", "1100px").style("display", "block").style("margin", "5vh auto 0");
    const x = d3.scalePoint().domain(datos.map((d) => d.anio)).range([m.l, W - m.r]).padding(0.3);
    const y = d3.scaleLinear().domain(d3.extent(datos, (d) => d.marca)).nice().range([m.t, H - m.b]);
    svg.append("g").attr("class", "eje").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x));
    svg.append("g").attr("class", "eje").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat((v) => v.toFixed(1) + " s"));
    const linea = svg.append("path").datum(datos).attr("fill", "none").attr("stroke", COLOR.oro).attr("stroke-width", 4)
      .attr("d", d3.line().x((d) => x(d.anio)).y((d) => y(d.marca)).curve(d3.curveMonotoneX));
    svg.selectAll("circle").data(datos).join("circle").attr("cx", (d) => x(d.anio)).attr("cy", (d) => y(d.marca)).attr("r", 7).attr("fill", COLOR.deporte)
      .on("mousemove", (e, d) => showTip(e, `<strong>${d.marca.toFixed(2)} s</strong><br>${d.fecha || d.anio}${d.lugar ? ", " + d.lugar : ""}`)).on("mouseleave", hideTip);
    const len = linea.node().getTotalLength();
    linea.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len);
    onVisible(svg.node(), () => linea.transition().duration(2000).attr("stroke-dashoffset", 0));
  })();

  /* ---------- Gantt de trayectoria ---------- */
  (function gantt() {
    const datos = D.trayectoria.map((d) => ({ ...d, a: d3.timeParse("%Y-%m")(d.inicio), b: d3.timeMonth.offset(d3.timeParse("%Y-%m")(d.fin), 1) }));
    const W = 1200, fila = 46, m = { t: 30, r: 30, b: 40, l: 330 };
    const H = m.t + m.b + fila * datos.length;
    const svg = d3.select("#viz-gantt").append("svg").attr("viewBox", `0 0 ${W} ${H}`);
    const x = d3.scaleTime().domain([new Date(2022, 0, 1), new Date(2028, 0, 1)]).range([m.l, W - m.r]);
    const col = { estudio: COLOR.pro, proyecto: "#7fb3ff", liderazgo: COLOR.oro, trabajo: "#e8795a" };
    svg.append("g").attr("class", "eje").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickSize(-(H - m.t - m.b)))
      .call((g) => g.selectAll("line").attr("stroke-dasharray", "2 4"));
    const hoy = new Date(2026, 10, 21);
    svg.append("line").attr("x1", x(hoy)).attr("x2", x(hoy)).attr("y1", m.t - 10).attr("y2", H - m.b).attr("stroke", "var(--fg)").attr("stroke-width", 2);
    svg.append("text").attr("x", x(hoy)).attr("y", m.t - 14).attr("text-anchor", "middle").text("hoy").style("font", "600 22px Caveat").attr("fill", "var(--fg)");
    const filas = svg.selectAll("g.fila").data(datos).join("g").attr("transform", (d, i) => `translate(0,${m.t + i * fila})`);
    filas.append("text").attr("x", m.l - 14).attr("y", fila / 2).attr("dy", ".35em").attr("text-anchor", "end").text((d) => d.item).style("font", "500 14px Manrope").attr("fill", "var(--fg)");
    const barras = filas.append("rect").attr("x", (d) => x(d.a)).attr("y", 10).attr("height", fila - 20).attr("rx", 6).attr("width", 0)
      .attr("fill", (d) => col[d.tipo]).attr("fill-opacity", (d) => (d.fin > "2026-11" ? 0.45 : 1));
    barras.on("mousemove", (e, d) => showTip(e, `<strong>${d.item}</strong><br>${d.inicio.replace("-", "/")} a ${d.fin > "2026-11" ? "egreso en " + d.fin.slice(0, 4) : d.fin.replace("-", "/")}`)).on("mouseleave", hideTip);
    d3.select("#leyenda-gantt").selectAll("span").data(Object.entries({ estudio: "Estudios", proyecto: "Proyectos", liderazgo: "Liderazgo", trabajo: "Trabajo" })).join("span")
      .html(([k, v]) => `<i style="background:${col[k]}"></i>${v}`);
    onVisible(svg.node(), () => barras.transition().duration(1200).delay((d, i) => i * 140).attr("width", (d) => Math.max(8, x(d.b) - x(d.a))));
  })();

  /* ---------- KPI 35 % ---------- */
  onVisible(document.getElementById("kpi-35"), () => {
    d3.select("#kpi-35").transition().duration(1500).tween("t", function () { const i = d3.interpolateRound(0, 35); return (t) => (this.textContent = i(t)); });
  });

  /* ---------- Radar de habilidades ---------- */
  (function radar() {
    const datos = D.skills, W = 560, H = 560, cx = W / 2, cy = H / 2, R = 190;
    const svg = d3.select("#viz-radar").attr("viewBox", `0 0 ${W} ${H}`);
    const ang = (i) => (i / datos.length) * 2 * Math.PI - Math.PI / 2;
    const r = d3.scaleLinear().domain([0, 100]).range([0, R]);
    [20, 40, 60, 80, 100].forEach((v) => svg.append("polygon").attr("points", datos.map((d, i) => [cx + r(v) * Math.cos(ang(i)), cy + r(v) * Math.sin(ang(i))].join(",")).join(" "))
      .attr("fill", "none").attr("stroke", "var(--line)"));
    datos.forEach((d, i) => {
      svg.append("line").attr("x1", cx).attr("y1", cy).attr("x2", cx + R * Math.cos(ang(i))).attr("y2", cy + R * Math.sin(ang(i))).attr("stroke", "var(--line)");
      const lx = cx + (R + 30) * Math.cos(ang(i)), ly = cy + (R + 30) * Math.sin(ang(i));
      svg.append("text").attr("x", lx).attr("y", ly).attr("dy", ".35em").attr("text-anchor", Math.abs(Math.cos(ang(i))) < 0.2 ? "middle" : Math.cos(ang(i)) > 0 ? "start" : "end")
        .text(d.k).style("font", "700 13px Manrope").attr("fill", "var(--fg)");
    });
    const poly = svg.append("polygon").attr("fill", COLOR.pro).attr("fill-opacity", 0.3).attr("stroke", COLOR.pro).attr("stroke-width", 3)
      .attr("points", datos.map(() => `${cx},${cy}`).join(" "));
    const pts = svg.selectAll("circle.p").data(datos).join("circle").attr("class", "p").attr("cx", cx).attr("cy", cy).attr("r", 6).attr("fill", COLOR.pro).attr("stroke", "#fff").attr("stroke-width", 2)
      .on("mousemove", (e, d) => showTip(e, `<strong>${d.k}</strong>: ${d.v}`)).on("mouseleave", hideTip);
    onVisible(svg.node(), () => {
      poly.transition().duration(1500).ease(d3.easeElasticOut.period(.6)).attr("points", datos.map((d, i) => [cx + r(d.v) * Math.cos(ang(i)), cy + r(d.v) * Math.sin(ang(i))].join(",")).join(" "));
      pts.transition().duration(1500).ease(d3.easeElasticOut.period(.6)).attr("cx", (d, i) => cx + r(d.v) * Math.cos(ang(i))).attr("cy", (d, i) => cy + r(d.v) * Math.sin(ang(i)));
    });
  })();
})();
