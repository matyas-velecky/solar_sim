import * as THREE from 'three';

// Sun Light
export function pointLightCreate(){
    const sunLight = new THREE.PointLight(0xffffff, 2, 0); 
    sunLight.position.set(0, 0, 0);
    return sunLight;
}
// Ambient Light
export function ambientLightCreate(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    return ambientLight;
}