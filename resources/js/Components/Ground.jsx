import * as THREE from 'three';

const createGround = (scene) => {
    // Large ground from createWallsWithBoards
    const largeGroundTexture = new THREE.TextureLoader().load("ground-water-level-backroom (1).jpg");
    largeGroundTexture.wrapS = THREE.RepeatWrapping;
    largeGroundTexture.wrapT = THREE.RepeatWrapping;

    const desiredTileCount = 500; // Number of tiles for the ground

    // Adjust the texture repeat based on the desired tile count
    largeGroundTexture.repeat.set(desiredTileCount, desiredTileCount);

    const groundSize = 600; // Total size of the ground
    const largeGroundMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: largeGroundTexture,
        roughness: 2,
    });

    const largeGroundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    const largeGround = new THREE.Mesh(largeGroundGeometry, largeGroundMaterial);

    // Rotate and position the large ground
    largeGround.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat
    largeGround.position.y = 0; // Base ground height
    scene.add(largeGround);

    // Smaller floor from Floor
    const floorTexture = new THREE.TextureLoader().load("backrooms-textures-v0-mbq1c28sjhk91.webp");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(16, 16);

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture, // Apply the texture
        side: THREE.DoubleSide,
    });

    const floorGeometry = new THREE.PlaneGeometry(30, 30); // Smaller area
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.set(5, 0.1, 5); // Slightly raised to avoid z-fighting
    scene.add(floor);
};

export default createGround;