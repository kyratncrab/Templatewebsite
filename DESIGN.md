# DESIGN.md — Katalog Template Website Toko

Sistem desain katalog ini. Ditulis dari koreksi Iky sendiri (learn-taste): setiap aturan
berasal dari kata-katanya, bukan dari selera umum. Aturan di sini mengikat build
berikutnya; kalau ada yang bertentangan, aturan Iky menang.

## Aturan dari Iky

1. **Gelap, tanpa warna cerah.** (Iky, 2026-11-24: "jangan pake warna cerah")
   Latar near-black hangat `#141110`, tinta krem `#f3ede2`, satu sinyal ember
   `#d97b3f`. Tidak ada warna cerah lain di mana pun.
2. **Animasi dan 3D di homepage, supaya CS kagum.** (Iky, 2026-11-24: "manfaatkan
   gaya animasi dan 3d, soalnya misi kita ini membuat cs kagum dengan gaya
   website kita yang moderen dan animasi 3d")
   Hero memakai kristal three.js yang mengikuti kursor dan berdenyut saat
   diklik; scroll menggerakkan satu momen (statement kata-per-kata); entrance
   hero satu gelombang. Fokus homepage dulu.
3. **Lupakan Ragam Web, mulai dari 0.** (Iky, 2026-11-24: "lupakan ragam web")
   Tidak ada brand, harga, atau nomor WA di katalog ini.
4. **Jangan ada contoh template dulu.** (Iky, 2026-11-24: "jangan ada contoh
   template dulu, buat homepage yang bagus")
   Homepage saja yang tampil. File di `templates/` adalah draf yang belum
   ditautkan.

## Sistem (kombinasi tools)

- **Tema: Hallmark Kiln (ember).** Near-black, tinta krem, ember sebagai satu
  sinyal. Foto radius 28px, input radius 16px, tombol pil 50px. Tidak ada
  eyebrow/kicker di atas heading; label huruf biasa tanpa tracking.
- **Palet diverifikasi Leonardo.** Tinta 16.13:1, muted 8.00:1, ember 6.14:1,
  teks gelap di atas ember 6.01:1 (semua lulus WCAG). Token ada di `:root`
  `css/style.css`; jangan pakai warna literal di luar token.
- **Vendor lokal, tanpa CDN untuk JS.** `js/vendor/three.module.min.js`
  (three.js), `js/vendor/gsap.min.js` (GSAP), `js/vendor/lottie.min.js`
  (lottie-web). Importmap menunjuk file lokal. Font Google Fonts dan foto
  remote (Wikimedia/Picsum) tetap dari luar.
- **Scroll: satu momen (scrolltide).** Satu loop rAF menggerakkan progress
  bar dan highlight kata di statement. Section lain memakai reveal
  `data-reveal` + `.is-in`, tetap terlihat tanpa JS. Tidak ada Lenis dan
  tidak ada ScrollTrigger — satu mesin scroll saja.
- **Gerakan: motion Premium.** Easing khas `cubic-bezier(0.4,0,0.2,1)`;
  durasi cepat 150ms, standar 350ms, lambat 600ms. Entrance hero satu
  gelombang: lead dulu, support menyusul, dekorasi hanya fade.
- **Koreografi (choreograph).** Satu entrance per container; stagger
  120ms di hero; kartu stagger maks. 3 pertama; interaksi tidak pernah
  diblokir animasi.
- **Performa (animation-performance + review-animations).** Hanya
  `transform` dan `opacity` yang dianimasikan; tidak ada `transition: all`;
  hover hanya di `@media (hover:hover) and (pointer:fine)`; `prefers-reduced-motion`
  mematikan gerakan (konten tetap terlihat).
- **Mobile (mobile-native).** Hero `100svh`, `-webkit-tap-highlight-color`
  transparent, input 16px (tidak zoom), safe-area di header/footer.
- **Ikon: Lucide.** Semua ikon dari `assets/icons/` (satu gaya stroke).
  Tidak ada emoji atau glyph sebagai ikon.
- **3D: reanimate.** Hero 3D mengikuti referensi "Website 3D Animasi":
  kristal + cincin orbit + satelit + partikel + klik berdenyut + ikut kursor.

## Yang tidak dipakai di homepage ini (dan alasannya)

- **rembg** — foto kategori adalah foto suasana, bukan produk yang perlu
  dipotong latarnya.
- **Scrolltide library builds** — lisensinya melarang redistribusi sebagai
  template; yang dipakai hanya pola scroll-nya (MIT).
- **prototype** — arah desain sudah dipilih Iky (gelap + 3D).
- **Vercel/deploy-to-vercel** — situs ini di-host di GitHub Pages; deploy
  Vercel urusan agent website nanti.
- **Canva** — untuk konten sosial/presentasi, bukan kode website.
