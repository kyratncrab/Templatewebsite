# template-website

Website katalog: tempat memilih gaya (kategori) template website toko.
Pengunjung memilih kategori dan melihat gayanya. Contoh template tiap kategori segera hadir.

## Desain (tema Modern 3D Digital World, total redesign)

- Tema Modern 3D Digital World (brief Iky 2026-11-24 22:42): deep navy
  `#0a1128`, electric blue `#2f7bff`, cyan `#22d3ee`, soft purple `#a78bfa`,
  putih `#f4f7ff`. Gradasi halus + glassmorphism + bayangan lembut. Palet
  diverifikasi Leonardo (putih di navy 17.44:1, navy di biru 4.80:1, navy di
  cyan 10.34:1). Aturan keras: teks di atas gradasi biru-cyan memakai NAVY.
  Aturan lengkap di `DESIGN.md`. Radius modern: kartu 24px, panel 32px.
- Hero dunia miniatur 3D: canvas three.js lokal (`js/vendor/three.module.min.js`,
  three@0.187.0) — pulau mengambang dengan bangunan toko, pohon, lampu,
  awan, balon, dan bintang; pulau berputar pelan, kamera mengikuti kursor;
  klik di mana saja meledak jadi partikel (raycast). Judul "Bangun Dunia
  Digital Bisnismu." di atas langit scene. Tanpa WebGL, kota SVG fallback
  (`assets/hero-city.svg`) tetap tampil — hero tidak pernah kosong.
- Kategori jadi grid 3 kolom: setiap kartu punya bangunan isometrik SVG
  sendiri (`assets/buildings/<slug>.svg`, tanpa foto stok), hover naik +
  tilt 3D, tombol "Lihat template" ke `templates/<slug>/contoh-1/index.html`.
- "Cara kerja": tiga kartu kaca bernomor gradasi. Penutup: panel gradasi
  biru-cyan-ungu dengan tombol putih.
- Animasi: loader elegan (hilang sendiri lewat CSS), satu loop rAF
  (progress bar + parallax hero), reveal saat scroll, animasi floating
  pada bangunan kartu. Kalau JS gagal, semua konten tetap terlihat.
- Hormati `prefers-reduced-motion`: animasi dan loop 3D dimatikan; scene
  3D merender satu frame statis.

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
├── assets/buildings/    # bangunan isometrik SVG per kategori (tanpa foto stok)
├── assets/hero-city.svg # kota SVG fallback hero (tampil bila WebGL gagal)
├── assets/lottie/       # animasi petunjuk scroll lama (tidak dipakai build ini)
├── DESIGN.md            # aturan desain (dari koreksi Iky + kombinasi tools)
├── assets/icons/        # ikon Lucide (SVG) yang dipakai katalog
└── templates/           # contoh template per kategori (ditautkan dari homepage)
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
