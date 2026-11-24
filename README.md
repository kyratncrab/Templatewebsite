# template-website

Website katalog: tempat memilih gaya (kategori) template website toko.
Pengunjung memilih kategori dan melihat gayanya. Contoh template tiap kategori segera hadir.

## Desain (tema Midnight 3D, rombak total)

- Tema Hallmark Midnight: latar biru tengah malam `#02071d`, tinta putih
  dingin `#e7f0f9`, satu sinyal azure `#6bcbf7`. Palet diverifikasi Leonardo
  (tinta 17.35:1, muted 8.36:1, azure 10.96:1). Aturan lengkap di `DESIGN.md`.
  Semua sudut kotak, tanpa grain, tanpa kaca/blur, tanpa gradasi.
- Hero dunia 3D full-screen: canvas three.js lokal (`js/vendor/three.module.min.js`,
  three@0.187.0) — lapangan 18 bentuk geometri + bintang + kabut yang
  mengikuti arah kursor; klik di mana saja meledak jadi partikel (raycast).
  Judul duduk di tanah gelap di bawah. Tanpa WebGL, hero tetap tampil.
- Kategori jadi reel menyamping (scrolltide reel): section menempel 340svh,
  scroll ke bawah menggeser kartu ke samping; kartu di garis fokus tajam,
  sisanya redup. Di HP jadi geser horizontal biasa.
- "Cara kerja" jadi log malam: tiga baris bernomor dengan meter 2px yang
  terisi mengikuti scroll. Penutup: angka "6" besar sebagai pernyataan.
- Animasi: GSAP lokal (`js/vendor/gsap.min.js`) untuk entrance hero;
  lottie-web lokal (`js/vendor/lottie.min.js`) untuk petunjuk scroll.
  Kalau vendor gagal dimuat, semua konten tetap terlihat.
- Hormati `prefers-reduced-motion`: animasi dan loop 3D dimatikan; reel
  jadi daftar geser horizontal.

- **Live (GitHub Pages):** https://kyratncrab.github.io/Templatewebsite/

## Struktur folder

```
template-website/
├── README.md            # file ini: tujuan repo + aturan untuk agent
├── CATALOG.md           # daftar kategori + contoh (untuk dibaca manusia)
├── data/catalog.json    # daftar kategori + contoh (untuk dibaca mesin/agent)
├── index.html           # halaman katalog
├── css/style.css        # gaya halaman katalog
├── js/app.js            # pencarian kategori + animasi
├── js/vendor/           # three.js, GSAP, lottie-web (lokal, bukan CDN)
├── js/hero3d.js         # adegan 3D hero
├── assets/lottie/       # animasi petunjuk scroll (Lottie JSON)
├── DESIGN.md            # aturan desain (dari koreksi Iky + kombinasi tools)
├── assets/icons/        # ikon Lucide (SVG) yang dipakai katalog
└── templates/           # draf contoh template per kategori (belum ditautkan dari homepage)
    └── <slug-kategori>/ # misal: kafe-resto/
        └── contoh-1/    # satu contoh = satu folder, satu file index.html
            └── index.html   # contoh lengkap, gaya inline (self-contained)
```

Kategori saat ini (6): `kafe-resto`, `warung-makan`, `butik-fashion`, `oleh-oleh`, `jasa`, `toko-kelontong`.
Contoh template tiap kategori belum ditautkan dari homepage; drafnya ada di `templates/` dan ditautkan nanti saat contohnya siap.

## Menambah kategori baru

1. Tambah entri di `data/catalog.json` (slug, nama, ikon, warna, deskripsi).
2. Tambah kartu di `index.html` (bagian `#grid-kategori`) dan blok detail di bawahnya.
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
