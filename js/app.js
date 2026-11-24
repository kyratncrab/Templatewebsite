// Katalog template: loader, progress + parallax hero, pencarian kategori,
// tilt 3D kartu, reveal saat scroll. Tanpa JS pun semua konten tetap terlihat
// (reveal hanya disembunyikan bila class .js ada di <html>).
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches ||
    window.matchMedia("(hover: hover)").matches;
  var wide = window.matchMedia("(min-width: 1024px)").matches;
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  // ---------- loader ----------
  var loader = document.getElementById("loader");
  function hideLoader() { if (loader) loader.classList.add("done"); }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 2600);

  // ---------- progress + parallax hero (satu loop rAF) ----------
  var progress = document.getElementById("progress");
  var heroContent = document.querySelector(".hero-content");
  var hero = document.getElementById("hero");
  var lastY = -1;
  function drive() {
    var y = window.scrollY || 0;
    if (y === lastY) return;
    lastY = y;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
    if (heroContent && hero && !reduced) {
      var rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var p = clamp(y / Math.max(1, window.innerHeight), 0, 1);
        heroContent.style.transform = "translateY(" + (p * 56).toFixed(1) + "px)";
        heroContent.style.opacity = (1 - p * 0.55).toFixed(2);
      }
    }
  }
  if (!reduced) {
    var loop = function () { drive(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  } else {
    drive();
  }
  window.addEventListener("scroll", drive, { passive: true });

  // ---------- pencarian ----------
  var input = document.getElementById("cari");
  var form = document.getElementById("search");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".cat-card"));
  var kosong = document.getElementById("kosong");
  var resetBtn = document.getElementById("reset-cari");
  function filter(q) {
    q = (q || "").toLowerCase().trim();
    var shown = 0;
    cards.forEach(function (c) {
      var hit = !q || (c.getAttribute("data-cari") || "").toLowerCase().indexOf(q) !== -1 ||
        c.textContent.toLowerCase().indexOf(q) !== -1;
      c.style.display = hit ? "" : "none";
      if (hit) shown++;
    });
    if (kosong) kosong.hidden = shown !== 0;
  }
  if (input) {
    input.addEventListener("input", function () { filter(input.value); });
    // dukung ?cari= dari submit form (GET)
    try {
      var param = new URLSearchParams(window.location.search).get("cari");
      if (param) { input.value = param; filter(param); }
    } catch (e) { /* abaikan */ }
  }
  if (form) {
    form.addEventListener("submit", function () {
      filter(input ? input.value : "");
      var target = document.getElementById("kategori");
      if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (input) input.value = "";
      filter("");
      if (input) input.focus();
    });
  }

  // ---------- tilt 3D kartu ----------
  if (fine && wide && !reduced) {
    cards.forEach(function (card) {
      var raf = 0;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          card.style.transform =
            "perspective(900px) rotateX(" + (-py * 6).toFixed(2) + "deg) rotateY(" + (px * 7).toFixed(2) + "deg) translateY(-6px)";
        });
      });
      card.addEventListener("pointerleave", function () {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        card.style.transform = "";
      });
    });
  }

  // ---------- reveal ----------
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();
