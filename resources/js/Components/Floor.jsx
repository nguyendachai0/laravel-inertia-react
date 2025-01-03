import * as THREE from 'three';

const Floor = (scene) => {
    const floorTexture = new THREE.TextureLoader().load(
        'backrooms-textures-v0-mbq1c28sjhk91.webp'
    );

    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(16, 16);

    // Floor Material: grayish, like worn carpet
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture, // Apply the texture
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.set(10, 0, 10); // You can adjust the position as needed
    scene.add(floor);
};

export default Floor;
