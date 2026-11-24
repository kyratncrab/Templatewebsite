# template-website

Website katalog: tempat memilih gaya (kategori) template website toko.
Pengunjung memilih kategori dan melihat gayanya. Contoh template tiap kategori segera hadir.

## Desain (tema Editorial terang, redesign 2026-11-24)

- Tema Editorial terang (arahan Iky 23:33: bukan AI slop, bukan kartun,
  tanpa contoh template dulu, fokus homepage): kertas hangat `#faf7f1`,
  tinta `#1a1712`, muted `#6f6a5e`, satu aksen vermilion `#c2410c`,
  garis hairline `#e4ded1`. Datar, tanpa gradasi, tanpa kaca, tanpa
  bayangan, radius 0, tanpa ungu. Palet diverifikasi (chroma): tinta di
  kertas 16.71:1, muted di kertas 5.04:1, aksen di kertas 4.84:1.
  Aturan lengkap di `DESIGN.md` (aturan 8).
- Hero tipografi + satu foto asli: judul "Website toko, siap dipakai."
  (baris kedua aksen vermilion), lead 11 kata, search kotak (input border
  tinta + tombol tinta solid), foto keranjang sayur full-width (Markus
  Spiske, Wikimedia Commons, kredit di footer). Tanpa canvas 3D, tanpa
  loader, tanpa animasi scroll.
- Kategori jadi daftar indeks bernomor 01-06 (bukan kartu/grid): nomor
  Fraunces aksen, nama serif, deskripsi muted, garis hairline. Hover:
  latar kertas-2 + nama jadi aksen. Tanpa link, tanpa tombol, tanpa
  gambar. Contoh template TIDAK ditautkan dari homepage (draf tetap ada
  di `templates/`).
- "Cara kerja": tiga langkah bernomor dengan garis atas 2px tinta.
  Penutup: satu kalimat serif + tombol tinta "Cari kategori".
- Pencarian: filter langsung saat mengetik (data-cari + teks baris),
  `?cari=` saat halaman dimuat, state kosong + tombol reset.
- Sloplint: 1 FAIL + 2 REFLEX di-waive dan didokumentasikan di header
  `css/style.css` (bukan tema Hallmark; kata aksen signature sekali di
  hero; tidak ada kontrol disabled). Sisanya diperbaiki.
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
