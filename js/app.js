// Katalog template: cari kategori berdasarkan nama atau deskripsi.
(function () {
  var input = document.getElementById("cari");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#grid-kategori .card"));
  var empty = document.getElementById("tidak-ada");
  if (!input) return;
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
})();
