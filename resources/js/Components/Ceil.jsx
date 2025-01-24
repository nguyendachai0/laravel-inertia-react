import * as THREE from "three";

const Ceil = (textureLoader, scene) => {
    const ceilingTexture = textureLoader.load('ecc4175ca2d367138e9d8885c1bf675f.jpg');
    const gridSize = 20;
    const blockSize = 2;

    const ceilingGroup = new THREE.Group();

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const geometry = new THREE.PlaneGeometry(blockSize, blockSize);
            const material = new THREE.MeshStandardMaterial({ map: ceilingTexture });
            const block = new THREE.Mesh(geometry, material);
            block.position.set(i * blockSize + 10, 7, j * blockSize + 10); // Adjust height (y = 10)
            block.rotation.x = Math.PI / 2;
            ceilingGroup.add(block);

        }
    }

    ceilingGroup.position.set(-gridSize / 2 * blockSize, 0, -gridSize / 2 * blockSize);
    // scene.add(ceilingGroup);

}
export default Ceil;