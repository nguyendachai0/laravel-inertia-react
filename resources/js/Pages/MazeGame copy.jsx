import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { FaCompass } from "react-icons/fa";
import { createBoard, updateBoardContent } from "../Components/Board";
import createWallsWithBoards from "../Components/Wall";
import { playWalkingSound, stopWalkingSound } from "../Utils/SoundUtils";
import { initLights, addCeilingLights } from "../Components/Lights";
import Floor from "../Components/Floor";
import Ceil from "../Components/Ceil";

const MazeGame = () => {
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, z: 0 });
    const [direction, setDirection] = useState(0);
    const controlsRef = useRef(null);
    const moveSpeed = 0.05;

    useEffect(() => {
        let scene, camera, renderer, controls;
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            let currentContentIndex = 0;
            const contentArray = [
                "Welcome to My Portfolio!",
                "Here, you will find my projects and achievements.",
                "I specialize in Backend Development with PHP, Java, and Node.js.",
                "Feel free to explore my work and contact me for collaboration."
            ];

            let board = createBoard(scene, null, contentArray[currentContentIndex], new THREE.Vector3(4, 2, -9), new THREE.Euler(0, 0, 0));

            const handleKeyboard = (event) => {
                if (event.key === "p" || event.key === "P") {
                    // Move to the previous content
                    currentContentIndex = (currentContentIndex - 1 + contentArray.length) % contentArray.length;
                    updateBoardContent(board, contentArray[currentContentIndex]);
                }

                if (event.key === "n" || event.key === "N") {
                    // Move to the next content
                    currentContentIndex = (currentContentIndex + 1) % contentArray.length;
                    updateBoardContent(board, contentArray[currentContentIndex]);
                }
            };
            document.addEventListener("keydown", handleKeyboard);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current.appendChild(renderer.domElement);

            // Modified lighting for backrooms effect
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambientLight);

            const flickeringLight = new THREE.PointLight(0xffffff, 1, 10);
            flickeringLight.position.set(0, 3, 0);
            scene.add(flickeringLight);

            // Create floor with pattern texture
            Floor(scene);

            // Add roof with pattern texture
            const roofTexture = new THREE.TextureLoader().load(
                "ecc4175ca2d367138e9d8885c1bf675f.jpg"
            );
            roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
            roofTexture.repeat.set(10, 10);

            const roofGeometry = new THREE.PlaneGeometry(20, 20);
            const roofMaterial = new THREE.MeshStandardMaterial({
                color: 0xffff00,
                map: roofTexture,
                side: THREE.DoubleSide,
            });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.rotation.x = Math.PI / 2;
            roof.position.y = 4;
            scene.add(roof);

            // Add ceiling lights
            const addCeilingLights = () => {
                for (let x = -8; x <= 8; x += 4) {
                    for (let z = -8; z <= 8; z += 4) {
                        const light = new THREE.PointLight(0xffffff, 0.5, 6);
                        light.position.set(x, 3.8, z);
                        scene.add(light);

                        // Add light fixture mesh
                        const fixtureGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
                        const fixtureMaterial = new THREE.MeshStandardMaterial({
                            color: 0xffffff,
                            emissive: 0xffffff,
                            emissiveIntensity: 0.5
                        });
                        const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
                        fixture.position.set(x, 3.9, z);
                        scene.add(fixture);
                    }
                }
            };

            addCeilingLights();

            // Modified to create backrooms-style walls
            createWallsWithBoards(renderer, scene);

            camera.position.y = 2;
            controls = new PointerLockControls(camera, document.body);
            controlsRef.current = controls;

            document.addEventListener("click", () => {
                controls.lock();
            });

            document.addEventListener("keydown", onKeyDown);
            document.addEventListener("keyup", onKeyUp);

            // Add flickering effect
            // setInterval(() => {
            //   flickeringLight.intensity = 0.5 + Math.random() * 0.5;
            // }, 100);
        };



        const onKeyDown = (event) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward = true;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight = true;
                    break;
                default:
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward = false;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight = false;
                    break;
                default:
                    break;
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);

            if (controlsRef.current.isLocked) {
                const velocity = new THREE.Vector3();

                if (moveForward) velocity.z -= moveSpeed;
                if (moveBackward) velocity.z += moveSpeed;
                if (moveLeft) velocity.x -= moveSpeed;
                if (moveRight) velocity.x += moveSpeed;

                controlsRef.current.moveRight(velocity.x);
                controlsRef.current.moveForward(-velocity.z);

                setPosition({
                    x: camera.position.x.toFixed(2),
                    z: camera.position.z.toFixed(2),
                });
                setDirection((camera.rotation.y * (180 / Math.PI)).toFixed(0));
            }

            renderer.render(scene, camera);
        };

        init();
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="relative w-full h-screen">
            <div
                ref={containerRef}
                className="absolute top-0 left-0 w-full h-full"
            ></div>
            <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded-lg">
                <div className="flex items-center gap-4">
                    <FaCompass className="text-2xl rotate-45" />
                    <div>
                        <p>Position: ({position.x}, {position.z})</p>
                        <p>Direction: {direction}°</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white p-4 rounded-lg">
                <p className="text-sm">Click to start</p>
                <p className="text-sm">WASD or Arrow Keys to move</p>
                <p className="text-sm">Mouse to look around</p>
            </div>
        </div>
    );
};

export default MazeGame;