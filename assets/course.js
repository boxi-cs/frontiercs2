// FrontierCS 2 course details and the footer. Loaded before app.js on every page.

const AUTHOR_LINK = `<a class="author-link" href="https://boxiyu.github.io/" target="_blank" rel="noopener">Boxi Yu</a>`;

const COURSE = {
  code: "FCS2",
  name: "FrontierCS 2",
  short: "FrontierCS 2 · Course",
  byline: `Designed by ${AUTHOR_LINK}`,
  checked: "Every program here has been run, and every output shown is the real output",
  practice: "run the programs yourself with plain Python 3",
  // Course order for previous / next links.
  lectures: [[0, "Introduction"], [1, "MLSys"], [2, "HPC"], [3, "Architecture"], [4, "Network"], [5, "Theory"],
    [6, "Bioinformatics"], [7, "Machine Learning"], [8, "Database"], [9, "Programming Languages"],
    [10, "Software Engineering"], [11, "Cryptography"], [12, "Security"], [13, "Robotics"]],
};

function renderFooter(root = "") {
  const f = document.querySelector("footer");
  if (!f) return;
  const allLink = root ? ` · <a href="${root}index.html">All 14 lectures</a>` : "";
  f.innerHTML = `<div class="wrap" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px 24px">
    <p><b>FrontierCS 2 · Course</b> · Designed by ${AUTHOR_LINK} · <a href="${root}about/index.html">About</a>${allLink}</p>
    <p>Tasks, results and case studies from the <a href="https://frontier-cs.org/" target="_blank" rel="noopener">FrontierCS 2 benchmark ↗</a> · Results as of October 26, 2026.</p>
  </div>`;
}

// Field colours (as on the task map at frontier-cs.org) and one line drawing per field, in white on
// the field colour. Used by the home page tiles, each lecture's cover and the chapter labels.
// The drawings are our own: each shows the idea of one task in the field.
const FIELD_COLOR = {
  0: "#0b57d0", 1: "#1a73e8", 2: "#1a73e8", 3: "#1a73e8", 4: "#1a73e8", 5: "#1a73e8", 6: "#1a73e8",
  7: "#188038", 8: "#e8710a", 9: "#9334e6", 10: "#5f6368", 11: "#d93025", 12: "#d93025", 13: "#5f6368",
};

