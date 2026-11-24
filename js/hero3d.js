// Hero 3D homepage: dunia miniatur mengambang — pulau dengan bangunan toko
// (kafe, butik, rumah, menara), pohon, lampu, awan, balon, dan bintang.
// Pulau berputar pelan, kamera mengikuti kursor, klik di mana saja meledak.
// Robust: kalau WebGL/modul gagal, gambar kota SVG di belakang tetap tampil
// (fallback hanya disembunyikan setelah SATU frame 3D berhasil dirender).
import * as THREE from 'three';

const canvas = document.getElementById('world');
const fallback = document.getElementById('hero-fallback');
window.__world3d = { ok: false, error: null };

if (canvas) {
  try {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, wide ? 2 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 5.6, wide ? 14.5 : 17);

    // ---- pencahayaan ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const hemi = new THREE.HemisphereLight(0x7dd3fc, 0x0a1128, 0.55);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d9, 1.9);
    sun.position.set(6, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8; sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8;
    sun.shadow.camera.far = 30;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x22d3ee, 0.5);
    rim.position.set(-7, 4, -6);
    scene.add(rim);

    // ---- pulau (panggung di bawah: teks hero hidup di langit gelap di atas) ----
    const world = new THREE.Group();
    world.position.y = -4.2;
    world.scale.setScalar(0.8);
    scene.add(world);

    const std = (c, r = 0.85, e = 0x000000, ei = 0) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: r, emissive: e, emissiveIntensity: ei });
    const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

    const top = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.5, 48), std(0xe8f1ff, 0.9));
    top.receiveShadow = true;
    world.add(top);
    const rimDisc = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.15, 0.35, 48), std(0x16224d, 0.9));
    rimDisc.position.y = -0.4;
    world.add(rimDisc);
    const under = new THREE.Mesh(new THREE.ConeGeometry(4.15, 2.8, 48), std(0x101a3a, 0.95));
    under.rotation.x = Math.PI;
    under.position.y = -1.95;
    world.add(under);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), std(0x22d3ee, 0.3, 0x22d3ee, 0.9));
    crystal.position.y = -3.6;
    world.add(crystal);

    // ---- bangunan ----
    function windows(mesh, w, h, d, n, y0) {
      const winMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
      for (let i = 0; i < n; i++) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.32), winMat);
        const x = n === 1 ? -w / 4 : -w / 2 + w * (0.22 + (0.56 * i) / (n - 1));
        win.position.set(x, y0, d / 2 + 0.012);
        mesh.add(win);
      }
    }
    function building(x, z, w, h, d, wall, roof, roofKind, ry = 0) {
      const g = new THREE.Group();
      g.position.set(x, 0.25, z);
      g.rotation.y = ry;
      const body = box(w, h, d, std(wall, 0.85));
      body.position.y = h / 2;
      body.castShadow = true; body.receiveShadow = true;
      g.add(body);
      if (roofKind === 'pyramid') {
        const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.78, h * 0.42 + 0.3, 4), std(roof, 0.8));
        r.position.y = h + (h * 0.42 + 0.3) / 2 - 0.02;
        r.rotation.y = Math.PI / 4;
        r.castShadow = true;
        g.add(r);
      } else {
        const cap = box(w + 0.16, 0.18, d + 0.16, std(roof, 0.8));
        cap.position.y = h + 0.09;
        cap.castShadow = true;
        g.add(cap);
      }
      windows(g, w, h, d, w > 1.2 ? 2 : 1, h * 0.62);
      const door = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.55), new THREE.MeshBasicMaterial({ color: 0x0a1128 }));
      door.position.set(0, 0.28, d / 2 + 0.012);
      g.add(door);
      world.add(g);
      return g;
    }

    // kafe (atap biru + awning), butik (ungu), rumah (cyan), toko (putih), menara (tinggi)
    const cafe = building(-2.4, 1.1, 1.5, 1.15, 1.2, 0xf4f7ff, 0x2f7bff, 'pyramid', 0.5);
    const awn = box(1.7, 0.08, 0.5, std(0x22d3ee, 0.8));
    awn.position.set(0, 0.72, 0.78); awn.rotation.x = 0.25; awn.castShadow = true;
    cafe.add(awn);
    building(2.5, 0.9, 1.35, 1.0, 1.1, 0xefe6ff, 0xa78bfa, 'flat', -0.4);
    building(0.4, -1.2, 1.25, 1.3, 1.05, 0xffe9c9, 0x22d3ee, 'pyramid', 0.1);
    building(-0.6, 2.3, 1.1, 0.9, 0.95, 0xe9f9ee, 0x3fae6a, 'flat', 0.9);
    building(1.2, -1.6, 1.0, 0.85, 0.9, 0xf4f7ff, 0x2f7bff, 'pyramid', -0.7);
    const tower = building(2.9, -0.8, 0.85, 1.3, 0.85, 0xdbeafe, 0x22d3ee, 'flat', 0.3);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), std(0x22d3ee, 0.3, 0x22d3ee, 1));
    tip.position.y = 1.6;
    tower.add(tip);
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), std(0x93a5cf, 0.6));
    antenna.position.y = 1.5;
    tower.add(antenna);

    // ---- pohon + lampu ----
    function tree(x, z, s = 1) {
      const g = new THREE.Group();
      g.position.set(x, 0.25, z);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * s, 0.12 * s, 0.5 * s, 8), std(0x8a6a3f, 0.9));
      trunk.position.y = 0.25 * s; trunk.castShadow = true;
      g.add(trunk);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.42 * s, 16, 16), std(0x34d399, 0.9));
      leaf.position.y = 0.75 * s; leaf.castShadow = true;
      g.add(leaf);
      world.add(g);
    }
    tree(-3.3, -0.9, 1); tree(3.4, 0.4, 0.85); tree(-1.6, -2.9, 0.9); tree(0.2, 2.9, 0.75);
    function lamp(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 0.25, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), std(0x16224d, 0.6));
      pole.position.y = 0.4;
      g.add(pole);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), std(0xffd166, 0.4, 0xffd166, 1));
      bulb.position.y = 0.86;
      g.add(bulb);
      world.add(g);
    }
    lamp(-1.4, 0.2); lamp(1.8, 1.9);

    // ---- awan + balon ----
    const clouds = [];
    function cloud(x, y, z, s) {
      const g = new THREE.Group();
      const m = std(0xffffff, 1);
      [[0, 0, 0, 0.5], [0.5, -0.06, 0.1, 0.38], [-0.5, -0.04, -0.05, 0.34]].forEach(([cx, cy, cz, r]) => {
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), m);
        s2.position.set(cx, cy, cz);
        g.add(s2);
      });
      g.position.set(x, y, z);
      g.scale.setScalar(s);
      g.userData = { x, y, s, ph: Math.random() * 6.28 };
      scene.add(g);
      clouds.push(g);
    }
    cloud(-5.5, 2.6, -3, 1.1); cloud(5.2, 3.4, -4, 1.3); cloud(4.6, 1.8, 2.5, 0.8); cloud(-4.8, 3.8, 1.5, 0.9);
    const balloon = new THREE.Group();
    const envelope = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), std(0xa78bfa, 0.7, 0xa78bfa, 0.25));
    envelope.scale.y = 1.15;
    balloon.add(envelope);
    const basket = box(0.28, 0.22, 0.28, std(0x8a6a3f, 0.9));
    basket.position.y = -0.85;
    balloon.add(basket);
    balloon.position.set(4.2, 2.2, -1.5);
    scene.add(balloon);

    // ---- bintang ----
    const starCount = wide ? 240 : 140;
    const starGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 14 + Math.random() * 14;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.6 - 1;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 4;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc9d6f2, size: 0.07, transparent: true, opacity: 0.85 }));
    scene.add(stars);

    // ---- ledakan klik ----
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2.6);
    const bursts = [];
    const burstCols = [0x22d3ee, 0x2f7bff, 0xa78bfa, 0xf4f7ff];
    function burst(point) {
      const n = 110;
      const geo = new THREE.BufferGeometry();
      const p = new Float32Array(n * 3);
      const vels = [];
      for (let i = 0; i < n; i++) {
        p[i * 3] = point.x; p[i * 3 + 1] = point.y; p[i * 3 + 2] = point.z;
        const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
        const sp = 1.6 + Math.random() * 2.4;
        vels.push(new THREE.Vector3(Math.sin(b) * Math.cos(a) * sp, Math.abs(Math.cos(b)) * sp * 0.9 + 0.8, Math.sin(b) * Math.sin(a) * sp));
      }
      geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const mat = new THREE.PointsMaterial({ color: burstCols[Math.floor(Math.random() * burstCols.length)], size: 0.09, transparent: true, opacity: 1 });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      bursts.push({ pts, vels, life: 1 });
    }

    // ---- ukuran ----
    function size() {
      const hero = canvas.parentElement;
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener('resize', size);

    // ---- interaksi ----
    let tx = 0, ty = 0, mx = 0, my = 0;
    if (fine && !reduced) {
      window.addEventListener('pointermove', (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
      canvas.parentElement.addEventListener('click', (e) => {
        const r = canvas.getBoundingClientRect();
        pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, hit)) burst(hit);
      });
    }

    // ---- loop ----
    let rafId = 0, renderedOnce = false, elapsed = 0;
    const clock = new THREE.Clock();
    function frame() {
      rafId = 0;
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      const t = elapsed;
      world.rotation.y += 0.0016;
      crystal.rotation.y += 0.01;
      crystal.position.y = -3.6 + Math.sin(t * 1.2) * 0.12;
      clouds.forEach((c) => {
        c.position.y = c.userData.y + Math.sin(t * 0.5 + c.userData.ph) * 0.18;
        c.position.x = c.userData.x + Math.sin(t * 0.16 + c.userData.ph) * 0.5;
      });
      balloon.position.y = 2.2 + Math.sin(t * 0.8) * 0.25;
      balloon.rotation.z = Math.sin(t * 0.5) * 0.06;
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      camera.position.x = mx * 0.9;
      camera.position.y = 5.6 - my * 0.4;
      camera.lookAt(0, -2.4, 0);
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        const arr = b.pts.geometry.attributes.position;
        for (let j = 0; j < b.vels.length; j++) {
          b.vels[j].y -= 2.2 * dt;
          arr.array[j * 3] += b.vels[j].x * dt;
          arr.array[j * 3 + 1] += b.vels[j].y * dt;
          arr.array[j * 3 + 2] += b.vels[j].z * dt;
        }
        arr.needsUpdate = true;
        b.life -= dt * 0.9;
        b.pts.material.opacity = Math.max(0, b.life);
        if (b.life <= 0) { scene.remove(b.pts); b.pts.geometry.dispose(); b.pts.material.dispose(); bursts.splice(i, 1); }
      }
      renderer.render(scene, camera);
      if (!renderedOnce) {
        renderedOnce = true;
        window.__world3d.ok = true;
        if (fallback) fallback.classList.add('gone');
      }
      if (rafId === 0) rafId = requestAnimationFrame(frame);
    }
    function start() {
      if (rafId === 0) rafId = requestAnimationFrame(frame);
      if (reduced) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        renderer.render(scene, camera);
        if (!renderedOnce) {
          renderedOnce = true;
          window.__world3d.ok = true;
          if (fallback) fallback.classList.add('gone');
        }
      }
    }
    function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())));
    io.observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
  } catch (err) {
    window.__world3d.error = String(err && err.message ? err.message : err);
  }
}
