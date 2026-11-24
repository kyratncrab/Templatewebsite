// Katalog template: pencarian kategori + animasi GSAP (hero & scroll).
// Kalau GSAP gagal dimuat, semua konten tetap terlihat — animasi dilewati.
(function () {
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
    });
  }

  // --- Animasi (GSAP + ScrollTrigger) ---
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  // Hero masuk sekali saat load
  gsap.from("[data-enter] .notice, [data-enter] h1 .line, [data-enter] .lead, [data-enter] .search, [data-enter] .btn, [data-enter] .hint", {
    y: 28, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 0.1
  });
  gsap.from("#hero3d", { opacity: 0, duration: 1.4, ease: "power2.out" });

  if (typeof ScrollTrigger === "undefined") return;

  // Kartu & langkah muncul saat di-scroll
  gsap.utils.toArray(".card, .step").forEach(function (el, i) {
    gsap.from(el, {
      y: 36, opacity: 0, duration: 0.8, ease: "power3.out", delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });
  gsap.from(".statement p", {
    y: 40, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".statement", start: "top 82%", once: true }
  });
  gsap.from(".block h2, .block .sub", {
    y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
    scrollTrigger: { trigger: ".block", start: "top 85%", once: true }
  });
})();
