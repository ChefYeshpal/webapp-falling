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
// scale: 1 scene unit = 1000 km

// just adding this so I remember this shii later
// Earth mean radius ~ 6371 km =  6.371 units
// ISS average altitude ~ 408 km = 0.408 units
const UNIT_KM = 1000.0;
const earthRadius = 6.371;
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

// Real ISS length ~108.5 meters
// 1 unit = 1000 km = 1,000,000 meters, so 108.5 m = 108.5 / 1e6 units
const REAL_ISS_LENGTH_M = 108.5;
const realIssLengthUnits = REAL_ISS_LENGTH_M / 1e6;

// Measure current model size and compute scale factor
const issBox = new THREE.Box3().setFromObject(iss);
const issSize = new THREE.Vector3();
issBox.getSize(issSize);
const modelMaxDim = Math.max(issSize.x, issSize.y, issSize.z) || 1.0;
const scaleToReal = realIssLengthUnits / modelMaxDim;


const ISS_VISUAL_SCALE = 2000;
let targetScale = scaleToReal * ISS_VISUAL_SCALE;

const ISS_ALTITUDE_KM = 408;
const issAltitude = ISS_ALTITUDE_KM / UNIT_KM;
const earthToISSDistance = earthRadius + issAltitude;

const issSphere = new THREE.Sphere();
issBox.getBoundingSphere(issSphere);
const modelRadius = issSphere.radius || (modelMaxDim * 0.5);
const minGap = 0.01;
const maxAllowedRadius = Math.max(0, issAltitude - minGap);
if (modelRadius * targetScale > maxAllowedRadius) {
  targetScale = maxAllowedRadius / (modelRadius || 1);
}

iss.scale.setScalar(targetScale);

// print ISS and camera placement in console
console.log('ISS scale:', iss.scale.x, 'ISS position (pre-placement):', iss.position.clone());

// console twerker for rotation, probs will never use this
window.setISSRotation = function(x, y, z) {
  if (typeof x === 'number') iss.rotation.x = x;
  if (typeof y === 'number') iss.rotation.y = y;
  if (typeof z === 'number') iss.rotation.z = z;
  console.log('ISS rotation set to', iss.rotation);
}

const earthRotationSpeed = 0.01; 
earth.position.set(0, 0, 0);
// tilt ISS orbit
const ISS_INCLINATION_DEG = 15.0; 
const ISS_RAAN_DEG = 0; 
const incRad = THREE.MathUtils.degToRad(ISS_INCLINATION_DEG);
const raanRad = THREE.MathUtils.degToRad(ISS_RAAN_DEG);
// longitude=0 in orbital plane
const tiltedPos = new THREE.Vector3(
  0,
  earthToISSDistance * Math.sin(incRad),
  earthToISSDistance * Math.cos(incRad)
);
tiltedPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), raanRad);
iss.position.copy(tiltedPos);

// sim control variables
let timeScale = 1;
let fallRate = 0.005;
const ATMOSPHERE_THICKNESS_KM = 100;
const atmosphereRadius = earthRadius + (ATMOSPHERE_THICKNESS_KM / UNIT_KM);
let burnStarted = false;
let burnTimer = 0;
const burnDuration = 120.0
let burnProgress = 0;
let gameOver = false;
let gameActive = false;
let baseBoostStrength = 0.01;
let boostStrength = baseBoostStrength;

// frosty
const freezeAltitudeThreshold = 0.70;
let freezeProgress = 0;
const freezeFillRate = 0.6;
const freezeRecoverRate = 0.3;
let freezeActive = false;
const reviveAltitudeThreshold = 0.35;
let frozeControlsLocked = false;
const burnCoolRate = 0.8;

// Spacebar control
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && gameActive && !gameOver) {
    e.preventDefault();
    const dir = new THREE.Vector3().subVectors(iss.position, earth.position).normalize();
    iss.position.addScaledVector(dir, boostStrength);
  }
});

// Enable game controls (dont want them to figure it out too early hehe)
window.startGame = function() {
  gameActive = true;
  console.log('Game controls activated');
};

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
const ORIGINAL_EARTH_TO_ISS = 4;
camera.position.set(0, 1, 15);
const origIssPos = new THREE.Vector3(0, 0, ORIGINAL_EARTH_TO_ISS);
const originalCameraToIssDist = camera.position.distanceTo(origIssPos);
const newIssPos = new THREE.Vector3().copy(iss.position);

const dirFromIssToCamera = new THREE.Vector3().subVectors(camera.position, newIssPos);
if (dirFromIssToCamera.lengthSq() === 0) {
  dirFromIssToCamera.set(0, 1, 1);
}
dirFromIssToCamera.normalize();
const CAMERA_ZOOM_FACTOR = 0.8; // higher = closer

let intendedCameraDist = originalCameraToIssDist * (1 - CAMERA_ZOOM_FACTOR);

// clamp so camera dont go inside ISS bounding sphere
const issBoundingSphere = new THREE.Sphere();
new THREE.Box3().setFromObject(iss).getBoundingSphere(issBoundingSphere);
const issRadiusWorld = issBoundingSphere.radius * iss.scale.x;
const cameraMinDist = issRadiusWorld + 0.2;
if (intendedCameraDist < cameraMinDist) intendedCameraDist = cameraMinDist;

