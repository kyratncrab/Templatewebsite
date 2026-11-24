# template-website

Website katalog Ragam Web: tempat memilih gaya (kategori) template website toko.
Pengunjung memilih kategori, melihat contoh website jadi, lalu pesan lewat WhatsApp.

- **Live (GitHub Pages):** https://kyratncrab.github.io/Templatewebsite/
- **Harga:** Rp50.000 / 2 bulan, termasuk hosting + domain. Pengerjaan 1–2 hari.
- **Kontak WhatsApp:** 0877-1346-6986

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
└── templates/           # contoh template per kategori
    └── <slug-kategori>/ # misal: kafe-resto/
        └── contoh-1/    # satu contoh = satu folder, satu file index.html
            └── index.html   # contoh lengkap, gaya inline (self-contained)
```

Kategori saat ini (6): `kafe-resto`, `warung-makan`, `butik-fashion`, `oleh-oleh`, `jasa`, `toko-kelontong`.
Setiap kategori punya 1 contoh (`contoh-1`). Contoh berikutnya memakai pola yang sama: `contoh-2`, `contoh-3`, dst.

## Menambah kategori baru

1. Tambah entri di `data/catalog.json` (slug, nama, ikon, warna, deskripsi).
2. Tambah kartu di `index.html` (bagian `#grid-kategori`) dan blok detail di bawahnya.
3. Buat folder `templates/<slug>/contoh-1/index.html` dengan contoh lengkap.
4. Update `CATALOG.md`.

## Menambah contoh template baru

1. Salin folder `templates/<slug>/contoh-1/` menjadi `templates/<slug>/contoh-2/`.
2. Edit hanya data di dalamnya (nama toko, menu/produk, harga, jam, alamat).
3. Tambah entri di `data/catalog.json` dan `CATALOG.md`.

## Aturan untuk agent website (penting)

- **Edit saja, jangan coding ulang.** Contoh template boleh diubah isinya (nama toko, alamat, kontak, jam buka, menu/produk, foto, warna aksen) — jangan ubah struktur, class CSS, atau file lain.
- Satu contoh template = satu file `index.html` self-contained. Jangan pecah jadi beberapa file.
- Foto toko didapat dari chat WhatsApp dengan pemilik toko. Foto di katalog ini adalah foto contoh berlisensi bebas (lihat kredit di footer `index.html`), bukan foto toko sebenarnya.
- Jangan menambah dependency berbayar, database, atau login. Website ini statis.
- Setelah menambah kategori/contoh, update `data/catalog.json` dan `CATALOG.md` supaya katalog dan manifest selalu sama.

## Menjalankan lokal

Buka `index.html` langsung di browser, atau jalankan server statis dari folder repo:

```bash
python3 -m http.server 8000
```

Lalu buka http://localhost:8000/
