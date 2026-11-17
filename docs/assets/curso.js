/* Motor de diapositivas del curso y ayudas para las visualizaciones.
   Teclas: flechas o espacio para avanzar, N notas, F pantalla completa, ? ayuda. */
(function () {
  "use strict";

  // ---------- utilidades ----------
  function h(tag, props) {
    const el = document.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
        else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
        else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, v);
      }
    }
    for (let i = 2; i < arguments.length; i++) {
      const c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach((x) => x != null && el.append(x));
      else el.append(c);
    }
    return el;
  }
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // ---------- reproductor paso a paso ----------
  // frames: arreglo de estados; render(frame, k, total) dibuja el estado k.
  function stepper(container, frames, render, opts) {
    opts = opts || {};
    let k = 0, timer = null, delay = opts.delay || 700;
    const info = h("span", { class: "step-info" });
    const bFirst = h("button", { title: "Inicio", "aria-label": "Inicio", text: "⏮" });
    const bPrev = h("button", { title: "Paso anterior", "aria-label": "Paso anterior", text: "◀" });
    const bNext = h("button", { title: "Paso siguiente", "aria-label": "Paso siguiente", text: "▶" });
    const bLast = h("button", { title: "Final", "aria-label": "Final", text: "⏭" });
    const bPlay = h("button", { class: "primary", text: "Reproducir" });
    const speed = h("select", { "aria-label": "Velocidad" },
      h("option", { value: "1200", text: "lento" }),
      h("option", { value: "700", text: "normal", selected: true }),
      h("option", { value: "300", text: "rápido" }));
    const bar = h("div", { class: "controls" }, bFirst, bPrev, bPlay, bNext, bLast, speed, info);
    container.append(bar);

    function stop() { if (timer) { clearInterval(timer); timer = null; bPlay.textContent = "Reproducir"; } }
    function go(i) {
      k = Math.max(0, Math.min(frames.length - 1, i));
      info.textContent = "paso " + (k + 1) + " / " + frames.length;
      bPrev.disabled = bFirst.disabled = k === 0;
      bNext.disabled = bLast.disabled = k === frames.length - 1;
      render(frames[k], k, frames.length);
    }
    function play() {
      if (timer) return stop();
      if (k === frames.length - 1) go(0);
      bPlay.textContent = "Pausa";
      timer = setInterval(() => { if (k >= frames.length - 1) stop(); else go(k + 1); }, delay);
    }
    bFirst.onclick = () => { stop(); go(0); };
    bPrev.onclick = () => { stop(); go(k - 1); };
    bNext.onclick = () => { stop(); go(k + 1); };
    bLast.onclick = () => { stop(); go(frames.length - 1); };
    bPlay.onclick = play;
    speed.onchange = () => { delay = +speed.value; if (timer) { stop(); play(); } };
    document.addEventListener("slidechange", stop);
    go(0);
    return {
      go, stop,
      setFrames(f) { stop(); frames = f; go(0); },
      get index() { return k; }
    };
  }

  // ---------- grafos en SVG ----------
  // G = { pos: { id: [x, y] }, edges: [[a, b, peso?], ...], dir: true si es dirigido, r: radio }
  // st = { node: { id: clase }, edge: { "a-b": clase }, sub: { id: texto debajo del nodo } }
  // Clases de nodo: sel, cur, ok, bad, dim, c1 a c4. Clases de arista: on, ok, bad, dim.
  const SVGNS = "http://www.w3.org/2000/svg";
  let flechas = 0;
  function sv(tag, attrs, text) {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k]);
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function grafo(svg, G, st) {
    st = st || {};
    const r = G.r || 22, node = st.node || {}, edge = st.edge || {}, sub = st.sub || {};
    svg.innerHTML = "";
    let marca = null;
    if (G.dir) {
      marca = "flecha-" + (++flechas);
      const m = sv("marker", { id: marca, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
      m.append(sv("path", { d: "M0,0 L10,5 L0,10 z", class: "arrow" }));
      const defs = sv("defs"); defs.append(m); svg.append(defs);
    }
    G.edges.forEach((e) => {
      const a = e[0], b = e[1], w = e[2];
      const [x1, y1] = G.pos[a], [x2, y2] = G.pos[b];
      const cls = edge[a + "-" + b] || (!G.dir && edge[b + "-" + a]) || "";
      let X2 = x2, Y2 = y2;
      if (G.dir) { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); X2 = x2 - dx / L * (r + 3); Y2 = y2 - dy / L * (r + 3); }
      svg.append(sv("line", { x1, y1, x2: X2, y2: Y2, class: "ge " + cls, "marker-end": marca ? "url(#" + marca + ")" : null }));
      if (w !== undefined) svg.append(sv("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2, class: "gw" }, w));
    });
    Object.keys(G.pos).forEach((id) => {
      const [x, y] = G.pos[id];
      const g = sv("g", { class: "gn " + (node[id] || "") });
      g.append(sv("circle", { cx: x, cy: y, r }), sv("text", { x, y }, id));
      if (sub[id] !== undefined && sub[id] !== null) g.append(sv("text", { x, y: y + r + 15, class: "gsub" }, sub[id]));
      svg.append(g);
    });
  }

  // ---------- Bloque, la mascota del curso ----------
  // Un cuadrito de la cuadrícula con ojos. Aparece en algunos tipos de diapositiva, junto
  // al elemento al que se refiere, y anima su entrada cada vez que se muestra la diapositiva.
  // Una diapositiva puede fijar el gesto con data-bloque="saludo|pensando|alerta|reto|senalar|celebra"
  // o quitarlo con data-bloque="no".
  const TINTA = "#0f1626";
  function bloqueSVG(pose) {
    let ojos = '<ellipse cx="44" cy="68" rx="10" ry="12" fill="#fff"/><ellipse cx="76" cy="68" rx="10" ry="12" fill="#fff"/>';
    let pup = { dx: 2, dy: 2, r: 5.5 };
    let boca = '<path d="M50 92 Q60 101 70 92" stroke="' + TINTA + '" stroke-width="4" stroke-linecap="round" fill="none"/>';
    let extra = "", brazo = "", cejas = "";
    const signo = (x, y, t, size, fill) => '<g class="bq-extra"><text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="700" font-size="' + size + '" fill="' + fill + '" stroke="' + TINTA + '" stroke-width="' + (fill === TINTA ? 0 : 2) + '" paint-order="stroke">' + t + "</text></g>";
    if (pose === "saludo") brazo = '<rect class="bq-brazo" x="104" y="44" width="13" height="34" rx="6.5"/>';
    if (pose === "pensando") {
      pup = { dx: 4, dy: -4, r: 5 };
      boca = '<path d="M53 94 L67 92" stroke="' + TINTA + '" stroke-width="4" stroke-linecap="round"/>';
      extra = signo(104, 22, "?", 40, TINTA);
    }
    if (pose === "alerta") {
      ojos = '<ellipse cx="44" cy="66" rx="12" ry="14" fill="#fff"/><ellipse cx="76" cy="66" rx="12" ry="14" fill="#fff"/>';
      pup = { dx: 0, dy: 0, r: 4 };
      boca = '<ellipse cx="60" cy="95" rx="6" ry="7.5" fill="' + TINTA + '"/>';
      extra = '<path class="bq-gota" d="M104 26 Q111 38 104 44 Q97 38 104 26 Z" fill="#7cc4ff" stroke="' + TINTA + '" stroke-width="2"/>';
      cejas = '<path d="M33 46 L52 50 M87 46 L68 50" stroke="' + TINTA + '" stroke-width="4" stroke-linecap="round"/>';
    }
    if (pose === "reto") {
      pup = { dx: 1, dy: 3, r: 5.5 };
      boca = '<path d="M50 94 Q62 97 71 88" stroke="' + TINTA + '" stroke-width="4" stroke-linecap="round" fill="none"/>';
      cejas = '<path d="M33 54 L54 60 M87 52 L66 56" stroke="' + TINTA + '" stroke-width="5" stroke-linecap="round"/>';
      extra = signo(106, 26, "★", 30, "#ffc21a");
    }
    if (pose === "senalar") {
      pup = { dx: -5, dy: 1, r: 5.5 };
      brazo = '<rect class="bq-brazo" x="-6" y="70" width="26" height="12" rx="6"/>';
    }
    if (pose === "celebra") {
      ojos = '<path d="M34 70 Q44 58 54 70 M66 70 Q76 58 86 70" stroke="' + TINTA + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
      pup = null;
      boca = '<path d="M46 86 Q60 104 74 86 Z" fill="' + TINTA + '"/>';
      const cols = ["#1c3fbf", "#ffc21a"];
      extra = [[-48, -40], [-30, -62], [0, -70], [30, -62], [50, -40], [62, -10]].map(([dx, dy], i) =>
        '<rect class="bq-chispa" style="--dx:' + dx + "px;--dy:" + dy + 'px" x="56" y="30" width="9" height="9" rx="2" fill="' + cols[i % 2] + '"/>').join("");
    }
    const pupilas = pup ? '<g class="bq-pupilas"><circle cx="' + (44 + pup.dx) + '" cy="' + (70 + pup.dy) + '" r="' + pup.r + '" fill="' + TINTA + '"/><circle cx="' + (76 + pup.dx) + '" cy="' + (70 + pup.dy) + '" r="' + pup.r + '" fill="' + TINTA + '"/></g>' : "";
    return '<svg viewBox="-10 0 140 132" aria-hidden="true"><ellipse class="bq-sombra" cx="60" cy="125" rx="38" ry="5"/>' +
      '<g class="bq-cuerpo"><rect class="bq-pie" x="30" y="108" width="20" height="14" rx="5"/><rect class="bq-pie" x="70" y="108" width="20" height="14" rx="5"/>' + brazo +
      '<rect class="bq-caja" x="14" y="28" width="92" height="88" rx="16"/><rect x="24" y="36" width="24" height="8" rx="4" fill="#fff" opacity=".35"/>' +
      cejas + '<g class="bq-ojos">' + ojos + pupilas + "</g>" + boca + "</g>" + extra + "</svg>";
  }

  function poseDe(sl) {
    const fija = sl.dataset.bloque;
    if (fija) return fija === "no" ? null : fija;
    if (sl.classList.contains("section")) return null;
    if (sl.classList.contains("cover")) return "saludo";
    const etiqueta = (($(".eyebrow", sl) || {}).textContent || "").trim();
    if ($(".idea-q", sl)) return "pensando";
    if ($(".tb.slow", sl)) return "alerta";
    if (/Reto\s*$/.test(etiqueta) && $(".prob-ex", sl)) return "reto";
    if (/^Soluci[oó]n/.test(etiqueta) && $("pre.code", sl)) return "senalar";
    if (/^Resumen/.test(etiqueta)) return "celebra";
    return null;
  }

  function ponerBloques() {
    $$(".slide").forEach((sl) => {
      const pose = poseDe(sl);
      if (!pose) return;
      const b = h("div", { class: "bloque " + pose, "aria-hidden": "true", html: bloqueSVG(pose) });
      if (pose === "pensando" && $(".idea-q", sl)) { b.classList.add("bq-idea"); $(".idea-q", sl).prepend(b); return; }
      if (pose === "celebra" && $("h2", sl)) { b.classList.add("bq-titulo"); $("h2", sl).append(b); return; }
      b.classList.add("bq-flota");
      sl.append(b);
      sl._bloque = { b, pose };
    });
  }

  // rectángulos de texto y de elementos visibles, en coordenadas de la diapositiva (1280 × 720)
  const TEXTOS = "h1, h2, h3, p, li, dt, dd, td, th, .caption, .idea-lab, .idea-a, .ex-lab, .course, .meta, .tv, .lab, .stat, .q";
  const CAJAS = "pre, .cells, .grid, svg, img, .tb, .controls, .bars, .box, .tl, .nl, .fw, .callstack, .pegs, .board, input, select, button";
  function ocupados(sl, ignorar) {
    const base = sl.getBoundingClientRect(), s = base.width / 1280, out = [];
    const agregar = (r) => { if (r.width > 0 && r.height > 0) out.push({ x: (r.left - base.left) / s, y: (r.top - base.top) / s, w: r.width / s, h: r.height / s }); };
    $$(TEXTOS, sl).forEach((el) => {
      if (el.closest(".bloque") || (ignorar && ignorar.contains(el))) return;
      const rg = document.createRange();
      rg.selectNodeContents(el);
      Array.from(rg.getClientRects()).forEach(agregar);
    });
    $$(CAJAS, sl).forEach((el) => {
      if (el.closest(".bloque") || el.closest(".grid-deco") || (ignorar && (ignorar === el || ignorar.contains(el)))) return;
      agregar(el.getBoundingClientRect());
    });
    return { rects: out, s, base };
  }

  function ubicarBloque(sl) {
    const info = sl._bloque;
    if (!info) return;
    const { b, pose } = info;
    // elementos junto a los que puede pararse, en orden de preferencia
    let objetivos = [];
    if (pose === "saludo") objetivos = $$(".grid-deco", sl);
    if (pose === "alerta") objetivos = $$(".tb.slow", sl).sort((p, q) => q.getBoundingClientRect().width - p.getBoundingClientRect().width);
    if (pose === "reto") objetivos = $$(".prob-ex", sl);
    if (pose === "senalar") objetivos = $$("pre.code", sl);
    const W = pose === "saludo" ? 116 : 92, H = W * 132 / 140;
    b.style.width = W + "px";
    let p = null;
    for (const t of objetivos) {
      const { rects, s, base } = ocupados(sl, t);
      const q = t.getBoundingClientRect();
      const r = { x: (q.left - base.left) / s, y: (q.top - base.top) / s, w: q.width / s, h: q.height / s };
      // de pie sobre el borde superior (a la derecha o a la izquierda), al lado derecho o al lado izquierdo
      const opciones = pose === "saludo"
        ? [[r.x - W - 18, r.y + r.h - H + 6], [r.x + r.w - W, r.y + r.h + 10]]
        : [[r.x + r.w - W - 6, r.y - H + 6], [r.x + 6, r.y - H + 6], [r.x + r.w + 10, r.y + r.h - H], [r.x - W - 10, r.y + r.h - H]];
      const libre = ([x, y]) => x >= 8 && y >= 8 && x + W <= 1272 && y + H <= 712 &&
        rects.every((o) => x + W <= o.x + 2 || x >= o.x + o.w - 2 || y + H <= o.y + 2 || y >= o.y + o.h - 2);
      p = opciones.find(libre);
      if (p) break;
    }
    if (!p) { b.style.display = "none"; return; }
    b.style.display = "";
    b.style.left = p[0] + "px";
    b.style.top = p[1] + "px";
  }

  // ---------- motor del mazo ----------
  function initDeck() {
    const slides = $$(".slide");
    if (!slides.length) return;
    let cur = 0;

    const hud = h("div", { class: "hud" }, h("div", { class: "prog" }));
    const pageLabel = h("span");
    const pager = h("div", { class: "pager" },
      h("button", { "aria-label": "Anterior", text: "←", onclick: () => prev() }),
      pageLabel,
      h("button", { "aria-label": "Siguiente", text: "→", onclick: () => next() }),
      h("button", { title: "Notas del docente (N)", text: "notas", onclick: () => toggleNotes() }),
      h("button", { title: "Pantalla completa (F)", text: "pantalla completa", onclick: () => toggleFullscreen() }),
      h("button", { title: "Ayuda (?)", text: "?", onclick: () => help.classList.toggle("open") }));
    const notes = h("div", { class: "notes-panel", "aria-live": "polite" });
    const help = h("div", { class: "help-panel" },
      h("table", null,
        [["→ / espacio / clic en ⟶", "avanzar"], ["←", "retroceder"], ["Inicio / Fin", "primera / última"],
         ["N", "mostrar u ocultar notas"], ["F", "pantalla completa"], ["P", "modo presentación sin pantalla completa"], ["Esc", "cerrar notas y ayuda"], ["?", "esta ayuda"]]
          .map(([a, b]) => h("tr", null, h("td", null, h("kbd", { text: a })), h("td", { text: b })))));
    document.body.append(hud, pager, notes, help);

    function fit() {
      // en modo presentación la diapositiva ocupa toda la pantalla, sin márgenes
      const s = document.body.classList.contains("presenting")
        ? Math.min(window.innerWidth / 1280, window.innerHeight / 720)
        : Math.min(window.innerWidth / 1280, (window.innerHeight - 28) / 720) * 0.98;
      slides.forEach((sl) => (sl.style.transform = "scale(" + s + ")"));
    }
    function frags(sl) { return $$(".frag", sl); }
    function show(i, allFrags) {
      cur = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach((s, j) => s.classList.toggle("active", j === cur));
      frags(slides[cur]).forEach((f) => f.classList.toggle("shown", !!allFrags));
      $(".prog", hud).style.width = ((cur + 1) / slides.length) * 100 + "%";
      pageLabel.textContent = cur + 1 + " / " + slides.length;
      const n = $("aside.notes", slides[cur]);
      notes.innerHTML = "<h4>Notas del docente · diapositiva " + (cur + 1) + "</h4>" + (n ? n.innerHTML : "<p>Sin notas.</p>");
      if (location.hash !== "#" + (cur + 1)) history.replaceState(null, "", "#" + (cur + 1));
      fitProblem(slides[cur]);
      document.dispatchEvent(new CustomEvent("slidechange", { detail: { index: cur, slide: slides[cur] } }));
    }
    // un enunciado largo reduce su letra hasta caber en la diapositiva
    function fitProblem(sl) {
      const pr = $(".prob", sl);
      if (!pr) return;
      let k = 1;
      pr.style.setProperty("--k", k);
      while (k > 0.6 && pr.scrollHeight > pr.clientHeight + 1) { k -= 0.03; pr.style.setProperty("--k", k); }
    }
    if (document.fonts) document.fonts.ready.then(() => fitProblem(slides[cur]));
    function next() {
      const hidden = frags(slides[cur]).filter((f) => !f.classList.contains("shown"));
      if (hidden.length) hidden[0].classList.add("shown");
      else if (cur < slides.length - 1) show(cur + 1, false);
    }
    function prev() {
      const shown = frags(slides[cur]).filter((f) => f.classList.contains("shown"));
      if (shown.length) shown[shown.length - 1].classList.remove("shown");
      else if (cur > 0) show(cur - 1, true);
    }
    function toggleNotes() { notes.classList.toggle("open"); }
    function setPresenting(on) { document.body.classList.toggle("presenting", on); fit(); }
    function toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => setPresenting(true));
      else setPresenting(!document.body.classList.contains("presenting"));
    }
    document.addEventListener("fullscreenchange", () => setPresenting(!!document.fullscreenElement));
    document.addEventListener("keydown", (e) => {
      const t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || (k === " " && tag !== "BUTTON")) { e.preventDefault(); next(); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
      else if (k === "Home") show(0, false);
      else if (k === "End") show(slides.length - 1, true);
      else if (k === "n" || k === "N") toggleNotes();
      else if (k === "?") help.classList.toggle("open");
      else if (k === "f" || k === "F") toggleFullscreen();
      else if (k === "p" || k === "P") setPresenting(!document.body.classList.contains("presenting"));
      else if (k === "Escape") { notes.classList.remove("open"); help.classList.remove("open"); }
    });
    window.addEventListener("resize", fit);
    window.addEventListener("hashchange", () => {
      const i = parseInt(location.hash.slice(1), 10) - 1;
      if (!isNaN(i) && i !== cur) show(i, false);
    });
    fit();
    const start = parseInt(location.hash.slice(1), 10) - 1;
    show(isNaN(start) ? 0 : start, false);
  }

  // Una clase que no está habilitada en config.js muestra un aviso en lugar de las
  // diapositivas. Con ?docente en la dirección se muestra igual.
  function bloqueada() {
    const curso = window.CURSO;
    if (!curso || new URLSearchParams(location.search).has("docente")) return false;
    const ruta = decodeURIComponent(location.pathname);
    for (const m of curso.modulos)
      for (const c of m.clases)
        if (c.url && ruta.endsWith(c.url)) return !c.disponible;
    return false;
  }
  function mostrarAviso() {
    document.body.innerHTML = "";
    document.body.append(h("div", { class: "aviso" },
      h("div", { class: "eyebrow", text: "Algoritmia y Estructuras de Datos Avanzadas" }),
      h("h1", { text: "Esta clase todavía no está disponible." }),
      h("p", { text: "Se habilita cuando llegue su semana." }),
      h("a", { href: "../index.html", text: "Volver al índice" })));
  }

  function highlight() {
    if (!window.hljs) return;
    $$("pre.code").forEach((pre) => {
      if (pre.dataset.lang === "none") return;
      pre.innerHTML = hljs.highlight(pre.textContent, { language: pre.dataset.lang || "python" }).value;
    });
  }

  window.Curso = { h, $, $$, stepper, grafo };
  document.addEventListener("DOMContentLoaded", () => {
    if (bloqueada()) return mostrarAviso();
    highlight();
    ponerBloques();
    document.addEventListener("slidechange", (e) => ubicarBloque(e.detail.slide));
    if (document.fonts) document.fonts.ready.then(() => { const a = $(".slide.active"); if (a) ubicarBloque(a); });
    initDeck();
  });
})();
