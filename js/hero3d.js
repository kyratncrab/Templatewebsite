// Hero 3D homepage: kristal melayang + cincin orbit + partikel,
// mengikuti arah kursor, klik meledak (three.js lokal di js/vendor/).
// Tanpa WebGL, hero tetap tampil: canvas transparan,
// teks terbaca lewat .hero-shade.
import * as THREE from 'three';

(function () {
  var canvas = document.getElementById('hero3d');
  var hero = document.getElementById('hero');
  if (!canvas || !hero || typeof THREE === 'undefined') return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 6, 6);
  scene.add(key);
  var gold = new THREE.PointLight(0xe89f92, 30, 30, 2);
  gold.position.set(-4, -2, 3);
  scene.add(gold);

  var world = new THREE.Group();
  scene.add(world);

  // Kristal utama + wireframe pink
  var crystal = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 0),
    new THREE.MeshStandardMaterial({ color: 0xefe7d8, metalness: 0.85, roughness: 0.18, flatShading: true })
  );
  world.add(crystal);
  var wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.62, 0),
    new THREE.MeshBasicMaterial({ color: 0xe89f92, wireframe: true, transparent: true, opacity: 0.28 })
  );
  world.add(wire);

  // Dua cincin orbit
  var rings = [];
  [[2.6, 0.5, 0.35], [3.15, -0.4, 1.1]].forEach(function (cfg, i) {
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg[0], 0.012, 8, 128),
      new THREE.MeshBasicMaterial({ color: 0xe89f92, transparent: true, opacity: i === 0 ? 0.5 : 0.32 })
    );
    ring.rotation.set(cfg[1], cfg[2], 0);
    ring.userData.spin = i === 0 ? 0.0016 : -0.0011;
    world.add(ring);
    rings.push(ring);
  });

  // Satelit kecil yang mengorbit
  var sats = [];
  for (var s = 0; s < 14; s++) {
    var sat = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.09 + Math.random() * 0.07, 0),
      new THREE.MeshStandardMaterial({ color: 0x9d9388, metalness: 0.7, roughness: 0.3, flatShading: true })
    );
    sat.userData = {
      r: 2.5 + Math.random() * 1.0,
      a: Math.random() * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.003,
      y: (Math.random() - 0.5) * 1.6
    };
    world.add(sat);
    sats.push(sat);
  }

  // Partikel debu pink
  var pCount = 320;
  var pos = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    var r = 3.2 + Math.random() * 4.5;
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    pos[i * 3 + 2] = r * Math.cos(ph) - 1;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xe89f92, size: 0.03, transparent: true, opacity: 0.45, sizeAttenuation: true
  }));
  scene.add(particles);

  // Ledakan klik: awan partikel yang mekar dari kristal lalu hilang
  var BURST_N = 140;
  var bPos = new Float32Array(BURST_N * 3);
  var bVel = new Float32Array(BURST_N * 3);
  var burstT = 1;
  var bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  var burst = new THREE.Points(bGeo, new THREE.PointsMaterial({
    color: 0xe89f92, size: 0.06, transparent: true, opacity: 0, sizeAttenuation: true
  }));
  burst.visible = false;
  scene.add(burst);

  // Kursor -> target rotasi
  var targetRX = 0, targetRY = 0, mx = 0, my = 0;
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
    targetRY = mx * 0.55;
    targetRX = -my * 0.35;
  });
  hero.addEventListener('pointerleave', function () { targetRX = 0; targetRY = 0; });

  // Klik -> denyut + ledakan partikel dari posisi kristal
  var pulse = 0;
  hero.addEventListener('pointerdown', function () {
    pulse = 1;
    var wp = new THREE.Vector3();
    crystal.getWorldPosition(wp);
    for (var i = 0; i < BURST_N; i++) {
      bPos[i * 3] = wp.x; bPos[i * 3 + 1] = wp.y; bPos[i * 3 + 2] = wp.z;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      var sp = 1.2 + Math.random() * 2.2;
      bVel[i * 3] = Math.sin(ph) * Math.cos(th) * sp;
      bVel[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * sp;
      bVel[i * 3 + 2] = Math.cos(ph) * sp;
    }
    bGeo.attributes.position.needsUpdate = true;
    burst.visible = true;
    burstT = 0;
  });

  function resize() {
    var w = hero.clientWidth, h = hero.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    world.position.x = camera.aspect > 1.1 ? 1.9 : 0;
    world.scale.setScalar(camera.aspect > 1.1 ? 1 : 0.72);
  }
  resize();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(hero);
  } else {
    window.addEventListener('resize', resize);
  }

  var clock = new THREE.Clock();
  var running = true;
  var rafId = 0;
  function frame() {
    if (!running) { rafId = 0; return; }
    rafId = requestAnimationFrame(frame);
    var t = clock.getElapsedTime();
    crystal.rotation.y += 0.0035;
    crystal.rotation.x += 0.0012;
    wire.rotation.y -= 0.002;
    wire.rotation.x += 0.0009;
    rings.forEach(function (ring) { ring.rotation.z += ring.userData.spin; });
    sats.forEach(function (sat) {
      var u = sat.userData;
      u.a += u.speed;
      sat.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t * 0.7 + u.a) * 0.15, Math.sin(u.a) * u.r);
      sat.rotation.x += 0.01;
      sat.rotation.y += 0.012;
    });
    particles.rotation.y += 0.0004;
    camera.position.x += (mx * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (-my * 0.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    if (burstT < 1) {
      burstT = Math.min(1, burstT + 0.016);
      for (var bi = 0; bi < BURST_N; bi++) {
        bPos[bi * 3] += bVel[bi * 3] * 0.016;
        bPos[bi * 3 + 1] += bVel[bi * 3 + 1] * 0.016;
        bPos[bi * 3 + 2] += bVel[bi * 3 + 2] * 0.016;
        bVel[bi * 3] *= 0.97; bVel[bi * 3 + 1] *= 0.97; bVel[bi * 3 + 2] *= 0.97;
      }
      bGeo.attributes.position.needsUpdate = true;
      burst.material.opacity = 0.9 * (1 - burstT);
      if (burstT >= 1) burst.visible = false;
    }
    world.rotation.y += (targetRY - world.rotation.y) * 0.12;
    world.rotation.x += (targetRX - world.rotation.x) * 0.12;
    world.position.y = Math.sin(t * 0.8) * 0.12;
    if (pulse > 0) {
      pulse = Math.max(0, pulse - 0.04);
      var s = 1 + Math.sin(pulse * Math.PI) * 0.12;
      crystal.scale.setScalar(s);
      wire.scale.setScalar(s);
    }
    renderer.render(scene, camera);
  }

  if (reduced) {
    // Satu frame diam, tanpa loop.
    resize();
    renderer.render(scene, camera);
    return;
  }

  // Jeda saat hero tidak terlihat / tab disembunyikan.
  // start() dijaga rafId supaya tidak pernah ada dua loop sekaligus.
  function start() { if (rafId) return; running = true; frame(); }
  function stop() { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }
  var visible = true;
  if (typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden) { start(); }
      else { stop(); }
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); }
    else if (visible) { start(); }
  });
  start();
})();
