import * as THREE from "three";

export const initLights = (containerRef, renderer, scene) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3);  // Increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // Brighter directional light
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    const roofLight = new THREE.PointLight(0xffffff, 0.2, 100);  // Stronger light source

    roofLight.position.set(30, 15, 0);  // Above the ceiling
    scene.add(roofLight);
};

export const addCeilingLights = (scene) => {
    for (let x = -12; x <= 12; x += 4) {
        for (let z = -12; z <= 12; z += 4) {
            const light = new THREE.PointLight(0xffffff, 10, 30);
            light.position.set(x, 3, z);
            scene.add(light);

            // Add light fixture mesh
            const fixtureGeometry = new THREE.BoxGeometry(2, 0.4, 2);
            const fixtureMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.5
            });
            const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
            fixture.position.set(x, 6.98, z);
            scene.add(fixture);
        }
    }
};