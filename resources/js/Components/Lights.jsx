import * as THREE from "three";

export const initLights = (containerRef, renderer, scene) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // Brighter directional light
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    const roofLight = new THREE.PointLight(0xffffff, 500000, 100);  // Stronger light source

    roofLight.position.set(30, 15, 0);  // Above the ceiling
    scene.add(roofLight);
};

export const addCeilingLights = (scene, celingQuantityLights) => {
    for (let x = -celingQuantityLights; x <= celingQuantityLights; x += 6) {
        for (let z = -celingQuantityLights; z <= celingQuantityLights; z += 6) {
            const light = new THREE.PointLight(0xffffff, 60, 13);
            light.position.set(x + 1.5, 6.9, z + 1.5);
            scene.add(light);

            // Add light fixture mesh
            const fixtureGeometry = new THREE.BoxGeometry(3, 0.1, 3);
            const fixtureMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 1
            });
            const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
            fixture.position.set(x + 1.5, 7, z + 1.5);
            scene.add(fixture);
        }
    }
};

export const addMoreLights = (scene) => {
    // Add a HemisphereLight for ambient sky/ground lighting
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.8);
    hemisphereLight.position.set(0, 50, 0); // Positioned high in the sky
    scene.add(hemisphereLight);

    // Add additional spotlights in the corners of the scene
    const spotlightPositions = [
        { x: -20, y: 10, z: -20 },
        { x: 20, y: 10, z: -20 },
        { x: -20, y: 10, z: 20 },
        { x: 20, y: 10, z: 20 },
    ];

    spotlightPositions.forEach((pos) => {
        const spotLight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 6);
        spotLight.position.set(pos.x, pos.y, pos.z);
        spotLight.target.position.set(0, 0, 0); // Pointing towards the origin
        scene.add(spotLight);
        scene.add(spotLight.target); // Add the target to the scene
    });

    // Add dynamic lights for interactive or aesthetic effects
    for (let i = 0; i < 5; i++) {
        const dynamicLight = new THREE.PointLight(0xff0000, 2, 20);
        dynamicLight.position.set(
            Math.random() * 40 - 20,
            Math.random() * 20 + 10,
            Math.random() * 40 - 20
        );
        scene.add(dynamicLight);
    }



};
