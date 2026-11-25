# template-website

Website katalog: tempat memilih gaya (kategori) template website toko.
Pengunjung memilih kategori dan melihat gayanya. Contoh template tiap kategori segera hadir.

## Desain (tema Split / Rail, rombak 2026-11-25)

- Tema Split / Rail (arahan Iky 2026-11-25: rombak homepage lagi; aturan
  "bukan AI slop, bukan kartun, tanpa contoh template dulu, fokus
  homepage" tetap berlaku): putih `#ffffff`, kertas rel `#f4f1ea`,
  tinta `#161513`, muted `#5e5a52`, satu aksen hijau tua `#1e4d38`,
  garis hairline `#ddd8cd`. Datar, tanpa gradasi, tanpa kaca, tanpa
  bayangan, radius 0, tanpa ungu. Palet diverifikasi (rasio kontras):
  tinta di putih 18.25:1, muted di putih 6.86:1, aksen di putih 9.66:1.
  Aturan lengkap di `DESIGN.md` (aturan 9).
- TIDAK ADA hero, grid, atau daftar indeks: halaman dua kolom. Rel kiri
  menempel (360px): judul, intro, search, penghitung hasil, cara kerja
  3 langkah. Kolom kanan: 6 artikel kategori, masing-masing nomor besar
  + nama Archivo 800 + satu foto asli 3:2 + deskripsi + daftar
  "Isi template". Tanpa canvas 3D, tanpa loader, tanpa animasi scroll.
- Foto asli per kategori (Picsum, kredit di footer, semua dicek visual
  dan 200 sebelum push): 431 Carli Jean (kafe), 488 Monstruo Estudio
  (warung), 21 Alejandro Escamilla (butik), 312 Sonja Langford
  (oleh-oleh), 445 Aleksi Tappura (jasa), 292 Webvilla (kelontong).
  Contoh template TIDAK ditautkan dari homepage (draf tetap ada
  di `templates/`).
- "Cara kerja": tiga langkah ringkas di rel kiri, bukan section sendiri.
- Pencarian: filter langsung saat mengetik (data-cari + teks artikel),
  `?cari=` saat halaman dimuat, penghitung "Menampilkan X dari 6
  kategori", state kosong + tombol reset.
- File lama yang tidak lagi dipakai homepage (tetap ada di repo karena
  snapshot push tidak bisa menghapus): `js/hero3d.js`, `js/vendor/`
  (three.js, GSAP, lottie), `assets/buildings/`, `assets/hero-city.svg`.

- **Live (GitHub Pages):** https://kyratncrab.github.io/Templatewebsite/

## Struktur folder

```
template-website/
├── README.md            # file ini: tujuan repo + aturan untuk agent
├── CATALOG.md           # daftar kategori + contoh (untuk dibaca manusia)
├── data/catalog.json    # daftar kategori + contoh (untuk dibaca mesin/agent)
├── index.html           # halaman katalog
├── css/style.css        # gaya halaman katalog
├── js/app.js            # pencarian kategori (satu-satunya JS homepage)
├── js/vendor/           # three.js, GSAP, lottie-web — LEGACY, tidak dipakai homepage ini
├── js/hero3d.js         # adegan 3D hero — LEGACY, tidak dipakai homepage ini
├── assets/buildings/    # bangunan isometrik SVG — LEGACY, tidak dipakai homepage ini
├── assets/hero-city.svg # kota SVG fallback hero — LEGACY, tidak dipakai homepage ini
├── assets/lottie/       # animasi petunjuk scroll lama (tidak dipakai build ini)
├── DESIGN.md            # aturan desain (dari koreksi Iky + kombinasi tools)
├── assets/icons/        # ikon Lucide (SVG) yang dipakai katalog
└── templates/           # contoh template per kategori (DRAF, belum ditautkan dari homepage)
    └── <slug-kategori>/ # misal: kafe-resto/
        └── contoh-1/    # satu contoh = satu folder, satu file index.html
            └── index.html   # contoh lengkap, gaya inline (self-contained)
```

Kategori saat ini (6): `kafe-resto`, `warung-makan`, `butik-fashion`, `oleh-oleh`, `jasa`, `toko-kelontong`.
Contoh template tiap kategori belum ditautkan dari homepage; drafnya ada di `templates/` dan ditautkan nanti saat contohnya siap.

## Menambah kategori baru

1. Tambah entri di `data/catalog.json` (slug, nama, ikon, warna, deskripsi).
2. Tambah baris di `index.html` (daftar `#index`).
3. Buat folder `templates/<slug>/contoh-1/index.html` dengan contoh lengkap.
4. Update `CATALOG.md`.

## Menambah contoh template baru (nanti, saat contoh siap ditautkan)

1. Salin folder `templates/<slug>/contoh-1/` menjadi `templates/<slug>/contoh-2/`.
2. Edit hanya data di dalamnya (nama toko, menu/produk, harga, jam, alamat).
3. Tambah entri `templates` di `data/catalog.json`, update `CATALOG.md`, dan tautkan dari `index.html`.

## Aturan untuk agent website (penting)

- **Edit saja, jangan coding ulang.** Contoh template boleh diubah isinya (nama toko, alamat, kontak, jam buka, menu/produk, foto, warna aksen) — jangan ubah struktur, class CSS, atau file lain.
- Satu contoh template = satu file `index.html` self-contained. Jangan pecah jadi beberapa file.
- Foto di katalog ini adalah foto contoh berlisensi bebas (lihat kredit di footer `index.html`), bukan foto toko sebenarnya.
- Jangan menambah dependency berbayar, database, atau login. Website ini statis.
- Setelah menambah kategori/contoh, update `data/catalog.json` dan `CATALOG.md` supaya katalog dan manifest selalu sama.

## Menjalankan lokal

Buka `index.html` langsung di browser, atau jalankan server statis dari folder repo:

```bash
python3 -m http.server 8000
```

Lalu buka http://localhost:8000/
