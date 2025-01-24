import * as THREE from "three";

const createWallsWithBoards = (renderer, scene) => {
    const wallTexture = new THREE.TextureLoader().load(
        "backrooms-textures-v0-3b0m6yqrjhk91.webp"
    );
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 2);

    const wallGeometry = new THREE.BoxGeometry(2, 10, 2);
    const wallAboveDoor = new THREE.BoxGeometry(2, 4, 2);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: wallTexture,
        roughness: 0.7,
        metalness: 0.3,
    });

    const baseboardTexture = new THREE.TextureLoader().load(
        "backrooms-textures-v0-3b0m6yqrjhk91.webp"
    );

    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    baseboardTexture.anisotropy = anisotropy;
    baseboardTexture.generateMipmaps = true;
    baseboardTexture.minFilter = THREE.LinearMipmapLinearFilter;
    baseboardTexture.magFilter = THREE.LinearFilter;

    const baseboardGeometry = new THREE.BoxGeometry(2.4, 0.4, 2.2);
    const baseboardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: baseboardTexture,
        roughness: 0.7,
        metalness: 0.3,
    });

    const walls = [];

    const doorStart = -1; // Start position of the door (column index)
    const doorEnd = 0;   // End position of the door (column index)


    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 17; j++) {

            if (i === 8 && j >= doorStart && j <= doorEnd) {
                const wall = new THREE.Mesh(wallAboveDoor, wallMaterial);
                wall.position.set(j * 2 - 10, 7, i * 2 - 10);
                scene.add(wall);
                continue;
            }

            if (i === 0 || i === 16 || j === 0 || j === 16) {
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j * 2 - 10, 5, i * 2 - 10);
                scene.add(wall);
                walls.push(wall);

                const baseboard = new THREE.Mesh(baseboardGeometry, baseboardMaterial);
                baseboard.position.set(j * 2 - 10, 0.25, i * 2 - 10); // Slightly above the ground
                scene.add(baseboard);
            }
        }

    }

    const largerRoomWallGeometry = new THREE.BoxGeometry(2, 10, 2); // Adjust as needed
    const largerRoomWallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: wallTexture,
        roughness: 0.7,
        metalness: 0.3,
    });

    const largerRoomSize = 300; // Example larger room size

    for (let i = 0; i < largerRoomSize; i++) {
        for (let j = 0; j < largerRoomSize; j++) {

            // Adjust conditions based on your specific design (here, we're just adding walls beyond the original room)
            if (i === 0 || i === largerRoomSize - 1 || j === 0 || j === largerRoomSize - 1) {
                const wall = new THREE.Mesh(largerRoomWallGeometry, largerRoomWallMaterial);
                wall.position.set(j * 2 - largerRoomSize, 5, i * 2 - largerRoomSize);
                scene.add(wall);
                walls.push(wall);

                const baseboard = new THREE.Mesh(baseboardGeometry, baseboardMaterial);
                baseboard.position.set(j * 2 - largerRoomSize, 0.25, i * 2 - largerRoomSize);
                scene.add(baseboard);
            }
        }
    }

    const lightDistance = largerRoomSize * 2;
    for (let i = 0; i < largerRoomSize; i++) {
        for (let j = 0; j < largerRoomSize; j++) {
            // Place lights along the perimeter of the outside wall (avoid overlapping with existing walls)
            if (
                i === 0 || i === largerRoomSize - 1 ||
                j === 0 || j === largerRoomSize - 1
            ) {
                const light = new THREE.PointLight(0xffffff, 1, lightDistance);
                light.position.set(j * 2 - largerRoomSize, 10, i * 2 - largerRoomSize);  // Set light height above ground
                scene.add(light);
            }
        }
    }

    return walls;
};

export default createWallsWithBoards;
