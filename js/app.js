// Katalog template: pencarian kategori + animasi.
// Vendor lokal (js/vendor/): GSAP untuk entrance hero, lottie-web untuk
// petunjuk scroll. Scroll memakai satu loop rAF ala scrolltide (engine.md):
// progress bar + reel menyamping (reel.md) + meter log malam.
// Kalau GSAP/lottie gagal dimuat, semua konten tetap terlihat.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOBILE = 768;

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function pinProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    return clamp(-rect.top / Math.max(1, rect.height - vh));
  }

  // --- Pencarian kategori (menyaring kartu reel) ---
  var input = document.getElementById("cari");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#reel-track .reel-card"));
  var empty = document.getElementById("tidak-ada");
  var totalEl = document.getElementById("reel-total");
  function visibleCards() {
    return cards.filter(function (c) { return c.style.display !== "none"; });
  }
  if (input) {
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hay = (card.getAttribute("data-cari") || "").toLowerCase();
        var ok = !q || hay.indexOf(q) !== -1;
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      empty.classList.toggle("show", shown === 0);
      empty.hidden = shown !== 0;
      if (totalEl) totalEl.textContent = String(shown).padStart(2, "0");
    });
  }

  // --- Reveal section (scrolltide reveals.md) ---
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  // --- Petunjuk scroll (lottie-web lokal) ---
  var cue = document.getElementById("scroll-cue");
  if (cue && typeof lottie !== "undefined" && !reduced) {
    lottie.loadAnimation({
      container: cue, renderer: "svg", loop: true, autoplay: true,
      path: "assets/lottie/scroll-cue.json"
    });
  }

  // --- Reel menyamping (scrolltide reel.md) ---
  var stage = document.getElementById("kategori");
  var track = document.getElementById("reel-track");
  var bar = document.getElementById("reel-bar");
  var nowEl = document.getElementById("reel-now");
  var FOCUS = 0.62;
  var lastReelP = -1;
  function driveReel() {
    if (!stage || !track) return;
    if (window.innerWidth < MOBILE || reduced) {
      track.style.transform = "";
      cards.forEach(function (c) {
        c.classList.remove("focus");
        var img = c.querySelector("img");
        if (img) img.style.transform = "";
      });
      return;
    }
    var p = pinProgress(stage);
    if (p === lastReelP) return;
    lastReelP = p;
    var vw = window.innerWidth;
    var k = clamp((p - 0.04) / (0.96 - 0.04));
    var travel = Math.max(0, track.offsetLeft + track.scrollWidth - vw * 0.94);
    track.style.transform = "translate3d(" + (-k * travel).toFixed(1) + "px, 0, 0)";
    if (bar) bar.style.transform = "scaleX(" + k.toFixed(3) + ")";
    var focusX = vw * FOCUS;
    var visible = visibleCards();
    var nearest = 0, best = Infinity;
    visible.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      var d = Math.abs((r.left + r.width / 2) - focusX);
      if (d < best) { best = d; nearest = i; }
      var img = c.querySelector("img");
      if (img) {
        var drift = clamp(((r.left + r.width / 2) - focusX) / vw, -1, 1) * -24;
        img.style.transform = "scale(1.15) translateX(" + drift.toFixed(1) + "px)";
      }
    });
    cards.forEach(function (c) { c.classList.remove("focus"); });
    if (visible[nearest]) visible[nearest].classList.add("focus");
    if (nowEl) nowEl.textContent = String(visible.length ? nearest + 1 : 0).padStart(2, "0");
  }

  // --- Meter log malam ---
  var logSec = document.getElementById("cara-kerja");
  var logMeter = document.getElementById("log-meter");
  var logItems = Array.prototype.slice.call(document.querySelectorAll(".log-list li"));
  var lastLogP = -1;
  function driveLog() {
    if (!logSec || reduced) return;
    var rect = logSec.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = clamp((vh - rect.top) / (vh + rect.height));
    if (p === lastLogP) return;
    lastLogP = p;
    if (logMeter) logMeter.style.transform = "scaleX(" + p.toFixed(3) + ")";
    var idx = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    logItems.forEach(function (li, i) { li.classList.toggle("active", i === idx); });
  }

  // --- Satu loop scroll (scrolltide engine.md) ---
  var progress = document.getElementById("progress");
  var lastScroll = -1;
  function drive() {
    var y = window.scrollY || 0;
    if (y !== lastScroll) {
      lastScroll = y;
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      }
    }
    driveReel();
    driveLog();
  }
  if (!reduced) {
    var loop = function () { drive(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  } else {
    driveReel();
    driveLog();
  }

  // --- Entrance hero (GSAP lokal; choreograph + motion Premium) ---
  if (reduced || typeof gsap === "undefined") return;
  gsap.from(".hero-text h1 .line", {
    y: 32, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.12, delay: 0.05
  });
  gsap.from(".hero-text .lead, .hero-text .search, .hero-text .btn", {
    y: 16, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.12, delay: 0.25
  });
  gsap.from(".hero-text .hint", {
    opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.55
  });
  gsap.from("#hero3d", { opacity: 0, duration: 1.2, ease: "power2.out" });
})();
