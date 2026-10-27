// Shared router and page rendering for every lecture site. Routes: #/ (home) and
// #/<chapter slug>. Each lecture supplies LECTURE and CHAPTERS (chapters.js) and DEMOS
// (demos.js). Course details (code, name, byline) come from COURSE in course.js.

const C = Object.assign({
  code: "COURSE",
  name: "Course",
  short: "Course",
  checked: "Every program here has been run, and every output shown is the real output.",
  practice: "run the programs yourself with plain Python 3",
}, typeof COURSE === "undefined" ? {} : COURSE);
const main = document.getElementById("main");
const pad = (k) => String(k + 1).padStart(2, "0");
const NUMBER_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
let cleanups = [];

function formatVideoCaption(raw) {
  if (!raw) return "";
  const parts = raw.split(" · ");
  if (parts.length > 1 && /^Part \d+/i.test(parts[0])) {
    return `<span class="vcap-badge">${parts[0]}</span><span class="vcap-text">${parts.slice(1).join(" · ")}</span>`;
  }
  return `<span class="vcap-text">${raw}</span>`;
}

function mountDemos(root) {
  root.querySelectorAll("[data-demo]").forEach((d) => {
    const body = d.querySelector(".demo-body") || d;
    DEMOS[d.dataset.demo](body);
  });
  root.querySelectorAll("[data-video]").forEach((v) => {
    const src = v.dataset.video;
    // Subtitles sit next to the video as LNN-K.<lang>.vtt; LECTURE.subtitles lists the languages there are.
    const base = src.replace(/\.mp4$/, "");
    const LABELS = { en: "English", zh: "中文" };
    const tracks = (LECTURE.subtitles || ["en"]).map((l, k) =>
      `<track kind="subtitles" srclang="${l}" label="${LABELS[l] || l}" src="${base}.${l}.vtt"${k ? "" : " default"}>`).join("");
    const cap = (LECTURE.videos || {})[src] || "";
    // Poster: a still from the video, LNN-K.jpg next to it (made by tools/posters.py).
    v.innerHTML = `<video controls preload="metadata" poster="${base}.jpg" src="${src}">${tracks}</video>
      <div class="vcap">${formatVideoCaption(cap)}</div>`;
    v.querySelector("video").addEventListener("error", () => {
      v.innerHTML = `<div class="missing">The video file is not bundled with this copy of the site.<br>Put it at <code>${src}</code> to play it here.</div>`;
    });
  });
  // Add a one-click copy button to standalone Python blocks.
  root.querySelectorAll("pre.code:not(.out)").forEach((pre) => {
    if (pre.closest(".stepper") || pre.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.title = "Copy Python code";
    btn.onclick = () => {
      const text = [...pre.querySelectorAll(".ln")].map((ln) => ln.textContent).join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied ✓";
          btn.classList.add("copied");
          setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1600);
        }).catch(() => {});
      }
    };
    pre.appendChild(btn);
  });
}

// Previous / next lecture, from COURSE.lectures (course.js): [[number, title], ...] in course order.
const pad2 = (n) => String(n).padStart(2, "0");
function lectureAt(step) {
  const list = C.lectures || [];
  const k = list.findIndex(([n]) => n === LECTURE.number);
  return k < 0 ? null : list[k + step] || null;
}
const lectureHref = ([n]) => `../L${pad2(n)}/index.html`;

// Field colour and drawing for this lecture (course.js); pages without them keep the plain look.
const hasArt = typeof fieldArt === "function" && typeof FIELD_COLOR === "object" && LECTURE.number in FIELD_COLOR;

function stopTimers() {
  // Demos use setInterval; clear every interval when the page changes.
  const max = setInterval(() => {}, 1000);
  for (let k = 0; k <= max; k++) clearInterval(k);
  cleanups.forEach((f) => f());
  cleanups = [];
}

