import * as THREE from "three";

const CreateRoof = (scene) => {
    const roofTexture = new THREE.TextureLoader().load(
        "ecc4175ca2d367138e9d8885c1bf675f.jpg"
    );
    roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(10, 10);

    const roofGeometry = new THREE.PlaneGeometry(30, 30);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        map: roofTexture,
        side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.x = Math.PI / 2;
    roof.position.x = 6;
    roof.position.y = 7;
    roof.position.z = 6;
    scene.add(roof);

}
export default CreateRoof;