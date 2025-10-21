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
const issRadius = 0.15;
const issGeometry = new THREE.SphereGeometry(issRadius, 16, 16);
const issMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xffffff, 
  emissive: 0xcccccc,
  emissiveIntensity: 0.3,
  metalness: 0.7, 
  roughness: 0.3 
});
const iss = new THREE.Mesh(issGeometry, issMaterial);
scene.add(iss);


const earthToISSDistance = 4.2;
const earthRotationSpeed = 0.05; 


earth.position.set(0, 0, 0); 
iss.position.set(0, 0, earthToISSDistance); 

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
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Only rotate Earth on its axis
  earth.rotation.y = elapsed * earthRotationSpeed;
  atmosphere.rotation.y = earth.rotation.y;

  renderer.render(scene, camera);
}
animate();
