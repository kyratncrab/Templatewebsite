# DESIGN.md — Katalog Template Website Toko

Sistem desain katalog ini. Ditulis dari koreksi Iky sendiri (learn-taste): setiap aturan
berasal dari kata-katanya, bukan dari selera umum. Aturan di sini mengikat build
berikutnya; kalau ada yang bertentangan, aturan Iky menang.

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
   ditautkan.
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

## Sistem (kombinasi tools)

- **Tema: Hallmark Midnight.** Biru tengah malam, tinta putih dingin, azure
  sebagai satu sinyal. Mona Sans: display 300 lebar 125%, body 400 lebar
  normal, satu keluarga dua lebar. Semua sudut kotak (radius 0). Tanpa
  grain, tanpa kaca/blur, tanpa gradasi, tanpa bloom.
- **Palet diverifikasi Leonardo.** Tinta 17.35:1, muted 8.36:1, azure 10.96:1,
  teks gelap di atas azure 10.65:1 (semua lulus WCAG). Token ada di `:root`
  `css/style.css`; jangan pakai warna literal di luar token.
- **Vendor lokal, tanpa CDN untuk JS.** `js/vendor/three.module.min.js`
  (three.js), `js/vendor/gsap.min.js` (GSAP), `js/vendor/lottie.min.js`
  (lottie-web). Importmap menunjuk file lokal. Font Google Fonts dan foto
  remote (Wikimedia/Picsum) tetap dari luar.
- **Hero: dunia 3D full-screen (scrolltide layers).** Canvas menutupi seluruh
  viewport; judul duduk di tanah gelap di bawah; bentuk-bentuk hidup di
  bagian atas. Tidak ada split hero, tidak ada scrim gradasi.
- **Kategori: reel menyamping (scrolltide reel).** Section menempel 340svh;
  scroll ke bawah menggeser kartu ke samping; kartu di garis fokus tajam dan
  penuh, sisanya redup dan mengecil; foto di dalam frame bergeser sedikit.
  Di HP, reel jadi geser horizontal biasa (scroll-snap).
- **Langkah: log malam.** Tiga baris bernomor dengan meter 2px yang terisi
  mengikuti scroll; langkah aktif tinta terang, sisanya redup.
- **Penutup: satu angka sebagai pernyataan.** Angka "6" besar + "gaya" +
  satu kalimat + tombol azure.
- **Scroll: satu loop rAF (scrolltide engine).** Progress bar + reel +
  meter log. Section lain memakai reveal `data-reveal` + `.is-in`, tetap
  terlihat tanpa JS. Tidak ada Lenis dan tidak ada ScrollTrigger — satu
  mesin scroll saja.
- **Gerakan: motion Premium.** Easing khas `cubic-bezier(0.4,0,0.2,1)`;
  durasi cepat 150ms, standar 350ms, lambat 600ms. Entrance hero satu
  gelombang: lead dulu, support menyusul, dekorasi hanya fade.
- **Koreografi (choreograph).** Satu entrance per container; stagger
  120ms di hero; interaksi tidak pernah diblokir animasi.
- **Performa (animation-performance + review-animations).** Hanya
  `transform` dan `opacity` yang dianimasikan; tidak ada `transition: all`;
  hover hanya di `@media (hover:hover) and (pointer:fine)`; `prefers-reduced-motion`
  mematikan gerakan (konten tetap terlihat, reel jadi daftar geser).
- **Mobile (mobile-native).** Hero `100svh`, `-webkit-tap-highlight-color`
  transparent, input 16px (tidak zoom), safe-area di header/footer.
- **Ikon: Lucide.** Semua ikon dari `assets/icons/` (satu gaya stroke).
  Tidak ada emoji atau glyph sebagai ikon.
- **3D: reanimate.** Dunia 3D mengikuti referensi "Website 3D Animasi":
  lapangan 18 bentuk geometri + bintang + kabut + klik meledak (raycast ke
  titik klik) + kamera parallax mengikuti kursor.
- **Performa (animation-performance + review-animations).** Hanya
  `transform` dan `opacity` yang dianimasikan; tidak ada `transition: all`;
  hover hanya di `@media (hover:hover) and (pointer:fine)`; `prefers-reduced-motion`
  mematikan gerakan (konten tetap terlihat).
- **Mobile (mobile-native).** Hero `100svh`, `-webkit-tap-highlight-color`
  transparent, input 16px (tidak zoom), safe-area di header/footer.
- **Ikon: Lucide.** Semua ikon dari `assets/icons/` (satu gaya stroke).
  Tidak ada emoji atau glyph sebagai ikon.
- **3D: reanimate.** Dunia 3D mengikuti referensi "Website 3D Animasi":
  lapangan 18 bentuk geometri + bintang + kabut + klik meledak (raycast ke
  titik klik) + kamera parallax mengikuti kursor.

## Yang tidak dipakai di homepage ini (dan alasannya)

- **rembg** — foto kategori adalah foto suasana, bukan produk yang perlu
  dipotong latarnya.
- **Scrolltide library builds** — lisensinya melarang redistribusi sebagai
  template; yang dipakai hanya pola scroll-nya (MIT).
- **prototype** — arah desain sudah dipilih Iky (gelap + 3D).
- **Vercel/deploy-to-vercel** — situs ini di-host di GitHub Pages; deploy
  Vercel urusan agent website nanti.
- **Canva** — untuk konten sosial/presentasi, bukan kode website.
