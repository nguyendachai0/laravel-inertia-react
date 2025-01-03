import * as THREE from "three";

const createWallsWithBoards = (renderer, scene) => {
    const wallTexture = new THREE.TextureLoader().load(
        "https://preview.redd.it/backrooms-textures-v0-3b0m6yqrjhk91.png?width=512&format=png&auto=webp&s=2173f67a300427e7f5d0dfb496c57b111ac10c43"
    );
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 2);

    const wallGeometry = new THREE.BoxGeometry(2, 10, 2);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: wallTexture,
        roughness: 0.7,
        metalness: 0.3,
    });

    const baseboardTexture = new THREE.TextureLoader().load(
        "https://preview.redd.it/backrooms-textures-v0-3b0m6yqrjhk91.png?width=512&format=png&auto=webp&s=2173f67a300427e7f5d0dfb496c57b111ac10c43"
    );

    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    baseboardTexture.anisotropy = anisotropy;
    baseboardTexture.generateMipmaps = true;
    baseboardTexture.minFilter = THREE.LinearMipmapLinearFilter;
    baseboardTexture.magFilter = THREE.LinearFilter;

    const baseboardGeometry = new THREE.BoxGeometry(2.4, 0.1, 2.4);
    const baseboardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: baseboardTexture,
        roughness: 0.7,
        metalness: 0.3,
    });

    const walls = [];

    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 17; j++) {
            if (i === 0 || i === 16 || j === 0 || j === 16) {
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j * 2 - 10, 2, i * 2 - 10);
                scene.add(wall);
                walls.push(wall);

                const baseboard = new THREE.Mesh(baseboardGeometry, baseboardMaterial);
                baseboard.position.set(j * 2 - 10, 0.25, i * 2 - 10); // Slightly above the ground
                scene.add(baseboard);
            }
        }

    }
    return walls;
};

export default createWallsWithBoards;
