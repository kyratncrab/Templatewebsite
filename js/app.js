// Katalog template: pencarian kategori + animasi.
// Vendor lokal (js/vendor/): GSAP untuk entrance hero, lottie-web untuk
// petunjuk scroll. Scroll memakai satu loop rAF ala scrolltide (engine.md):
// progress bar + statement kata-per-kata. Reveal section pakai
// IntersectionObserver ala scrolltide (reveals.md).
// Kalau GSAP/lottie gagal dimuat, semua konten tetap terlihat.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Pencarian kategori ---
  var input = document.getElementById("cari");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#grid-kategori .card"));
  var empty = document.getElementById("tidak-ada");
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

  // --- Satu loop scroll (scrolltide engine.md) ---
  var progress = document.getElementById("progress");
  var stmt = document.getElementById("pernyataan");
  var words = document.querySelectorAll("#statement-text span");
  var lastP = -1, lastScroll = -1;
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function pinProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    return clamp(-rect.top / Math.max(1, rect.height - vh));
  }
  function drive() {
    var y = window.scrollY || 0;
    if (y !== lastScroll) {
      lastScroll = y;
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      }
    }
    if (stmt && words.length) {
      var p = pinProgress(stmt);
      if (p !== lastP) {
        lastP = p;
        var lit = Math.floor(p * words.length);
        words.forEach(function (w, i) {
          w.classList.toggle("on", reduced || i < lit);
          w.classList.toggle("hot", reduced || (i === words.length - 1 && i < lit));
        });
      }
    }
  }
  if (!reduced) {
    var loop = function () { drive(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  } else {
    words.forEach(function (w, i) {
      w.classList.add("on");
      if (i === words.length - 1) w.classList.add("hot");
    });
  }

  // --- Entrance hero (GSAP lokal; choreograph + motion Premium) ---
  // Lead dulu (h1, paling jauh), support menyusul (lead, search, tombol,
  // gerakan lebih kecil), dekorasi (hint) hanya fade. Total ~1,1 detik.
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
