import * as THREE from 'three';
export class Cobj{
    constructor(size, texture){
        this.size = size;
        this.texture = texture;
        this.camera = null;
    }
    
    create(){
        const Geo = new THREE.SphereGeometry(this.size, 32, 32);
        const Mat = new THREE.MeshStandardMaterial({
            map: this.texture,
        });
        const CO = new THREE.Mesh(Geo, Mat);
        return CO;
    }
}