# DESIGN.md — Katalog Template Website Toko

Sistem desain katalog ini. Ditulis dari koreksi Iky sendiri (learn-taste): setiap aturan
berasal dari kata-katanya, bukan dari selera umum. Aturan di sini mengikat build
berikutnya; kalau ada yang bertentangan, aturan Iky yang terbaru menang.

## Aturan dari Iky

1. **Gelap, tanpa warna cerah.** (Iky, 2026-11-24: "jangan pake warna cerah")
   Latar biru tengah malam `#02071d`, tinta putih dingin `#e7f0f9`, satu
   sinyal azure `#6bcbf7`. Tidak ada warna cerah lain di mana pun.
2. **Animasi dan 3D di homepage, supaya CS kagum.** (Iky, 2026-11-24: "manfaatkan
   gaya animasi dan 3d, soalnya misi kita ini membuat cs kagum dengan gaya
   website kita yang moderen dan animasi 3d")
   Hero adalah dunia 3D full-screen: lapangan bentuk yang melayang mengikuti
   kursor; klik di mana saja meledak jadi partikel. Scroll menggerakkan reel
   kategori ke samping. Fokus homepage dulu.
3. **Lupakan Ragam Web, mulai dari 0.** (Iky, 2026-11-24: "lupakan ragam web")
   Tidak ada brand, harga, atau nomor WA di katalog ini.
4. **Jangan ada contoh template dulu.** (Iky, 2026-11-24: "jangan ada contoh
   template dulu, buat homepage yang bagus")
   Homepage saja yang tampil. File di `templates/` adalah draf yang belum
   ditautkan. **DIGANTI aturan 7 (2026-11-24 22:42):** tombol "Lihat template"
   sekarang ditautkan ke `templates/<slug>/contoh-1/index.html`.
5. **Rombak semua, lebih modern.** (Iky, 2026-11-24: "rombak semua ganti gaya
   tema animasi grid dll pokok rombak semua ganti yang lebih moderen")
   Tema diganti Kiln ke Spore, grid biasa ke bento, langkah ke jalur
   tergambar, hero jadi stage menempel, kartu punya spotlight + tilt.
6. **Rombak total, tidak boleh mirip sama sekali, tema 3D animasi.** (Iky,
   2026-11-24: "ini mah mirip banget aku ingin rombak semuanya biar gak mirip
   sama sekali aku mau tema 3d animasi")
   Semuanya diganti: tema Spore ke Midnight (biru dingin, grotesk, kotak),
   hero split ke dunia 3D full-screen, kristal ke lapangan bentuk, grid/bento
   ke reel menyamping, langkah ke log malam, foto ke 6 foto baru, judul ke
   "Toko kamu, dalam 3D.", wordmark dihapus.
7. **Total redesign: Modern 3D Digital World.** (Iky, 2026-11-24 22:42, brief
   tertulis; diawali "jelek," tentang Midnight)
   Bangun ulang seluruh identitas: dunia miniatur 3D premium ala landing page
   startup teknologi. Kaca (glassmorphism), gradasi halus, bayangan lembut,
   pencahayaan ambient, kedalaman dan perspektif 3D, tipografi premium.
   Hero: judul "Bangun Dunia Digital Bisnismu.", dunia miniatur 3D (bangunan
   toko/kafe/restoran/butik) sebagai latar, animasi floating, CTA premium,
   search bar modern. Kategori: 6 kartu 3D, masing-masing dengan miniature
   3D building sesuai jenis bisnisnya, rounded modern, hover + tilt 3D,
   shadow dan depth, **tanpa foto stok yang tidak relevan**. Palet: deep navy,
   electric blue, cyan, soft purple, white, gradasi halus. Fungsionalitas
   lama dipertahankan (6 kategori, search, navigasi, cara kerja, link
   template); yang belum bekerja diperbaiki tanpa menghilangkan tujuannya.
   Tidak ada error JavaScript; animasi optimal di mobile.

## Sistem (brief World)

- **Tema: Modern 3D Digital World.** Deep navy `#0a1128`, electric blue
  `#2f7bff`, cyan `#22d3ee`, soft purple `#a78bfa`, putih `#f4f7ff`.
  Gradasi biru-cyan (CTA, judul, panel penutup) dan kaca (header, badge,
  search, kartu, tombol sekunder). Radius modern: kartu 24px, panel 32px,
  tombol/pill 999px. Font Plus Jakarta Sans (display 800, body 400/500).
- **Palet diverifikasi Leonardo.** Putih di navy 17.44:1, muted di navy
  7.59:1, cyan di navy 10.34:1, navy di biru 4.80:1, navy di cyan 10.34:1,
  navy di tengah gradasi 7.49:1 (semua lulus WCAG). Aturan keras: **teks di
  atas gradasi biru-cyan memakai NAVY** (putih di biru hanya 3.89:1, gagal).
  Token ada di `:root` `css/style.css`.
- **Hero: dunia miniatur 3D mengambang.** Pulau melayang (disk + kerucut
  bawah + kristal cyan) dengan 6 bangunan kartun (kafe berawning, butik ungu,
  rumah cyan, toko hijau, menara), pohon, lampu, awan, balon, 240 bintang.
  Pulau berputar pelan; kamera parallax mengikuti kursor; klik di mana saja
  meledak jadi partikel. Pencahayaan: ambient + hemisphere + directional
  dengan bayangan lembut. Teks di atas langit gelap scene.
- **Fallback hero anti-kosong.** Gambar kota SVG (`assets/hero-city.svg`)
  tampil di belakang canvas secara default; JS menyembunyikannya hanya
  setelah SATU frame 3D berhasil dirender. Kalau WebGL/modul gagal, hero
  tidak pernah kosong. Status tercatat di `window.__world3d`.
- **Kategori: grid 3 kolom (bukan reel).** Reel diganti grid supaya keenam
  kartu selalu terlihat walau driver scroll gagal. Setiap kartu: visual
  gradasi + bangunan isometrik SVG (`assets/buildings/<slug>.svg`, dibuat
  dengan generator `scripts/gen-buildings.py`, tanpa foto stok), nomor 01-06,
  ikon Lucide, deskripsi, 3 chip, tombol "Lihat template". Hover: naik 6px +
  bayangan + border cyan. Tilt 3D (rotateX/Y maks 6-7 derajat) hanya di
  pointer halus + layar lebar; di HP tilt mati.
- **Cara kerja: 3 kartu kaca.** Nomor gradasi besar 01-03, ikon Lucide,
  judul + satu kalimat. Penutup: panel gradasi biru-cyan-ungu dengan tombol
  putih (teks navy).
- **Animasi: loader elegan + satu loop rAF.** Loader (logo + bar) hilang
  sendiri lewat CSS setelah 1.7 detik walau JS gagal; JS menyembunyikannya
  lebih cepat saat load. Satu loop rAF: progress bar + parallax hero
  (konten naik 56px dan memudar saat scroll). Reveal `data-reveal` via
  IntersectionObserver; tanpa JS semua terlihat (class `.js`).
- **Pencarian.** Filter langsung saat mengetik (data-cari + teks kartu);
  submit form (GET `?cari=`) ikut memfilter saat halaman dimuat; state kosong
  + tombol reset. Search tetap di hero, bukan di header.
- **Vendor lokal, tanpa CDN untuk JS.** Hanya `js/vendor/three.module.min.js`
  (three.js) via importmap. GSAP dan lottie-web tidak dipakai di build ini
  (tetap ada di `js/vendor/` dari build sebelumnya). Font dari Google Fonts.
  Tidak ada foto remote di homepage (semua visual SVG lokal).
- **Performa.** Hanya `transform` dan `opacity` yang dianimasikan; DPR
  dibatasi 2 (1.5 di HP); bintang lebih sedikit di HP; loop 3D berhenti
  saat hero tidak terlihat / tab tersembunyi; `prefers-reduced-motion`
  mematikan gerakan dan merender satu frame statis.
- **Mobile.** Grid 3 ke 2 ke 1 kolom; hero `100svh`; nav teks disembunyikan,
  CTA tetap; input search 16px (tidak zoom); tilt dan parallax mati.
- **Ikon: Lucide.** Semua ikon dari `assets/icons/` (satu gaya stroke).
  Tidak ada emoji atau glyph sebagai ikon.
- **Sloplint.** Perbaikan nyata diterapkan (overflow-x clip, minmax(0,1fr),
  text-wrap balance, tabular-nums, pause cue, :active). Di-waive karena
  brief user menuntutnya: gradasi + kaca, warna aksen kategori, tombol di
  dalam kartu, eyebrow sebelum h2, kata gradasi di judul hero (sekali),
  tombol putih di panel gradasi, skala spasi 2px, grid 3 kolom sama.
  Build ini mengikuti brief tertulis Iky, bukan deal Hallmark.

## Yang tidak dipakai di homepage ini (dan alasannya)

- **Foto stok (Wikimedia/Picsum).** Brief melarang foto stok yang tidak
  relevan; semua visual kategori sekarang SVG isometrik buatan sendiri.
- **Reel menyamping (scrolltide reel).** Diganti grid: di build Midnight,
  reel tidak bergerak di browser pengecek dan kartu 05-06 tidak terjangkau.
  Grid selalu menampilkan keenam kartu.
- **rembg** — tidak ada foto produk yang perlu dipotong latarnya.
- **Scrolltide library builds** — lisensinya melarang redistribusi sebagai
  template; yang dipakai hanya pola scroll-nya (MIT).
- **prototype** — arah desain sudah dipilih Iky (brief tertulis 22:42).
- **Vercel/deploy-to-vercel** — situs ini di-host di GitHub Pages; deploy
  Vercel urusan agent website nanti.
- **Canva** — untuk konten sosial/presentasi, bukan kode website.
