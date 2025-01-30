import * as THREE from "three";

// Function to create a roof for the larger room
const createLargerRoomRoof = (scene, largerRoomSize) => {


    const roofTexture = new THREE.TextureLoader().load(
        "ground-water-level-backroom (1).jpg"
    );
    roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;

    const desiredTileCount = 400;
    roofTexture.repeat.set(desiredTileCount, desiredTileCount);

    const roofGeometry = new THREE.PlaneGeometry(largerRoomSize, largerRoomSize);
    const roofMaterial = new THREE.MeshStandardMaterial({
        map: roofTexture,
        side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.x = Math.PI / 2;
    roof.position.x = 6;
    roof.position.y = 100;
    roof.position.z = 10;
    scene.add(roof);


    const numLightsPerRow = 10;
    const numLightsPerColumn = 10;
    const lightSpacing = largerRoomSize / (numLightsPerRow + 1); // Space the lights evenly
    const lightColor = 0xffffff;

    const fakeLightMaterial = new THREE.MeshBasicMaterial({ color: lightColor });


    // Create a grid of fake light sources
    for (let row = 0; row < numLightsPerColumn; row++) {
        for (let col = 0; col < numLightsPerRow; col++) {
            // Create a glowing sphere
            const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16); // Adjust size as needed
            const fakeLight = new THREE.Mesh(sphereGeometry, fakeLightMaterial);

            // Calculate the positions in grid layout
            const xPosition = (col + 1) * lightSpacing - largerRoomSize / 2;
            const zPosition = (row + 1) * lightSpacing - largerRoomSize / 2;
            fakeLight.position.set(xPosition, 99.9, zPosition); // Position it above the roof

            // Add the fake light to the scene
            scene.add(fakeLight);
        }
    }



};

export default createLargerRoomRoof;
