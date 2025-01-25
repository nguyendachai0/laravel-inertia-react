import * as THREE from "three";

const createWallsWithBoards = (scene) => {
    // Load textures
    const wallTexture = new THREE.TextureLoader().load(
        "backrooms-textures-v0-3b0m6yqrjhk91.webp"
    );
    const largerWallTexture = new THREE.TextureLoader().load(
        "ground-water-level-backroom (1).jpg"
    );

    // Set texture wrapping for both textures
    largerWallTexture.wrapS = THREE.RepeatWrapping;
    largerWallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;

    // Define desired tile count and adjust texture repeat
    // const desiredTileCount = 1;
    // largerWallTexture.repeat.set(desiredTileCount, desiredTileCount); // Adjust repeat scale for larger texture
    wallTexture.repeat.set(2, 2);

    // Wall and baseboard geometry
    const wallGeometry = new THREE.BoxGeometry(2, 10, 2);
    const wallAboveDoor = new THREE.BoxGeometry(2, 4, 2);
    const baseboardGeometry = new THREE.BoxGeometry(2.4, 0.4, 2.2);

    // Materials
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: wallTexture,
        roughness: 0.7,
        metalness: 0.3,
    });
    const baseboardMaterial = wallMaterial;

    // Create walls array to store walls
    const walls = [];

    // Door position
    const doorStart = -1;
    const doorEnd = 0;

    // Create walls for the initial 17x17 grid
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 17; j++) {
            // Add wall above door in the center
            if (i === 8 && j >= doorStart && j <= doorEnd) {
                const wall = new THREE.Mesh(wallAboveDoor, wallMaterial);
                wall.position.set(j * 2 - 10, 7, i * 2 - 10);
                scene.add(wall);
                continue;
            }

            // Create walls around the grid boundaries
            if (i === 0 || i === 16 || j === 0 || j === 16) {
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j * 2 - 10, 5, i * 2 - 10);
                scene.add(wall);
                walls.push(wall);

                // Add baseboards to the walls
                const baseboard = new THREE.Mesh(baseboardGeometry, baseboardMaterial);
                baseboard.position.set(j * 2 - 10, 0.25, i * 2 - 10); // Slightly above the ground
                scene.add(baseboard);
            }
        }
    }

    // Create larger room walls with the same texture as the ground
    const largerRoomWallGeometry = new THREE.BoxGeometry(2, 1000, 2);
    const largerRoomWallMaterial = new THREE.MeshStandardMaterial({
        map: largerWallTexture,
        roughness: 0.9,
    });

    const largerRoomSize = 300; // Example larger room size

    for (let i = 0; i < largerRoomSize; i++) {
        for (let j = 0; j < largerRoomSize; j++) {
            // Create larger room walls around the perimeter
            if (i === 0 || i === largerRoomSize - 1 || j === 0 || j === largerRoomSize - 1) {
                const wall = new THREE.Mesh(largerRoomWallGeometry, largerRoomWallMaterial);
                const width = largerRoomWallGeometry.parameters.width; // 2
                const height = largerRoomWallGeometry.parameters.height; // 30
                largerWallTexture.repeat.set(width * 3, height * 3);

                wall.position.set(j * 2 - largerRoomSize, 15, i * 2 - largerRoomSize); // Elevate walls
                scene.add(wall);
                walls.push(wall);
            }
        }
    }

    return walls;
};

export default createWallsWithBoards;