function renderHome() {
  const L = LECTURE;
  document.title = `${L.title} — ${C.name} Lecture ${L.number}`;
  const videoCount = Object.keys(L.videos || {}).length;
  const prevLec = lectureAt(-1), nextLec = lectureAt(1);
  main.innerHTML = `<div class="wrap">
    ${hasArt ? `<div class="cover" style="--c:${FIELD_COLOR[L.number]}">${fieldArt(L.number)}
      <span class="cover-chip"><b>L${pad2(L.number)}</b>${L.title}</span>
      <span class="cover-note">${C.name} · ${L.number ? `Field ${pad2(L.number)} of 13` : "Course overview"}</span>
    </div>` : ""}
    <section class="hero${hasArt ? " has-cover" : ""}">
      <div>
        ${hasArt ? "" : `<span class="pill">${C.name} · Lecture ${pad2(L.number)}</span>`}
        <h1>${L.title}<small>${L.tagline}</small></h1>
        <p class="lead">${L.lead}</p>
        <div class="btnrow">
          <a class="btn primary" href="#/${CHAPTERS[0].slug}">Start → Chapter 1 · ${CHAPTERS[0].title}</a>
          <a class="btn" href="#outline">Lecture outline ↓</a>
        </div>
        <div class="hero-stats">
          <span><b>${L.minutes}</b></span>
          <span><b>${CHAPTERS.length}</b> chapters</span>
          ${videoCount ? `<span><b>${videoCount}</b> video parts</span>` : ""}
          ${C.byline ? `<span>${C.byline}</span>` : ""}
        </div>
      </div>
      <div class="card hero-demo">
        <div class="head"><span>${L.heroLabel}</span><button class="cbtn hero-pause">Pause</button></div>
        <div data-demo="${L.heroDemo}"><div class="demo-body"></div></div>
        <div class="caption">${L.heroCaption}</div>
      </div>
    </section>

    <div class="sec-bar">
      <h2>${L.whyTitle}</h2>
      <span>${L.whySub}</span>
    </div>
    <div class="why">${L.why.map(([h, p], idx) => `
      <div class="card">
        <span class="why-num">${pad(idx)}</span>
        <h3>${h}</h3>
        <p>${p}</p>
      </div>`).join("")}</div>

    <div class="sec-bar" id="outline">
      <h2>${NUMBER_WORDS[CHAPTERS.length] || CHAPTERS.length} chapters</h2>
      <span>In the order of the lecture · read in sequence</span>
    </div>
    <div class="chapters">${CHAPTERS.map((c, k) => `
      <a class="card chapcard" href="#/${c.slug}">
        <div class="chapcard-top">
          <span class="num">Chapter ${pad(k)}</span>
          <span class="sec-count">${c.sections.length} section${c.sections.length > 1 ? "s" : ""}</span>
        </div>
        <h3>${c.title}</h3>
        <p>${c.subtitle}</p>
        <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <span class="go">Open chapter →</span>
      </a>`).join("")}
    </div>

    <section class="cta">
      <h2>${L.ctaTitle}</h2>
      <div class="btnrow" style="margin:14px 0">
        <a class="btn primary" href="#/${CHAPTERS[0].slug}">Chapter 1 · ${CHAPTERS[0].title} →</a>
        <a class="btn" href="../index.html">← All 14 lectures</a>
      </div>
      <p class="meta">${C.checked}. You can ${C.practice}.</p>
      <div class="pager" style="margin:24px 0 0">
        ${prevLec ? `<a class="card" href="${lectureHref(prevLec)}"><small>← Previous lecture</small><b>L${pad2(prevLec[0])} · ${prevLec[1]}</b></a>` : `<a class="card" href="../index.html"><small>← Course hub</small><b>All 14 lectures</b></a>`}
        ${nextLec ? `<a class="card next" href="${lectureHref(nextLec)}"><small>Next lecture →</small><b>L${pad2(nextLec[0])} · ${nextLec[1]}</b></a>` : `<a class="card next" href="../index.html"><small>Course hub →</small><b>All 14 lectures</b></a>`}
      </div>
    </section>
  </div>`;
  mountDemos(main);
  // The pause button toggles the hero player by clearing/restarting its timers.
  const btn = main.querySelector(".hero-pause");
  btn.onclick = () => {
    const holder = main.querySelector(`[data-demo="${L.heroDemo}"]`);
    if (btn.textContent === "Pause") { stopTimers(); btn.textContent = "Play"; }
    else { DEMOS[L.heroDemo](holder.querySelector(".demo-body")); btn.textContent = "Pause"; }
  };
}

function heroHTML(c, activeIdx) {
  if (!c.hero) return "";
  if (c.hero === "toc") {
    return `<div class="card hero-demo"><div class="head"><span>The lecture at a glance</span><span>${CHAPTERS.length} chapters</span></div>
      <div class="toc-list">${CHAPTERS.map((x, k) => `<a class="toc-row${k === activeIdx ? " active" : ""}" href="#/${x.slug}"><b class="mono">${pad(k)}</b><span>${x.title}</span></a>`).join("")}</div></div>`;
  }
  if (c.hero.startsWith("code:")) {
    return `<div class="card hero-demo"><div class="head"><span>${c.heroCaption}</span><span>Python</span></div>${codeBlock(CODE[c.hero.slice(5)])}</div>`;
  }
  return `<div class="card hero-demo"><div class="head"><span>Interactive model · ${c.nav}</span></div><div data-demo="${c.hero}"><div class="demo-body"></div></div><div class="caption">${c.heroCaption}</div></div>`;
}

