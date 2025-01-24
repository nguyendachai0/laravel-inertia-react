import * as THREE from "three";

const useCollision = (camera, walls) => {
    const raycaster = new THREE.Raycaster();

    const checkCollision = (direction) => {
        const playerPosition = camera.position.clone();
        const rayDirection = new THREE.Vector3();

        const directionVectors = {
            forward: new THREE.Vector3(0, 0, -1),
            backward: new THREE.Vector3(0, 0, 1),
            left: new THREE.Vector3(-1, 0, 0),
            right: new THREE.Vector3(1, 0, 0),
        };

        rayDirection.copy(directionVectors[direction]);
        raycaster.set(playerPosition, rayDirection);
        const intersections = raycaster.intersectObjects(walls);

        return intersections.some((intersection) => intersection.distance < 1);
    };

    return checkCollision;
};

export default useCollision;
