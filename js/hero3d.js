// Hero 3D homepage: lapangan bentuk 3D yang melayang (bukan satu kristal),
// mengikuti arah kursor, klik di mana saja meledak (three.js lokal).
// Bentuk-bentuk hidup di bagian atas layar; teks hero duduk di tanah
// gelap di bawah. Tanpa WebGL, hero tetap tampil: canvas transparan.
import * as THREE from 'three';

const hero = document.getElementById('hero3d');
if (hero) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = window.matchMedia('(min-width: 768px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas: hero, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x02071d, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x02071d, 8, 20);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 60);
  camera.position.set(0, 1.2, 9);
  camera.lookAt(0, 1.4, 0);

  scene.add(new THREE.AmbientLight(0xe7f0f9, 0.6));
  const dir = new THREE.DirectionalLight(0xe7f0f9, 1.2);
  dir.position.set(5, 8, 6);
  scene.add(dir);
  const azure = new THREE.PointLight(0x6bcbf7, 24, 30, 2);
  azure.position.set(-4, 3, 2);
  scene.add(azure);

  // Lapangan bentuk: geometri campur, warna tinta/azure/paper-3
  const shapes = [];
  const geos = [
    () => new THREE.IcosahedronGeometry(0.55 + Math.random() * 0.5, 0),
    () => new THREE.OctahedronGeometry(0.55 + Math.random() * 0.5, 0),
    () => new THREE.TorusGeometry(0.5 + Math.random() * 0.4, 0.18 + Math.random() * 0.12, 12, 32),
    () => new THREE.TorusKnotGeometry(0.35 + Math.random() * 0.25, 0.12 + Math.random() * 0.08, 64, 8),
    () => new THREE.BoxGeometry(0.7 + Math.random() * 0.5, 0.7 + Math.random() * 0.5, 0.7 + Math.random() * 0.5),
    () => new THREE.SphereGeometry(0.45 + Math.random() * 0.4, 24, 16)
  ];
  const mats = [
    new THREE.MeshStandardMaterial({ color: 0xe7f0f9, metalness: 0.6, roughness: 0.35, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0xbddcf7, metalness: 0.7, roughness: 0.3, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x6bcbf7, metalness: 0.5, roughness: 0.4, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x0f1c37, metalness: 0.8, roughness: 0.25, flatShading: true })
  ];
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x6bcbf7, wireframe: true, transparent: true, opacity: 0.35 });
  for (let i = 0; i < 18; i++) {
    const geo = geos[i % geos.length]();
    const mesh = i % 4 === 3
      ? new THREE.Mesh(geo, wireMat)
      : new THREE.Mesh(geo, mats[i % mats.length]);
    mesh.position.set(
      (Math.random() - 0.5) * 12,
      0.8 + Math.random() * 3.7,
      -1 - Math.random() * 5
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      baseY: mesh.position.y,
      bob: 0.15 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      rs: 0.0015 + Math.random() * 0.003,
      rs2: 0.001 + Math.random() * 0.002
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Bintang: titik-titik dingin di latar
  const sCount = 420;
  const sPos = new Float32Array(sCount * 3);
  for (let i = 0; i < sCount; i++) {
    sPos[i * 3] = (Math.random() - 0.5) * 30;
    sPos[i * 3 + 1] = Math.random() * 10 - 1;
    sPos[i * 3 + 2] = -2 - Math.random() * 12;
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({
    color: 0xbddcf7, size: 0.03, transparent: true, opacity: 0.5, sizeAttenuation: true
  }));
  scene.add(stars);

  // Ledakan klik: awan partikel azure yang mekar dari titik klik
  const BURST_N = 140;
  const bPos = new Float32Array(BURST_N * 3);
  const bVel = new Float32Array(BURST_N * 3);
  let burstT = 1;
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  const burst = new THREE.Points(bGeo, new THREE.PointsMaterial({
    color: 0x6bcbf7, size: 0.06, transparent: true, opacity: 0, sizeAttenuation: true
  }));
  burst.visible = false;
  scene.add(burst);

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  let mx = 0, my = 0;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  hero.addEventListener('pointerdown', (e) => {
    const r = hero.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -(((e.clientY - r.top) / r.height) * 2 - 1)
    );
    raycaster.setFromCamera(ndc, camera);
    const origin = raycaster.ray.intersectPlane(plane, hit)
      ? hit.clone()
      : new THREE.Vector3(0, 1.5, 0);
    for (let i = 0; i < BURST_N; i++) {
      bPos[i * 3] = origin.x; bPos[i * 3 + 1] = origin.y; bPos[i * 3 + 2] = origin.z;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const sp = 1.2 + Math.random() * 2.2;
      bVel[i * 3] = Math.sin(ph) * Math.cos(th) * sp;
      bVel[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * sp;
      bVel[i * 3 + 2] = Math.cos(ph) * sp;
    }
    bGeo.attributes.position.needsUpdate = true;
    burst.visible = true;
    burstT = 0;
  });

  function resize() {
    const w = hero.clientWidth || 1, h = hero.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Satu loop animasi; dijaga supaya tidak pernah jalan ganda
  // (IntersectionObserver + visibilitychange bisa sama-sama memanggil).
  let rafId = 0;
  const clock = new THREE.Clock();
  function frame() {
    rafId = 0;
    const t = clock.getElapsedTime();
    shapes.forEach((m) => {
      m.rotation.x += m.userData.rs;
      m.rotation.y += m.userData.rs2;
      m.position.y = m.userData.baseY + Math.sin(t * 0.5 + m.userData.phase) * m.userData.bob;
    });
    stars.rotation.y += 0.0002;
    camera.position.x += (mx * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (1.2 - my * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(0, 1.4, 0);
    if (burstT < 1) {
      burstT = Math.min(1, burstT + 0.016);
      for (let i = 0; i < BURST_N; i++) {
        bPos[i * 3] += bVel[i * 3] * 0.016;
        bPos[i * 3 + 1] += bVel[i * 3 + 1] * 0.016;
        bPos[i * 3 + 2] += bVel[i * 3 + 2] * 0.016;
        bVel[i * 3] *= 0.97; bVel[i * 3 + 1] *= 0.97; bVel[i * 3 + 2] *= 0.97;
      }
      bGeo.attributes.position.needsUpdate = true;
      burst.material.opacity = 0.9 * (1 - burstT);
      if (burstT >= 1) burst.visible = false;
    }
    renderer.render(scene, camera);
    if (rafId === 0) rafId = requestAnimationFrame(frame);
  }
  function start() {
    if (rafId === 0) rafId = requestAnimationFrame(frame);
    if (reduced) {
      // Gerakan dimatikan: satu frame statis saja
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      renderer.render(scene, camera);
    }
  }
  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0 }).observe(hero);
  } else {
    start();
  }
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });
}