function renderChapter(k) {
  const c = CHAPTERS[k];
  document.title = `${c.title} — ${C.name} Lecture ${LECTURE.number} · ${LECTURE.title}`;
  const prev = CHAPTERS[k - 1], next = CHAPTERS[k + 1];
  const tocLinks = c.sections.map((s, j) => `<a href="#/${c.slug}/${s.id}" data-sec="${s.id}">§${k + 1}.${j + 1} ${s.title}</a>`).join("");
  main.innerHTML = `<div class="wrap">
    <section class="chap-hero">
      <div>
        <span class="pill${hasArt ? " with-art" : ""}">${hasArt ? `<i class="pill-art" style="--c:${FIELD_COLOR[LECTURE.number]}">${fieldArt(LECTURE.number)}</i>` : ""}Chapter ${pad(k)} of ${pad(CHAPTERS.length - 1)} · ${c.nav}</span>
        <h1>${c.title}</h1>
        <p class="subtitle">${c.subtitle}</p>
        <p class="abstract">${c.abstract}</p>
      </div>
      ${heroHTML(c, k)}
    </section>
    <div class="chap-body">
      <nav class="toc" aria-label="In this chapter"><b>In this chapter</b>
        ${tocLinks}
      </nav>
      <article>
        <details class="mobile-toc">
          <summary>In this chapter (${c.sections.length} sections)</summary>
          <nav aria-label="In this chapter (mobile)">${tocLinks}</nav>
        </details>
        ${c.sections.map((s, j) => `<section id="${s.id}"><h2><span class="sec">§${k + 1}.${j + 1}</span>${s.title}</h2>${s.html}</section>`).join("")}
        <h2 style="font-size:20px;margin-top:36px">Chapter ${pad(k)} in three lines</h2>
        <div class="takeaways">${c.takeaways.map((t, j) => `<div class="card"><b>0${j + 1}</b><div>${t}</div></div>`).join("")}</div>
        <div class="pager" style="margin-top:28px">
          ${prev ? `<a class="card" href="#/${prev.slug}"><small>← Previous · Chapter ${pad(k - 1)}</small><b>${prev.title}</b></a>` : `<a class="card" href="#/"><small>← Back</small><b>Lecture ${pad2(LECTURE.number)} overview</b></a>`}
          ${next ? `<a class="card next" href="#/${next.slug}"><small>Next · Chapter ${pad(k + 1)} →</small><b>${next.title}</b></a>` : (lectureAt(1) ? `<a class="card next" href="${lectureHref(lectureAt(1))}"><small>Next lecture →</small><b>L${pad2(lectureAt(1)[0])} · ${lectureAt(1)[1]}</b></a>` : `<a class="card next" href="../index.html"><small>Done →</small><b>All lectures</b></a>`)}
        </div>
      </article>
    </div>
  </div>`;
  mountDemos(main);
  // Highlight the section being read: the last one whose heading has passed a third of the
  // screen, or the last section once the page is scrolled to the bottom.
  const links = [...main.querySelectorAll(".toc a")];
  const secs = [...main.querySelectorAll("article section")];
  let ticking = false;
  const spy = () => {
    ticking = false;
    const line = innerHeight / 3;
    let cur = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top <= line) cur = s;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1];
    links.forEach((a) => a.classList.toggle("active", a.dataset.sec === cur?.id));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  spy();
  cleanups.push(() => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); });
}

function route() {
  stopTimers();
  const [slug, sec] = location.hash.replace(/^#\/?/, "").split("/");
  const k = CHAPTERS.findIndex((c) => c.slug === slug);
  if (k >= 0) renderChapter(k); else renderHome();
  document.querySelectorAll(".chapnav a").forEach((a) => a.classList.toggle("active", a.dataset.slug === slug));
  const target = sec ? document.getElementById(sec) : null;
  if (target) target.scrollIntoView();
  else if (!location.hash.includes("outline")) window.scrollTo(0, 0);
}

// In-page anchors (#outline, toc links) shouldn't re-render the page.
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  const href = a.getAttribute("href");
  if (href === "#outline") { e.preventDefault(); document.getElementById("outline")?.scrollIntoView(); return; }
  const m = href.match(/^#\/([^/]+)\/(.+)$/);
  if (m && location.hash.startsWith(`#/${m[1]}`)) {
    e.preventDefault();
    document.getElementById(m[2])?.scrollIntoView();
    history.replaceState(null, "", href);
  }
});

document.querySelector(".brand-text").innerHTML = `<b>${LECTURE.title} · L${String(LECTURE.number).padStart(2, "0")}</b><span>${C.short}</span>`;
if (hasArt) document.documentElement.style.setProperty("--field", FIELD_COLOR[LECTURE.number]);
document.getElementById("chapnav").innerHTML = CHAPTERS.map((c, k) =>
  `<a href="#/${c.slug}" data-slug="${c.slug}"><span>${pad(k)}</span>${c.nav}</a>`).join("");

// Theme toggle: remembers the choice when storage is available.
const themeBtn = document.getElementById("theme");
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  themeBtn.textContent = dark ? "☀" : "☾";
}
try { applyTheme(localStorage.getItem(`${C.code.toLowerCase()}-theme`)); } catch { applyTheme(null); }
themeBtn.onclick = () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const t = dark ? "light" : "dark";
  applyTheme(t);
  try { localStorage.setItem(`${C.code.toLowerCase()}-theme`, t); } catch { /* storage unavailable */ }
};

// Reading progress bar.
const bar = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = h > 0 ? `${(100 * scrollY) / h}%` : "0";
}, { passive: true });

// Way back to the course home (all lectures), at the left of the top bar on every lecture page.
const homeLink = document.createElement("a");
homeLink.className = "homelink";
homeLink.href = "../index.html";
homeLink.title = "All lectures";
homeLink.innerHTML = `<span aria-hidden="true">←</span><span class="homelink-text">All lectures</span>`;
document.querySelector(".topbar").prepend(homeLink);

addEventListener("hashchange", route);
route();
