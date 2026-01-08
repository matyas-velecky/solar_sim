import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CelestialObject from './CelestialObject.js';
import * as Light from './light.js';
import * as otherObj from './otherObjects.js';

let celestialObjects = [];
let textures = {};

const objectNames = [
  "sun","mercury","venus","earth","mars","jupiter",
  "saturn","uranus","neptune","pluto",
  "moon","deimos","phobos","io","ganimedes","europa","callisto"
];

let sizes = [40, 8.9 ,15.1 ,15.7 ,13.8 ,25 ,20.6 ,20.1 ,20.9 ,5.4 ,5.5 ,4.2 ,4.2 ,6.6 ,6.6 ,6.6 ,6.6];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);
camera.position.set(0, 200, 800);
camera.lookAt(0,0,0);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = true;
controls.enableZoom = true;
controls.target.set(0,0,0);
controls.update();

const textureLoader = new THREE.TextureLoader();
textures["sun"] = textureLoader.load('./textures/sun.jpg');
textures["earth"] = textureLoader.load('./textures/earth.jpg');
textures["moon"] = textureLoader.load('./textures/moon.jpg');
textures["mercury"] = textureLoader.load('./textures/mercury.jpg');
textures["venus"] = textureLoader.load('./textures/venus.jpg');
textures["mars"] = textureLoader.load('./textures/mars.jpg');
textures["deimos"] = textureLoader.load('./textures/asteroid.jpg');
textures["phobos"] = textureLoader.load('./textures/asteroid.jpg');
textures["saturn"] = textureLoader.load('./textures/saturn.jpg');
textures["jupiter"] = textureLoader.load('./textures/jupiter.jpg');
textures["io"] = textureLoader.load('./textures/io.jpg');
textures["ganimedes"] = textureLoader.load('./textures/ganimedes.jpg');
textures["europa"] = textureLoader.load('./textures/europa.jpg');
textures["callisto"] = textureLoader.load('./textures/callisto.jpg');
textures["uranus"] = textureLoader.load('./textures/uranus.jpg');
textures["neptune"] = textureLoader.load('./textures/neptune.jpg');
textures["pluto"] = textureLoader.load('./textures/pluto.jpg');

const asteroidTexture = textureLoader.load('./textures/asteroid.jpg');
const ringTexture = textureLoader.load('./textures/rings.png');

const sunLight = Light.pointLightCreate();
const ambientLight = Light.ambientLightCreate();
scene.add(sunLight);
scene.add(ambientLight);

const planetDistances = {
  1: 178, 2: 228, 3: 370, 4: 448, 5: 978,
  6: 1530, 7: 2970, 8: 4600, 9: 5000
};

//vytvareni planet a slunce
for (let i = 0; i < objectNames.length; i++) {
  const name = objectNames[i];
  const size = sizes[i];
  const texture = textures[name];
  const obj = new CelestialObject.Cobj(size, texture).create();
  celestialObjects.push(obj);
}

scene.add(celestialObjects[0]);
const corona = otherObj.coronaCreate();
scene.add(corona);

const ring = otherObj.ringCreate(ringTexture);
const asteroidBelt = otherObj.asteroidBelt(asteroidTexture, 500, 400, 1000,1);
const kuiperBelt  = otherObj.asteroidBelt(asteroidTexture, 5000, 7000, 5000,5);
scene.add(asteroidBelt.belt);
scene.add(kuiperBelt.belt);

const orbits = [];
for (let i = 1; i <= 9; i++) {
  const orbit = new THREE.Group();
  scene.add(orbit);
  orbit.add(celestialObjects[i]);
  celestialObjects[i].position.set(planetDistances[i], 0, 0);
  if (i === 6) celestialObjects[i].add(ring);
  orbits[i] = orbit;
}

const earthMoonOrbit = new THREE.Group();
celestialObjects[3].add(earthMoonOrbit);
celestialObjects[10].position.set(18,0,0);
earthMoonOrbit.add(celestialObjects[10]);

const phobosOrbit = new THREE.Group();
const deimosOrbit = new THREE.Group();
celestialObjects[4].add(phobosOrbit);
celestialObjects[4].add(deimosOrbit);
celestialObjects[12].position.set(16,0,0);
celestialObjects[11].position.set(18,0,0);
phobosOrbit.add(celestialObjects[12]);
deimosOrbit.add(celestialObjects[11]);

const IoOrbit = new THREE.Group();
const GanymedesOrbit = new THREE.Group();
const EuropaOrbit = new THREE.Group();
const CalistoOrbit = new THREE.Group();
celestialObjects[5].add(IoOrbit, GanymedesOrbit, EuropaOrbit, CalistoOrbit);
celestialObjects[13].position.set(32,0,0);
celestialObjects[14].position.set(33,0,0);
celestialObjects[15].position.set(35,0,0);
celestialObjects[16].position.set(37,0,0);
IoOrbit.add(celestialObjects[13]);
GanymedesOrbit.add(celestialObjects[14]);
EuropaOrbit.add(celestialObjects[15]);
CalistoOrbit.add(celestialObjects[16]);

const orbitSpeeds = {
  1:0.03,2:0.02,3:0.01,4:0.009,
  5:0.003,6:0.005,7:0.001,8:0.0009,9:0.0007
};

function animate() {
  celestialObjects[0].rotation.y += 0.02;
  
  for (let i = 1; i <= 9; i++) {
    if (orbits[i]) {
      orbits[i].rotation.y += orbitSpeeds[i];
    }
  }

  for (let i = 1; i < celestialObjects.length; i++) {
    celestialObjects[i].rotation.y += 0.01;
  }

  earthMoonOrbit.rotation.y += 0.01;
  phobosOrbit.rotation.y += 0.01;
  deimosOrbit.rotation.y += 0.01;

  IoOrbit.rotation.y += 0.01;
  GanymedesOrbit.rotation.y += 0.01;
  EuropaOrbit.rotation.y += 0.01;
  CalistoOrbit.rotation.y += 0.01;

  asteroidBelt.asteroids.forEach(a=>{
    a.angle+=a.speed;
    a.mesh.position.x=Math.cos(a.angle)*a.radius;
    a.mesh.position.z=Math.sin(a.angle)*a.radius;
    a.mesh.position.y=a.y;
  });

  kuiperBelt.asteroids.forEach(a=>{
    a.angle+=a.speed;
    a.mesh.position.x=Math.cos(a.angle)*a.radius;
    a.mesh.position.z=Math.sin(a.angle)*a.radius;
    a.mesh.position.y=a.y;
  });

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
