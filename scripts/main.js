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

const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.08, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x6699ff,
  transparent: true,
  opacity: 0.15,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
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
    color: 0xe0e0e0,
    metalness: 0.6,
    roughness: 0.4
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


const earthToISSDistance = 4.2;
const earthRotationSpeed = 0.05; 
earth.position.set(0, 0, 0); 
iss.position.set(0, 0, earthToISSDistance); 

// Simulation control variables
let timeScale = 1; 
let fallRate = 0.005;
const atmosphereRadius = earthRadius * 1.08;
let burnStarted = false;
let burnTimer = 0;
const burnDuration = 15.0; 
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
  el.style.background = 'rgba(0,0,0,0.85)';
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
  if (gameOver) return; // stop the loop when game over
  requestAnimationFrame(animate);

  const dt = clock.getDelta() * timeScale; // scaled delta time
  const elapsed = clock.getElapsedTime() * timeScale;

  // Rotate Earth on its axis (use elapsed for smooth slow rotation)
  earth.rotation.y += earthRotationSpeed * dt;
  atmosphere.rotation.y = earth.rotation.y;

  // If burn already finished, show overlay and stop
  if (burnStarted && burnTimer >= burnDuration) {
    const overlay = ensureGameOverOverlay();
    overlay.style.visibility = 'visible';
    gameOver = true;
    console.log('Game over');
    return;
  }

  // Move ISS slowly downward (toward Earth center) to simulate decay
  const issToEarth = iss.position.distanceTo(earth.position);
  if (!burnStarted) {
    // move inward along current vector from earth to iss
    const dir = new THREE.Vector3().subVectors(earth.position, iss.position).normalize();
    iss.position.addScaledVector(dir, fallRate * dt);
  }

  // check for atmosphere entry
  if (!burnStarted && issToEarth <= atmosphereRadius + 0.05) {
    burnStarted = true;
    burnTimer = 0;
    console.log('Burn started');
  }

  // if burning, update visual effect and increment timer
  if (burnStarted) {
    burnTimer += dt;
    // simple burn: pulse emissive intensity on modules and panels
    const t = Math.sin(burnTimer * 10) * 0.5 + 0.5; // 0..1 pulse
    iss.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData._origEmissive) child.userData._origEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        if (child.material.emissive) {
          child.material.emissive.r = Math.min(1, child.userData._origEmissive.r + t * 0.8);
          child.material.emissive.g = Math.min(0.5, child.userData._origEmissive.g + t * 0.4);
          child.material.emissive.b = Math.min(0.2, child.userData._origEmissive.b + t * 0.2);
        }
        // slight scaling to look like overheating
        child.scale.x = 1 + t * 0.02;
        child.scale.y = 1 + t * 0.02;
        child.scale.z = 1 + t * 0.02;
      }
    });
  }

  renderer.render(scene, camera);
}
animate();
