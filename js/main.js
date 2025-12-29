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
  "moon","deimos","phobos","io","ganymedes","europa","calisto"
];

let sizes = [20, 2.9 ,9.1 ,9.7 ,3.8 ,11 ,8.6 ,4.1 ,3.9 ,2.4 ,2.5 ,0.02 ,0.01 ,3.6 ,0.31 ,0.53 ,0.48];

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
renderer.setSize(window.innerWidth/1.05, window.innerHeight/1.05);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = true;
controls.enableZoom = true;
controls.target.set(0,0,0);
controls.update();

const textureLoader = new THREE.TextureLoader();
textures["sun"] = textureLoader.load('../textures/sun.jpg');
textures["earth"] = textureLoader.load('../textures/earth.jpg');
textures["moon"] = textureLoader.load('../textures/moon.jpg');
textures["mercury"] = textureLoader.load('../textures/mercury.jpg');
textures["venus"] = textureLoader.load('../textures/venus.jpg');
textures["mars"] = textureLoader.load('../textures/mars.jpg');
textures["saturn"] = textureLoader.load('../textures/saturn.jpg');
textures["jupiter"] = textureLoader.load('../textures/jupiter.jpg');
textures["io"] = textureLoader.load('../textures/io.jpg');
textures["ganymedes"] = textureLoader.load('../textures/ganimedes.jpg');
textures["europa"] = textureLoader.load('../textures/europa.jpg');
textures["calisto"] = textureLoader.load('../textures/calisto.jpg');
textures["uranus"] = textureLoader.load('../textures/uranus.jpg');
textures["neptune"] = textureLoader.load('../textures/neptune.jpg');
textures["pluto"] = textureLoader.load('../textures/pluto.jpg');

const asteroidTexture = textureLoader.load('../textures/asteroid.jpg');
const ringTexture = textureLoader.load('../textures/rings.png');

const sunLight = Light.pointLightCreate();
const ambientLight = Light.ambientLightCreate();
scene.add(sunLight);
scene.add(ambientLight);

const planetDistances = {
  1: 58, 2: 108, 3: 150, 4: 228, 5: 778,
  6: 1430, 7: 2870, 8: 4500, 9: 5900
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
const asteroidBelt = otherObj.asteroidBelt(asteroidTexture, 240, 400, 1000,1);
const kuiperBelt  = otherObj.asteroidBelt(asteroidTexture, 5980, 7000, 5000,5);
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
celestialObjects[10].position.set(3,0,0);
earthMoonOrbit.add(celestialObjects[10]);

const phobosOrbit = new THREE.Group();
const deimosOrbit = new THREE.Group();
celestialObjects[4].add(phobosOrbit);
celestialObjects[4].add(deimosOrbit);
celestialObjects[12].position.set(3,0,0);
celestialObjects[11].position.set(5,0,0);
phobosOrbit.add(celestialObjects[12]);
deimosOrbit.add(celestialObjects[11]);

const IoOrbit = new THREE.Group();
const GanymedesOrbit = new THREE.Group();
const EuropaOrbit = new THREE.Group();
const CalistoOrbit = new THREE.Group();
celestialObjects[5].add(IoOrbit, GanymedesOrbit, EuropaOrbit, CalistoOrbit);
celestialObjects[13].position.set(5,0,0);
celestialObjects[14].position.set(7,0,0);
celestialObjects[15].position.set(9,0,0);
celestialObjects[16].position.set(10,0,0);
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

  earthMoonOrbit.rotation.y += 0.02;
  phobosOrbit.rotation.y += 0.04;
  deimosOrbit.rotation.y += 0.03;

  IoOrbit.rotation.y += 0.03;
  GanymedesOrbit.rotation.y += 0.04;
  EuropaOrbit.rotation.y += 0.05;
  CalistoOrbit.rotation.y += 0.06;

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