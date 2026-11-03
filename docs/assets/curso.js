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

  function highlight() {
    if (!window.hljs) return;
    $$("pre.code").forEach((pre) => {
      if (pre.dataset.lang === "none") return;
      pre.innerHTML = hljs.highlight(pre.textContent, { language: pre.dataset.lang || "python" }).value;
    });
  }

  window.Curso = { h, $, $$, stepper };
  document.addEventListener("DOMContentLoaded", () => { highlight(); initDeck(); });
})();
