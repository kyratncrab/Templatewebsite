// Katalog template: pencarian kategori saja. Tanpa animasi scroll, tanpa tilt,
// tanpa loader — konten tampil apa adanya.
(function () {
  var form = document.getElementById("search");
  var input = document.getElementById("cari");
  var rows = Array.prototype.slice.call(document.querySelectorAll(".kategori"));
  var kosong = document.getElementById("kosong");
  var kosongKata = document.getElementById("kosong-kata");
  var hasil = document.getElementById("hasil");
  var resetBtn = document.getElementById("reset-cari");
  if (!form || !input || !rows.length) return;

  function norm(s) {
    return (s || "").toLowerCase().replace(/&amp;/g, "&").trim();
  }
  function filter(q) {
    q = norm(q);
    var shown = 0;
    rows.forEach(function (row) {
      var hay = norm(row.getAttribute("data-cari") + " " + row.textContent);
      var ok = !q || hay.indexOf(q) !== -1;
      row.hidden = !ok;
      if (ok) shown++;
    });
    var empty = q && shown === 0;
    kosong.hidden = !empty;
    if (empty) kosongKata.textContent = q;
    if (hasil) {
      hasil.textContent = q
        ? "Menampilkan " + shown + " dari " + rows.length + " kategori"
        : "Menampilkan " + rows.length + " dari " + rows.length + " kategori";
    }
    return shown;
  }
  input.addEventListener("input", function () { filter(input.value); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    filter(input.value);
    document.getElementById("daftar").scrollIntoView({ behavior: "smooth" });
  });
  if (resetBtn) resetBtn.addEventListener("click", function () {
    input.value = "";
    filter("");
    input.focus();
  });

  var params = new URLSearchParams(window.location.search);
  var awal = params.get("cari");
  if (awal) {
    input.value = awal;
    filter(awal);
  }
})();
