import * as THREE from 'three';

//Sun corona 
export function coronaCreate(){
  const coronaGeo = new THREE.SphereGeometry(21, 32, 32);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.3,
  });
  const corona = new THREE.Mesh(coronaGeo, coronaMat);
  return corona;
}

// Saturn Rings 
export function ringCreate(texture){
  const ringGeo = new THREE.RingGeometry(0.5, 20, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.5;
  return ring;
}

export function asteroidBelt(asteroidTexture, distance, width, count, size){
  const belt = new THREE.Group();  
  const asteroidGeo = new THREE.SphereGeometry(1, 8, 8);
  const asteroidMat = new THREE.MeshStandardMaterial({ map: asteroidTexture });

  const asteroids = [];

  for (let i = 0; i < count; i++) {
    const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
    const angle = Math.random() * Math.PI * 2;
    const radius = distance + Math.random() * width;
    const speed = 0.0005 + Math.random() * 0.001;
    const y = (Math.random() - 0.5) * 3;

    asteroid.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );

    belt.add(asteroid);
    asteroids.push({ mesh: asteroid, angle, radius, speed, y });
  }

  return {
    belt,
    asteroids
  };
}