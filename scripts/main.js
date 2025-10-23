import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// bg
function createStarField() {
  const starCount = 3000;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < starCount; i++) {
    const r = 200 + Math.random() * 800;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 });
  return new THREE.Points(geometry, material);
}
scene.add(createStarField());

// earth
const earthRadius = 3;
const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r155/examples/textures/planets/earth_atmos_2048.jpg');
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  shininess: 5,
  specular: 0x333333,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);


const atmosphere = new THREE.Group();
const atmosphereColor = 0x6699ff;
const atmosphereLayers = [
  { scale: 1.05, opacity: 0.12 },
  { scale: 1.10, opacity: 0.08 },
  { scale: 1.15, opacity: 0.04 }
];
for (let i = 0; i < atmosphereLayers.length; i++) {
  const layer = atmosphereLayers[i];
  const geo = new THREE.SphereGeometry(earthRadius * layer.scale, 64, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: atmosphereColor,
    transparent: true,
    opacity: layer.opacity,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 10 + i;
  atmosphere.add(mesh);
}
scene.add(atmosphere);

const sunlight = new THREE.DirectionalLight(0xffffff, 1.2);
sunlight.position.set(15, 5, 10);
scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
scene.add(ambientLight);

// ISS
function createISS() {
  const issGroup = new THREE.Group();
  
    const moduleMaterial = new THREE.MeshStandardMaterial({
      color: 0xBABABA,
    metalness: 0.18,
    roughness: 0.65,
    envMapIntensity: 0.4
  });

  const solarPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a3a6b,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x0a1a3b,
    emissiveIntensity: 0.3
  });

  // Central truss (main spine)
  const trussGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8);
  const truss = new THREE.Mesh(trussGeometry, moduleMaterial);
  truss.rotation.z = Math.PI / 2;
  issGroup.add(truss);

  const panelTilt = 0.25;

  // Main modules
  const moduleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16);
  
  const module1 = new THREE.Mesh(moduleGeometry, moduleMaterial);
  module1.rotation.z = Math.PI / 2;
  module1.position.x = -0.25;
  issGroup.add(module1);

  const module2 = new THREE.Mesh(moduleGeometry, moduleMaterial);
  module2.rotation.z = Math.PI / 2;
  module2.position.x = 0.25;
  issGroup.add(module2);

  const endSphereGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const endSphereMaterial = moduleMaterial;
  const moduleHalf = 0.35 /2;

  const m1Inner = new THREE.Mesh(endSphereGeo, endSphereMaterial);
  m1Inner.position.set(module1.position.x + moduleHalf *0.95, 0, 0);
  issGroup.add(m1Inner);
  const m1Outer = new THREE.Mesh(endSphereGeo, endSphereMaterial);
  m1Outer.position.set(module1.position.x - moduleHalf * 0.95, 0, 0);
  issGroup.add(m1Outer);

  const m2Inner = new THREE.Mesh(endSphereGeo, endSphereMaterial);
  m2Inner.position.set(module2.position.x - moduleHalf * 0.95, 0, 0);
  issGroup.add(m2Inner);
  const m2Outer = new THREE.Mesh(endSphereGeo, endSphereMaterial);
  m2Outer.position.set(module2.position.x + moduleHalf * 0.95, 0, 0);
  issGroup.add(m2Outer);

  // Solar panel
  const panelGeometry = new THREE.BoxGeometry(0.6, 0.01, 0.25);
  
  const leftPanel1 = new THREE.Mesh(panelGeometry, solarPanelMaterial);
  leftPanel1.position.set(-0.5, 0.35, 0);
  leftPanel1.rotation.z = Math.PI / 2;
  leftPanel1.rotateOnAxis(new THREE.Vector3(1, 0, 0), panelTilt);
  issGroup.add(leftPanel1);
  
  const leftPanel2 = new THREE.Mesh(panelGeometry, solarPanelMaterial);
  leftPanel2.position.set(-0.5, -0.35, 0);
  leftPanel2.rotation.z = -Math.PI / 2;
  leftPanel2.rotateOnAxis(new THREE.Vector3(1, 0, 0), panelTilt);
  issGroup.add(leftPanel2);

  const rightPanel1 = new THREE.Mesh(panelGeometry, solarPanelMaterial);
  rightPanel1.position.set(0.5, 0.35, 0);
  rightPanel1.rotation.z = Math.PI / 2;
  rightPanel1.rotateOnAxis(new THREE.Vector3(1, 0, 0), panelTilt);
  issGroup.add(rightPanel1);
  
  const rightPanel2 = new THREE.Mesh(panelGeometry, solarPanelMaterial);
  rightPanel2.position.set(0.5, -0.35, 0);
  rightPanel2.rotation.z = -Math.PI / 2;
  rightPanel2.rotateOnAxis(new THREE.Vector3(1, 0, 0), panelTilt);
  issGroup.add(rightPanel2);

  return issGroup;
}