function fieldArt(n) {
  // Drawn on a 360 × 180 canvas, cropped to fill whatever box holds it.
  let r = (n + 1) * 7919;
  const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
  const f = (v) => +v.toFixed(1);
  const S = "stroke=\"#fff\" fill=\"none\"";
  const draw = (dash) => (dash ? ` stroke-dasharray="${dash}"` : "");
  const line = (x1, y1, x2, y2, o = 0.55, w = 1.4, dash = "") =>
    `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${S} stroke-width="${w}" opacity="${o}"${draw(dash)}/>`;
  let dots = 0;
  const dot = (x, y, rad = 3.2, o = 1) => `<circle cx="${f(x)}" cy="${f(y)}" r="${rad}" fill="#fff" opacity="${o}"${dots++ % 5 === 2 ? ` class="tw" style="--k:${dots % 7}"` : ""}/>`;
  // Dots of light that travel along a path: [path, seconds per trip, how many].
  const flows = [];
  const flow = (d, dur = 2.4, count = 2) => flows.push([d, dur, count]);
  const ring = (x, y, rad = 4, o = 0.9, w = 1.4) => `<circle cx="${f(x)}" cy="${f(y)}" r="${rad}" ${S} stroke-width="${w}" opacity="${o}"/>`;
  const box = (x, y, w, h, fo = 0.16, so = 0, rx = 2, dash = "") =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="#fff" fill-opacity="${fo}"${so ? ` stroke="#fff" stroke-opacity="${so}" stroke-width="1.3"` : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const path = (d, o = 0.85, w = 1.6, dash = "") => `<path d="${d}" ${S} stroke-width="${w}" opacity="${o}" stroke-linecap="round" stroke-linejoin="round"${draw(dash)}/>`;
  const wave = (y0, amp, freq, phase, x0 = 0, x1 = 360) => {
    let d = "";
    for (let x = x0; x <= x1; x += 4) d += `${d ? "L" : "M"}${x} ${f(y0 + amp * Math.sin(x * freq + phase))}`;
    return d;
  };
  let g = "";
  switch (n) {
    case 0: { // A paper's code with its key part cut out, and the agent's version going back in.
      g += box(118, 18, 124, 150, 0.12, 0.5, 6);
      [[0, 70], [0, 92], [12, 60], [12, 84], [0, 40]].forEach(([dx, w], k) => { g += box(132 + dx, 32 + k * 11, w, 5, 0.55, 0, 2); });
      g += box(132, 92, 96, 34, 0.04, 0.95, 4, "5 4");
      [[0, 66], [12, 88], [0, 52]].forEach(([dx, w], k) => { g += box(132 + dx, 136 + k * 9, w, 5, 0.55, 0, 2); });
      g += box(268, 96, 70, 26, 0.85, 0, 4);
      [0, 1, 2].forEach((k) => { g += box(275, 102 + k * 6, 36 + 10 * (k % 2), 3, 0.5, 0, 1).replace('fill="#fff"', 'fill="#0b57d0"'); });
      g += path("M266 109 C252 109 246 109 234 109", 0.95, 1.8) + path("M240 104 L233 109 L240 114", 0.95, 1.8);
      flow("M268 109 L234 109", 1.4, 2); flow("M30 33 L30 150", 3.2, 1);
      for (let k = 0; k < 7; k++) g += box(22 + (k % 2) * 10, 30 + k * 18, 60 - (k % 3) * 12, 6, 0.22, 0, 2);
      break;
    }
    case 1: { // MLSys: a sparse attention matrix, and clusters of points (the FlashLib tasks).
      const N = 13, c = 9.5, x0 = 132, y0 = 22;
      for (let i = 0; i < N; i++) for (let j = 0; j <= i; j++) {
        const keep = j === 0 || i - j < 3 || (j % 4 === 0 && rand() < 0.8);
        g += box(x0 + j * c, y0 + i * c, c - 1.6, c - 1.6, keep ? (i === j ? 0.95 : 0.55) : 0.1, 0, 1);
      }
      [[52, 56], [78, 128], [34, 140]].forEach(([cx, cy]) => {
        g += ring(cx, cy, 26, 0.4, 1.2) + dot(cx, cy, 4.2);
        for (let k = 0; k < 12; k++) { const a = rand() * 6.283, d = 6 + rand() * 15; g += dot(cx + d * Math.cos(a), cy + d * Math.sin(a), 2.6, 0.85); }
      });
      g += path("M270 150 C300 148 318 120 340 40", 0.95, 2) + dot(340, 40, 3.6);
      flow("M270 150 C300 148 318 120 340 40", 2.2, 2); flow("M137 27 L251 141", 3, 2);
      [282, 300, 318, 336].forEach((x) => { g += line(x, 152, x, 156, 0.6); });
      break;
    }
    case 2: { // HPC: a butterfly network over eight lanes.
      const cols = [36, 108, 180, 252, 324], ys = Array.from({ length: 8 }, (_, k) => 20 + k * 20);
      [4, 2, 1, 0].forEach((s, c) => ys.forEach((y, k) => {
        g += line(cols[c], y, cols[c + 1], y, 0.45);
        if (s) { const p = k ^ s; g += line(cols[c], y, cols[c + 1], ys[p], 0.75); }
      }));
      cols.forEach((x, c) => ys.forEach((y) => { g += c === 4 ? box(x - 5, y - 5, 10, 10, 0.95, 0, 2) : dot(x, y, 3.6); }));
      flow("M36 20 L108 100 L180 140 L252 160 L324 160", 2.6, 2); flow("M36 80 L108 160 L180 120 L252 100 L324 100", 2.6, 2); flow("M36 140 L108 60 L180 20 L252 40 L324 40", 2.6, 1);
      break;
    }
    case 3: { // Architecture: a chip with pins and traces out to the board.
      const cx = 180, cy = 90;
      g += box(cx - 42, cy - 42, 84, 84, 0.18, 0.9, 6);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g += box(cx - 30 + i * 15, cy - 30 + j * 15, 11, 11, (i + j) % 3 ? 0.35 : 0.85, 0, 1.5);
      for (let k = 0; k < 6; k++) {
        const o = -30 + k * 12;
        const ex = [30 + 10 * (k % 3), 330 - 12 * (k % 3)];
        g += path(`M${cx - 42} ${cy + o} H${cx - 70 - k * 6} V${cy + o + (k < 3 ? -24 : 24)} H${ex[0]}`, 0.6, 1.3) + ring(ex[0], cy + o + (k < 3 ? -24 : 24), 3);
        g += path(`M${cx + 42} ${cy + o} H${cx + 64 + k * 5} V${cy + o + (k < 3 ? -30 : 30)} H${ex[1]}`, 0.6, 1.3) + ring(ex[1], cy + o + (k < 3 ? -30 : 30), 3);
        g += line(cx + o, cy - 42, cx + o, cy - 54, 0.7) + line(cx + o, cy + 42, cx + o, cy + 54, 0.7);
      }
      flow("M138 60 H110 V36 H30", 2, 2); flow("M222 120 H269 V150 H306", 2, 2); flow("M138 102 H88 V126 H50", 2.4, 1);
      break;
    }
    case 4: { // Network: packets into a two-level bitmap queue, and a small routed topology.
      const top = [1, 0, 1, 0], bits = [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
      top.forEach((b, k) => { g += box(150 + k * 18, 34, 14, 14, b ? 0.95 : 0.2, 0.6, 2); });
      bits.forEach((b, k) => {
        const x = 110 + k * 12 + Math.floor(k / 4) * 8;
        g += box(x, 104, 10, 14, b ? 0.95 : 0.2, 0.5, 1.5);
        if (k % 4 === 1) g += line(157 + Math.floor(k / 4) * 18, 48, x + 5 + 6, 104, 0.5);
      });
      for (let k = 0; k < 5; k++) g += box(14 + k * 18, 140, 12, 8, 0.4 + 0.12 * k, 0, 1.5);
      g += path("M106 144 C130 144 140 132 140 124", 0.6, 1.3, "3 3");
      const P = [[268, 30], [330, 52], [300, 100], [250, 82], [338, 144], [270, 150]];
      [[0, 1], [0, 3], [1, 2], [3, 2], [2, 4], [2, 5], [3, 5], [1, 4]].forEach(([a, b], k) => { g += line(...P[a], ...P[b], k === 2 || k === 4 ? 0.95 : 0.4, k === 2 || k === 4 ? 2.2 : 1.3); });
      P.forEach(([x, y]) => { g += dot(x, y, 4.2); });
      flow("M10 144 L106 144 C130 144 140 132 140 124", 2.2, 3); flow("M330 52 L300 100 L338 144", 1.8, 2);
      break;
    }
    case 5: { // Theory: a filter's bit array, with three hashed slots per key.
      const cells = 22, c = 14, x0 = 26, y0 = 118, on = new Set();
      [[70, 3, 9, 14], [180, 6, 11, 17], [290, 10, 15, 20]].forEach(([kx, ...slots]) => {
        g += dot(kx, 38, 5) + ring(kx, 38, 10, 0.4);
        slots.forEach((s) => { on.add(s); g += path(`M${kx} 46 C${kx} 86 ${x0 + s * c + 6} 80 ${x0 + s * c + 6} ${y0 - 2}`, 0.65, 1.3); });
      });
      for (let k = 0; k < cells; k++) g += box(x0 + k * c, y0, c - 3, 22, on.has(k) ? 0.9 : 0.18, 0.4, 2);
      for (let k = 0; k < 3; k++) g += line(x0 + k * 7 * c + 3 * c, 152, x0 + (k * 7 + 7) * c - 3, 152, 0.5);
      flow("M180 46 C180 86 186 80 186 116", 1.6, 1); flow("M70 46 C70 86 74 80 74 116", 1.9, 1); flow("M290 46 C290 86 312 80 312 116", 1.7, 1);
      break;
    }
    case 6: { // Bioinformatics: a double helix over an alignment path.
      for (let x = 8; x <= 352; x += 12) {
        const a = 60 + 26 * Math.sin(x * 0.035), b = 60 - 26 * Math.sin(x * 0.035);
        g += line(x, a, x, b, 0.35, 1.6);
      }
      g += path(wave(60, 26, 0.035, 0), 0.95, 2.2) + path(wave(60, -26, 0.035, 0), 0.6, 2.2);
      let x = 40, y = 112, d = `M${x} ${y}`;
      for (let k = 0; k < 18; k++) { const m = rand(); if (m < 0.6) { x += 15; y += 2.5; } else if (m < 0.85) x += 15; else y += 5; d += ` L${x} ${f(y)}`; g += dot(x, y, 2.4, 0.9); }
      for (let i = 0; i < 6; i++) g += line(40, 112 + i * 10, 320, 112 + i * 10, 0.14, 1);
      for (let i = 0; i < 19; i++) g += line(40 + i * 15, 108, 40 + i * 15, 166, 0.1, 1);
      g += path(d, 0.9, 1.8);
      flow(d, 3.4, 2); flow("M0 60 L360 60", 6, 1);
      break;
    }
    case 7: { // Machine learning: a small network and a falling loss curve.
      const layers = [3, 5, 5, 2], xs = [40, 110, 180, 250];
      const at = (l, k) => [xs[l], 90 + (k - (layers[l] - 1) / 2) * 30];
      layers.slice(0, -1).forEach((m, l) => { for (let a = 0; a < m; a++) for (let b = 0; b < layers[l + 1]; b++) g += line(...at(l, a), ...at(l + 1, b), 0.22 + 0.3 * rand(), 1.1); });
      layers.forEach((m, l) => { for (let a = 0; a < m; a++) g += l === 3 ? box(at(l, a)[0] - 6, at(l, a)[1] - 6, 12, 12, 0.95, 0, 3) : dot(...at(l, a), 5); });
      g += line(282, 40, 282, 150, 0.4) + line(282, 150, 350, 150, 0.4);
      g += path("M286 48 C298 110 312 128 348 136", 0.95, 2);
      flow("M40 60 L110 90 L180 120 L250 105", 2.2, 2); flow("M40 120 L110 60 L180 60 L250 75", 2.2, 2); flow("M286 48 C298 110 312 128 348 136", 2.6, 1);
      break;
    }
    case 8: { // Database: a search tree over linked leaves, and a joined pair of tables.
      g += box(150, 18, 60, 18, 0.9, 0, 3);
      const kids = [96, 166, 236];
      kids.forEach((x) => { g += line(180, 36, x + 22, 64, 0.6) + box(x, 64, 44, 16, 0.5, 0, 3); });
      const leaves = [64, 112, 160, 208, 256, 304];
      leaves.forEach((x, k) => {
        g += line(kids[Math.floor(k / 2)] + 22, 80, x + 16, 112, 0.45) + box(x, 112, 32, 14, 0.25, 0.7, 2);
        if (k < 5) g += line(x + 32, 119, x + 48, 119, 0.8);
      });
      for (let k = 0; k < 3; k++) { g += box(20, 140 + k * 10, 70, 7, k ? 0.2 : 0.6, 0, 1.5); g += box(270, 140 + k * 10, 70, 7, k ? 0.2 : 0.6, 0, 1.5); }
      g += path("M92 154 C150 170 210 170 268 154", 0.8, 1.5, "4 3");
      flow("M180 36 L188 64 L176 112", 1.6, 1); flow("M180 36 L118 64 L80 112", 1.9, 1); flow("M92 154 C150 170 210 170 268 154", 2.4, 2);
      break;
    }
    case 9: { // Programming languages: an e-graph, equal terms grouped in dashed classes.
      const cls = [[60, 50, 70, 54], [170, 30, 80, 54], [270, 64, 66, 54], [120, 114, 80, 50], [240, 132, 70, 40]];
      cls.forEach(([x, y, w, h]) => { g += box(x - w / 2, y - h / 2, w, h, 0.08, 0.75, 12, "5 4"); });
      const nodes = [[48, 50], [74, 50], [158, 30], [184, 30], [270, 64], [108, 114], [134, 114], [240, 132]];
      [[0, 2], [1, 4], [2, 5], [3, 6], [4, 7], [6, 7], [3, 4]].forEach(([a, b]) => { g += line(...nodes[a], ...nodes[b], 0.55, 1.3); });
      nodes.forEach(([x, y], k) => { g += k % 3 ? ring(x, y, 7, 0.95, 1.6) : dot(x, y, 7); });
      flow("M184 30 L134 114 L240 132", 2.4, 2); flow("M74 50 L270 64 L240 132", 2.6, 1);
      break;
    }
    case 10: { // Software engineering: an edited file, one line replaced, with a test run.
      g += box(64, 16, 232, 150, 0.1, 0.45, 6);
      const ind = [0, 1, 2, 2, 1, 2, 3, 3, 2, 1, 0], w = [90, 120, 70, 110, 60, 130, 80, 50, 100, 70, 40];
      ind.forEach((i, k) => {
        const y = 28 + k * 12;
        if (k === 5) g += box(66, y - 3, 228, 11, 0.28, 0, 0);
        if (k === 6) g += box(66, y - 3, 228, 11, 0.12, 0, 0);
        g += dot(78, y + 2.5, 1.4, 0.5) + box(92 + i * 14, y, w[k], 5, k === 5 ? 0.95 : 0.5, 0, 2);
      });
      [0, 1, 2, 3, 4].forEach((k) => { g += k === 3 ? ring(322, 40 + k * 22, 6, 0.95) : dot(322, 40 + k * 22, 6); });
      g += line(322, 46, 322, 122, 0.35);
      for (let k = 0; k < 4; k++) g += box(14, 40 + k * 22, 32, 6, 0.25, 0, 2);
      flow("M322 40 L322 128", 2.6, 1); flow("M92 88 L320 88", 2.8, 1);
      break;
    }
    case 11: { // Cryptography: a skewed lattice with its basis, and a noisy wave.
      const b1 = [34, 8], b2 = [12, 30];
      for (let i = -4; i <= 8; i++) for (let j = -2; j <= 5; j++) {
        const x = 40 + i * b1[0] + j * b2[0], y = 30 + i * b1[1] + j * b2[1];
        if (x > 6 && x < 354 && y > 6 && y < 174) g += dot(x, y, i === 3 && j === 2 ? 4.5 : 2.4, i === 3 && j === 2 ? 1 : 0.65);
      }
      const ox = 40 + 3 * b1[0] + 2 * b2[0], oy = 30 + 3 * b1[1] + 2 * b2[1];
      g += path(`M${ox} ${oy} L${ox + b1[0]} ${oy + b1[1]}`, 1, 2.2) + path(`M${ox} ${oy} L${ox + b2[0]} ${oy + b2[1]}`, 1, 2.2);
      g += ring(ox + 9, oy - 7, 13, 0.6, 1.2);
      let d = "";
      for (let x = 0; x <= 360; x += 3) d += `${d ? "L" : "M"}${x} ${f(150 + 10 * Math.sin(x * 0.05) + (rand() - 0.5) * 7)}`;
      g += path(d, 0.85, 1.4);
      flow(d, 4, 2);
      break;
    }
    case 12: { // Security: a shield between an agent's tools, one call blocked.
      g += path("M180 28 L222 44 C222 98 206 128 180 146 C154 128 138 98 138 44 Z", 0.95, 2.2) + `<path d="M180 40 L210 52 C210 94 199 118 180 132 C161 118 150 94 150 52 Z" fill="#fff" fill-opacity="0.16"/>`;
      g += ring(180, 80, 9, 0.95, 2) + box(176, 86, 8, 18, 0.95, 0, 2);
      const L = [[40, 44], [70, 104], [36, 150]], R = [[318, 40], [292, 96], [330, 146]];
      L.forEach(([x, y]) => { g += dot(x, y, 5.5) + line(x + 7, y, 132, 86, 0.45, 1.3, "3 3"); });
      R.forEach(([x, y], k) => {
        g += (k === 1 ? ring(x, y, 6.5, 0.95, 1.8) : dot(x, y, 5.5)) + line(228, 86, x - 7, y, k === 1 ? 0.95 : 0.45, k === 1 ? 1.8 : 1.3, k === 1 ? "" : "3 3");
      });
      g += line(254, 84, 266, 100, 1, 2.2) + line(266, 84, 254, 100, 1, 2.2);
      flow("M47 44 L132 86", 1.6, 1); flow("M43 150 L132 86", 1.9, 1); flow("M77 104 L132 86", 1.4, 1); flow("M228 86 L254 92", 1.1, 1);
      break;
    }
    case 13: { // Robotics: an arm, its earlier poses, and the path of its hand.
      const pose = (a1, a2, a3) => {
        const p0 = [110, 160], p1 = [p0[0] + 60 * Math.cos(a1), p0[1] - 60 * Math.sin(a1)];
        const p2 = [p1[0] + 52 * Math.cos(a2), p1[1] - 52 * Math.sin(a2)], p3 = [p2[0] + 26 * Math.cos(a3), p2[1] - 26 * Math.sin(a3)];
        return [p0, p1, p2, p3];
      };
      [[1.9, 0.9, 0.2, 0.28], [1.6, 0.5, -0.3, 0.45], [1.3, 0.1, -0.7, 1]].forEach(([a, b, c, o]) => {
        const P = pose(a, b, c);
        g += path(`M${P.map((p) => p.map(f).join(" ")).join(" L")}`, o, o === 1 ? 3 : 2);
        P.slice(0, 3).forEach(([x, y]) => { g += o === 1 ? dot(x, y, 5) : ring(x, y, 4, o); });
        const [x, y] = P[3];
        g += path(`M${f(x - 6)} ${f(y - 6)} L${f(x)} ${f(y)} L${f(x - 6)} ${f(y + 6)}`, o, 2);
      });
      g += box(88, 158, 44, 10, 0.85, 0, 2);
      g += path("M150 52 C200 30 260 50 290 92 C310 120 300 150 270 160", 0.85, 1.6, "2 5");
      g += box(258, 150, 24, 18, 0.3, 0.9, 3);
      flow("M150 52 C200 30 260 50 290 92 C310 120 300 150 270 160", 3, 2);
      break;
    }
    default: break;
  }
  // Moving dots start part-way along (negative begin), so none waits at the corner.
  const fl = flows.map(([d, dur, count]) => Array.from({ length: count }, (_, k) =>
    `<circle r="5" fill="#fff" opacity=".22"><animateMotion dur="${dur}s" begin="-${f((k * dur) / count)}s" repeatCount="indefinite" path="${d}"/></circle>` +
    `<circle r="2.3" fill="#fff"><animateMotion dur="${dur}s" begin="-${f((k * dur) / count)}s" repeatCount="indefinite" path="${d}"/></circle>`).join("")).join("");
  return `<svg class="field-art" viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}<g class="flow">${fl}</g></svg>`;
}

// Motion for the drawings: the dots of light run only while a drawing is on screen, and nothing
// moves for readers who ask for less motion. The drawing itself is always fully shown.
(() => {
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const seen = new WeakSet();
  const io = "IntersectionObserver" in window && new IntersectionObserver((entries) => entries.forEach(({ target: svg, isIntersecting }) => {
    if (isIntersecting && !still.matches) {
      svg.classList.add("enter", "live");
      svg.unpauseAnimations?.();
    } else {
      svg.classList.remove("live");
      svg.pauseAnimations?.();
    }
  }), { rootMargin: "60px" });
  const watch = (root) => root.querySelectorAll?.("svg.field-art").forEach((svg) => {
    if (seen.has(svg)) return;
    seen.add(svg);
    svg.pauseAnimations?.();
    if (io) io.observe(svg);
  });
  const start = () => {
    watch(document);
    new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && (n.matches?.("svg.field-art") ? watch(n.parentNode) : watch(n))))).observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) start(); else addEventListener("DOMContentLoaded", start);
})();
