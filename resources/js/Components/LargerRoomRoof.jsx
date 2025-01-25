import * as THREE from "three";

// Function to create a roof for the larger room
const createLargerRoomRoof = (scene, largerRoomSize) => {
    const roofTexture = new THREE.TextureLoader().load(
        "ground-water-level-backroom (1).jpg"
    );
    roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;

    const desiredTileCount = 1000;
    roofTexture.repeat.set(desiredTileCount, desiredTileCount);

    const roofGeometry = new THREE.PlaneGeometry(largerRoomSize, largerRoomSize);
    const roofMaterial = new THREE.MeshStandardMaterial({
        map: roofTexture,
        side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.x = Math.PI / 2;
    roof.position.x = 6;
    roof.position.y = 480;
    roof.position.z = 10;
    scene.add(roof);
};

export default createLargerRoomRoof;