const iss = createISS();
scene.add(iss);

iss.rotation.x = 0.22;
iss.rotation.y = 0.5;

// console twerker for rotation, probs will never use this
window.setISSRotation = function(x, y, z) {
  if (typeof x === 'number') iss.rotation.x = x;
  if (typeof y === 'number') iss.rotation.y = y;
  if (typeof z === 'number') iss.rotation.z = z;
  console.log('ISS rotation set to', iss.rotation);
}

const earthToISSDistance = 4;
const earthRotationSpeed = 0.01; 
earth.position.set(0, 0, 0); 
iss.position.set(0, 0, earthToISSDistance); 

// Simulation control variables
let timeScale = 1;
let fallRate = 0.005;
const atmosphereRadius = earthRadius * 1.0001;
let burnStarted = false;
let burnTimer = 0;
const burnDuration = 120.0
let gameOver = false;

function ensureGameOverOverlay() {
  let el = document.getElementById('gameOverOverlay');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'gameOverOverlay';
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '100vw';
  el.style.height = '100vh';
  el.style.display = 'none';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.background = 'rgba(0,0,0,0.50)';
  el.style.color = '#fff';
  el.style.fontSize = '64px';
  el.style.fontFamily = 'Arial, sans-serif';
  el.style.zIndex = '9999';
  el.style.textAlign = 'center';
  el.innerText = 'GAME OVER';
  el.style.pointerEvents = 'none';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.gap = '10px';
  el.style.visibility = 'hidden';
  document.body.appendChild(el);
  return el;
}

window.increaseSpeed = function(factor) {
  if (typeof factor !== 'number' || factor <= 0) {
    console.warn('increaseSpeed expects a positive number.');
    return;
  }
  timeScale = factor;
  console.log('Simulation speed set to', factor, 'x');
}

// altitude bar
function ensureHUD() {
  if (document.getElementById('altitudeHud')) return;
  const hud = document.createElement('div');
  hud.id = 'altitudeHud';
  hud.style.position = 'fixed';
  hud.style.right = '18px';
  hud.style.bottom = '10px';
  hud.style.width = '36px';
  hud.style.height = '50vh';
  hud.style.display = 'flex';
  hud.style.alignItems = 'flex-end';
  hud.style.justifyContent = 'center';
  hud.style.zIndex = '9998';

  const bar = document.createElement('div');
  bar.style.position = 'relative';
  bar.style.width = '18px';
  bar.style.height = '100%';
  bar.style.borderRadius = '9px';
  bar.style.overflow = 'hidden';
  bar.style.backdropFilter = 'blur(4px)';
  bar.style.background = 'linear-gradient(to top, rgba(80,150,240,0.35) 0%, rgba(120,200,120,0.28) 50%, rgba(240,160,160,0.28) 100%)';
  bar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.4)';
  bar.style.border = '1px solid rgba(200,200,200,0.25)';

  const pointer = document.createElement('div');
  pointer.id = 'hudPointer';
  pointer.style.position = 'absolute';
  pointer.style.left = '-0px';
  pointer.style.width = '0';
  pointer.style.height = '0';
  pointer.style.borderTop = '8px solid transparent';
  pointer.style.borderBottom = '8px solid transparent';
  pointer.style.borderRight = '10px solid rgba(255,255,255,0.95)';
  pointer.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
  pointer.style.transform = 'translateY(-50%)';
  
  const label = document.createElement('div');
  label.id = 'hudLabel';
  label.style.position = 'absolute';
  label.style.top = '-28px';
  label.style.left = '-10px';
  label.style.width = '64px';
  label.style.color = 'rgba(255,255,255,0.95)';
  label.style.fontSize = '12px';
  label.style.textAlign = 'left';
  label.style.pointerEvents = 'none';

  bar.appendChild(pointer);
  hud.appendChild(bar);
  hud.appendChild(label);
  document.body.appendChild(hud);
}

