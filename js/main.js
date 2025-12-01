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

let sizes = [139,0.49,1.21,1.27,0.68,14,11.6,5.1,4.9,0.24,0.35,0.002,0.001,0.36,0.31,0.53,0.48];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200000
);
camera.position.set(0, 0, 0);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0,0,0);
controls.update();

const textureLoader = new THREE.TextureLoader();
textures["sun"] = textureLoader.load('/textures/sun.jpg');
textures["earth"] = textureLoader.load('/textures/earth.jpg');
textures["moon"] = textureLoader.load('/textures/moon.jpg');
textures["mercury"] = textureLoader.load('/textures/mercury.jpg');
textures["venus"] = textureLoader.load('/textures/venus.jpg');
textures["mars"] = textureLoader.load('/textures/mars.jpg');
textures["saturn"] = textureLoader.load('/textures/saturn.jpg');
textures["jupiter"] = textureLoader.load('/textures/jupiter.jpg');
textures["io"] = textureLoader.load('/textures/io.jpg');
textures["ganymedes"] = textureLoader.load('/textures/ganimedes.jpg');
textures["europa"] = textureLoader.load('/textures/europa.jpg');
textures["calisto"] = textureLoader.load('/textures/calisto.jpg');
textures["uranus"] = textureLoader.load('/textures/uranus.jpg');
textures["neptune"] = textureLoader.load('/textures/neptune.jpg');
textures["pluto"] = textureLoader.load('/textures/pluto.jpg');

const asteroidTexture = textureLoader.load('/textures/asteroid.jpg');
const ringTexture = textureLoader.load('/textures/rings.png');

const sunLight = Light.pointLightCreate();
const ambientLight = Light.ambientLightCreate();
scene.add(sunLight);
scene.add(ambientLight);

const planetDistances = {
  1: 580, 2: 1080, 3: 1500, 4: 2280, 5: 7780,
  6: 14300, 7: 28700, 8: 45000, 9: 59000
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
const asteroidBelt = otherObj.asteroidBelt(asteroidTexture, 3000, 2000, 2000);
const kuiperBelt  = otherObj.asteroidBelt(asteroidTexture, 45000, 30000, 10000);
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

for(let obj of celestialObjects){
  const cameraHolder = new THREE.Object3D();
  obj.add(cameraHolder);
  
  obj.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    200000
  );
  obj.camera.position.set(20, 0, 0);
  obj.camera.lookAt(0, 0, 0);
  cameraHolder.add(obj.camera);
  obj.cameraHolder = cameraHolder;
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

let activeCamera = camera;

function cameraSwitch(obj){
  activeCamera = obj.camera;
  controls.object = activeCamera;
  controls.enablePan = false;
  controls.update();
}

const sunBtn = document.getElementById('sunAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[0]));
const mercuryBtn = document.getElementById('mercuryAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[1]));
const venusBtn = document.getElementById('venusAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[2]));
const earthBtn = document.getElementById('earthAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[3]));
const marsBtn = document.getElementById('marsAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[4]));
const jupiterBtn = document.getElementById('jupiterAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[5]));
const saturnBtn = document.getElementById('saturnAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[6]));
const uranusBtn = document.getElementById('uranusAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[7]));
const neptuneBtn = document.getElementById('neptuneAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[8]));
const plutoBtn = document.getElementById('plutoAlign').addEventListener('click',()=>cameraSwitch(celestialObjects[9]));

const orbitSpeeds = {
  1:0.003,2:0.002,3:0.001,4:0.0009,
  5:0.0003,6:0.0005,7:0.0001,8:0.00009,9:0.00007
};

function animate() {
  celestialObjects[0].rotation.y += 0.02;

  if (celestialObjects[0].cameraHolder) {
    celestialObjects[0].cameraHolder.rotation.y -= 0.02;
  }

  for (let i = 1; i <= 9; i++) {
    celestialObjects[i].rotation.y += 0.01;
    celestialObjects[i].cameraHolder.rotation.y -= 0.01;
    orbits[i].rotation.y += orbitSpeeds[i];
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
  renderer.render(scene, activeCamera);
}

renderer.setAnimationLoop(animate);