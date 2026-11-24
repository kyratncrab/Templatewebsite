# template-website

Website katalog: tempat memilih gaya (kategori) template website toko.
Pengunjung memilih kategori dan melihat gayanya. Contoh template tiap kategori segera hadir.

## Desain (tema gelap + 3D)

- Tema gelap modern, tanpa warna cerah: latar `#0a0a0d`, teks gading, satu aksen emas redup `#c9a25e`.
- Hero: canvas three.js (`js/hero3d.js`, three@0.187.0 via CDN importmap) — kristal melayang, cincin orbit,
  satelit, dan partikel yang mengikuti arah kursor; klik memberi efek denyut. Tanpa WebGL, hero tetap
  tampil (teks terbaca, animasi dilewati).
- Animasi: GSAP 3.12.5 + ScrollTrigger via CDN (`js/app.js`) — hero masuk sekali saat load, kartu dan
  langkah muncul saat di-scroll. Kalau CDN gagal, semua konten tetap terlihat.
- Hormati `prefers-reduced-motion`: animasi dan loop 3D dimatikan.

- **Live (GitHub Pages):** https://kyratncrab.github.io/Templatewebsite/

## Struktur folder

```
template-website/
├── README.md            # file ini: tujuan repo + aturan untuk agent
├── CATALOG.md           # daftar kategori + contoh (untuk dibaca manusia)
├── data/catalog.json    # daftar kategori + contoh (untuk dibaca mesin/agent)
├── index.html           # halaman katalog
├── css/style.css        # gaya halaman katalog
├── js/app.js            # pencarian kategori
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