function updateHUD(distance) {
  ensureHUD();
  const hud = document.getElementById('altitudeHud');
  const bar = hud.querySelector('div');
  const pointer = document.getElementById('hudPointer');
  const label = document.getElementById('hudLabel');
  const altitude = Math.max(0, distance - earthRadius);
  const initAlt = Math.max(0.0001, earthToISSDistance - earthRadius);
  // so that initial alt maps at middle of HUD
  const maxAlt = Math.max(initAlt * 2, initAlt + 0.1);
  const clampedAlt = Math.max(0, Math.min(maxAlt, altitude));
  const norm = clampedAlt / maxAlt; // 0..1 (0=surface/top, 1=far/bottom)


  const barRect = bar.getBoundingClientRect();
  if (barRect.height > 0) {
    const topPx = norm * barRect.height;
    const ptr = pointer;
    if (!ptr.style.transition) ptr.style.transition = 'top 0.12s linear';
    ptr.style.top = `${topPx}px`;
  }

  
  label.innerText = `${altitude.toFixed(2)} u`;
}

ensureHUD();

// camera and stuff
camera.position.set(0, 1, 15);
camera.lookAt(iss.position);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate(){
  if (gameOver) return;
  requestAnimationFrame(animate);

  const dt = clock.getDelta() * timeScale;
  const elapsed = clock.getElapsedTime() * timeScale;

  // Rotate Earth on its axis
  earth.rotation.y += earthRotationSpeed * dt;
  atmosphere.rotation.y = earth.rotation.y;

  if (burnStarted && burnTimer >= burnDuration) {
    const overlay = ensureGameOverOverlay();
    overlay.style.visibility = 'visible';
    gameOver = true;
    console.log('Game over');
    return;
  }

  // Move ISS downward
  const issToEarth = iss.position.distanceTo(earth.position);
  if (!burnStarted) {
    const dir = new THREE.Vector3().subVectors(earth.position, iss.position).normalize();
    iss.position.addScaledVector(dir, fallRate * dt);
  }

  updateHUD(issToEarth);

  // check for atmosphere entry
    if (!burnStarted && issToEarth <= atmosphereRadius + 0.02) {
    burnStarted = true;
    burnTimer = 0;
    console.log('Burn started');
  }

  if (burnStarted) {
    burnTimer += dt;
    const progress = Math.min(1, burnTimer / burnDuration); // 0..1

    const target = new THREE.Color(1.0, 0.35, 0.05);

    iss.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData._origEmissive) child.userData._origEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        if (!child.userData._origColor) child.userData._origColor = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff);

        if (child.material.emissive) {
          child.material.emissive.r = child.userData._origEmissive.r + (target.r - child.userData._origEmissive.r) * progress;
          child.material.emissive.g = child.userData._origEmissive.g + (target.g - child.userData._origEmissive.g) * progress;
          child.material.emissive.b = child.userData._origEmissive.b + (target.b - child.userData._origEmissive.b) * progress;
        }

        if (child.material.color) {
          child.material.color.r = child.userData._origColor.r * (1 - 0.15 * progress) + target.r * 0.15 * progress;
          child.material.color.g = child.userData._origColor.g * (1 - 0.10 * progress) + target.g * 0.10 * progress;
          child.material.color.b = child.userData._origColor.b * (1 - 0.05 * progress) + target.b * 0.05 * progress;
        }

        if (child.material.emissiveIntensity !== undefined) child.material.emissiveIntensity = 0.3 + progress * 1.2;

        const scaleFactor = 1 + progress * 0.06;
        child.scale.x = scaleFactor;
        child.scale.y = scaleFactor;
        child.scale.z = scaleFactor;
      }
    });
  }

  renderer.render(scene, camera);
}
animate();