// elsa and frozone should be a couple, totes matching
try {
  const frostGeo = new THREE.SphereGeometry(Math.max(issRadiusWorld * 1.05, 0.01), 16, 12);
  const frostMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0 });
  const frostShell = new THREE.Mesh(frostGeo, frostMat);
  frostShell.name = 'frostShell';
  iss.add(frostShell);
  iss.userData.frostShell = frostShell;
} catch (err) {
  console.warn('Could not create frost shell:', err);
}

camera.position.copy(newIssPos).addScaledVector(dirFromIssToCamera, intendedCameraDist);
camera.lookAt(iss.position);
console.log('Camera positioned at', camera.position.clone(), 'distance to ISS', camera.position.distanceTo(iss.position));

// camera offset
const cameraOffsetFromISS = new THREE.Vector3().subVectors(camera.position, iss.position);

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

  // Move ISS downward aka falling, that's the theme if you didn't know
  const issToEarth = iss.position.distanceTo(earth.position);

  // freezing mechanic: check altitude
  const altitude = Math.max(0, issToEarth - earthRadius);

  const escapedAtmosphere = burnStarted && issToEarth > atmosphereRadius + 0.05;
  if (escapedAtmosphere) {
    burnProgress = Math.max(0, burnProgress - burnCoolRate * dt);
    if (burnProgress <= 0.01) {
      burnStarted = false;
      burnTimer = 0;
      burnProgress = 0;
      console.log('Escaped atmosphere: burn cooled');
    }
  }
  
  if (altitude >= freezeAltitudeThreshold) {
    freezeProgress = Math.min(1, freezeProgress + freezeFillRate * dt);
    if (freezeProgress > 0.01 && !freezeActive) {
      freezeActive = true;
      try { window.fallingConsole && window.fallingConsole.showMessage('> Warning: thermal systems cooling'); } catch (e) {}
    }
  } else {
    freezeProgress = Math.max(0, freezeProgress - freezeRecoverRate * dt);
    if (freezeProgress <= 0 && freezeActive) {
      freezeActive = false;
      try { window.fallingConsole && window.fallingConsole.showMessage('> Thermal systems stabilizing'); } catch (e) {}
    }
  }

  boostStrength = baseBoostStrength * (1 - freezeProgress);


  const iceColor = new THREE.Color(0x66ccff);
  const burnColor = new THREE.Color(1.0, 0.35, 0.05);
  
  iss.traverse((child) => {
    if (child.isMesh) {
      if (!child.userData._origEmissive) child.userData._origEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
      if (!child.userData._origColor) child.userData._origColor = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff);
      const freezeWeight = freezeProgress * 0.9;
      const burnWeight = burnProgress * 0.9;
      const origWeight = Math.max(0, 1 - freezeWeight - burnWeight);

      if (child.material.emissive) {
        child.material.emissive.r = child.userData._origEmissive.r * origWeight + iceColor.r * freezeWeight + burnColor.r * burnWeight;
        child.material.emissive.g = child.userData._origEmissive.g * origWeight + iceColor.g * freezeWeight + burnColor.g * burnWeight;
        child.material.emissive.b = child.userData._origEmissive.b * origWeight + iceColor.b * freezeWeight + burnColor.b * burnWeight;
      }

      if (child.material.color) {
        const colorBlend = freezeWeight * 0.25 + burnWeight * 0.15;
        child.material.color.r = child.userData._origColor.r * (1 - colorBlend) + (iceColor.r * freezeWeight + burnColor.r * burnWeight) * 0.25;
        child.material.color.g = child.userData._origColor.g * (1 - colorBlend) + (iceColor.g * freezeWeight + burnColor.g * burnWeight) * 0.25;
        child.material.color.b = child.userData._origColor.b * (1 - colorBlend) + (iceColor.b * freezeWeight + burnColor.b * burnWeight) * 0.25;
      }
      
      if (child.material.emissiveIntensity !== undefined) {
        child.material.emissiveIntensity = 0.3 + burnProgress * 1.2;
      }
    
      const scaleFactor = 1 + burnProgress * 0.06;
      child.scale.x = scaleFactor;
      child.scale.y = scaleFactor;
      child.scale.z = scaleFactor;
    }
  });

  if (iss.userData && iss.userData.frostShell && iss.userData.frostShell.material) {
    iss.userData.frostShell.material.opacity = Math.min(0.75, freezeProgress * 0.7);
  }
  if (freezeProgress >= 0.995 && gameActive) {
    gameActive = false;
    frozeControlsLocked = true;
    try { window.fallingConsole && window.fallingConsole.showMessage('> Systems frozen: controls locked'); } catch (e) {}
  }


  if (frozeControlsLocked && altitude <= reviveAltitudeThreshold) {
    frozeControlsLocked = false;
    freezeProgress = 0;
    boostStrength = baseBoostStrength;
    gameActive = true;
    try { window.fallingConsole && window.fallingConsole.showMessage('> Systems restored: controls online'); } catch (e) {}
  }
  

  if (!gameOver) {
    const dir = new THREE.Vector3().subVectors(earth.position, iss.position).normalize();
    iss.position.addScaledVector(dir, fallRate * dt);
  }

  camera.position.copy(iss.position).add(cameraOffsetFromISS);
  camera.lookAt(iss.position);

  updateHUD(issToEarth);

  // atmosphere entry status
  if (!burnStarted && issToEarth <= atmosphereRadius + 0.02) {
    burnStarted = true;
    burnTimer = 0;
    burnProgress = 0;
    console.log('Burn started');
  }

  if (burnStarted && !escapedAtmosphere) {
    burnTimer += dt;
    burnProgress = Math.min(1, burnTimer / burnDuration);
  }

  renderer.render(scene, camera);
}
animate();
