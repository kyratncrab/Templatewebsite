// Katalog template: pencarian kategori + animasi.
// Vendor lokal (js/vendor/): GSAP untuk entrance hero, lottie-web untuk
// petunjuk scroll. Scroll memakai satu loop rAF ala scrolltide (engine.md):
// progress bar + jalur tergambar (drawn.md). Reveal section pakai
// IntersectionObserver ala scrolltide (reveals.md). Wordmark pas-lebar
// ala scrolltide (type.md). Spotlight + tilt kartu bento (gestures).
// Kalau GSAP/lottie gagal dimuat, semua konten tetap terlihat.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // --- Pencarian kategori ---
  var input = document.getElementById("cari");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#grid-kategori .tile"));
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

  // --- Spotlight + tilt kartu bento ---
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  tiles.forEach(function (tile) {
    tile.addEventListener("pointermove", function (e) {
      var r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      tile.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      if (fine && !reduced) {
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        tile.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      }
    });
    tile.addEventListener("pointerleave", function () { tile.style.transform = ""; });
  });

  // --- Wordmark pas-lebar (scrolltide type.md) ---
  var wordmark = document.getElementById("wordmark");
  function fitWordmark() {
    if (!wordmark) return;
    var parent = wordmark.parentElement;
    var PROBE = 100;
    wordmark.style.fontSize = PROBE + "px";
    var cs = getComputedStyle(parent);
    var available = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var natural = wordmark.offsetWidth;
    if (natural > 0) wordmark.style.fontSize = ((PROBE * available) / natural) + "px";
  }
  if (wordmark) {
    fitWordmark();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
    if ("ResizeObserver" in window) new ResizeObserver(fitWordmark).observe(wordmark.parentElement);
  }

  // --- Satu loop scroll (scrolltide engine.md) ---
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function pinProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    return clamp(-rect.top / Math.max(1, rect.height - vh));
  }

  // Jalur tergambar (scrolltide drawn.md)
  var route = document.getElementById("cara-kerja");
  var legs = Array.prototype.slice.call(document.querySelectorAll("#cara-kerja .leg"));
  var master = document.getElementById("route-master");
  var rider = document.getElementById("route-rider");
  var routeTitle = document.getElementById("route-step-title");
  var routeBody = document.getElementById("route-step-body");
  var routeStep = document.getElementById("route-step");
  var ROUTE_STEPS = [
    { title: "Pilih kategori", body: "Cari gaya yang paling mirip dengan tokomu: kafe, warung, butik, atau yang lain." },
    { title: "Sesuaikan datanya", body: "Nama, menu atau produk, jam buka, dan foto diisi dengan data tokomu sendiri." },
    { title: "Website siap dipakai", body: "Satu halaman rapi untuk tokomu, langsung bisa dibuka dan dibagikan." }
  ];
  var ROUTE_WIN = [0.06, 0.94];
  var lastRouteP = -1, lastStepIdx = -1, masterLen = 0;
  function driveRoute() {
    if (!route || !legs.length) return;
    var p = pinProgress(route);
    if (p === lastRouteP) return;
    lastRouteP = p;
    var q = clamp((p - ROUTE_WIN[0]) / (ROUTE_WIN[1] - ROUTE_WIN[0]));
    legs.forEach(function (leg, i) {
      leg.style.strokeDashoffset = String(1 - clamp(q * 3 - i));
    });
    if (master && rider) {
      if (!masterLen) masterLen = master.getTotalLength();
      var pt = master.getPointAtLength(q * masterLen);
      rider.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")");
    }
    var idx = q < 1 / 3 ? 0 : q < 2 / 3 ? 1 : 2;
    if (idx !== lastStepIdx) {
      lastStepIdx = idx;
      routeTitle.textContent = ROUTE_STEPS[idx].title;
      routeBody.textContent = ROUTE_STEPS[idx].body;
      routeStep.textContent = "Langkah " + (idx + 1) + " dari 3";
    }
  }

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
    driveRoute();
  }
  if (!reduced) {
    var loop = function () { drive(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
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
