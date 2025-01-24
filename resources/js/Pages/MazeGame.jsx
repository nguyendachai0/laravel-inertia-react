import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { FaCompass } from "react-icons/fa";
import { createBoard, updateBoardContent } from "../Components/Board";
import createWallsWithBoards from "../Components/Wall";
import { playWalkingSound, stopWalkingSound } from "../Utils/SoundUtils";
import Floor from "../Components/Floor";


const MazeGame = () => {
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, z: 0 });
    const [direction, setDirection] = useState(0);
    const controlsRef = useRef(null);
    const moveSpeed = 0.06;
    const obstacles = useRef([]); // Store obstacles for collision detection


    useEffect(() => {
        let scene, camera, renderer, controls;
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        let walkingSound;
        let playerBoundingBox;
        let stuckTimer = 0; // Tracks how long the player is stuck
        const unstuckSpeed = 0.01; // Small movement to apply in all directions
        const maxStuckTime = 2000;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(
                60,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            let currentContentIndex = 0;
            const contentArray = [
                "Welcome to My World!",
                "I’m Nguyen Dac Hai, a passionate web full-stack developer with over 7 months of professional experience. When including my academic experience, I have a total of 2.5 years in web development. My expertise spans across both frontend and backend technologies, including PHP, Laravel, JavaScript, Node.js, and React. I also have experience with real-time web applications using WebSocket like Laravel Reverb, and I am well-versed in CI/CD pipelines, Docker for development and deployment, and **AWS** for hosting and cloud services.",
                "Social app project",
                `<img src="Picture1.png" style="width: 100%; height: auto;"/>`,
                `Feel free to explore my work and contact me for collaboration or hiring.                                               
                 Email: haindfullstack@gmail.com
                Phone: 0389755071`
            ];

            let board = createBoard(scene, null, contentArray[currentContentIndex], new THREE.Vector3(4, 3, -9), new THREE.Euler(0, 0, 0));

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

            Floor(scene);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current.appendChild(renderer.domElement);

            const wallObjects = createWallsWithBoards(renderer, scene);
            wallObjects.forEach((wall) => {
                const boundingBox = new THREE.Box3().setFromObject(wall);
                obstacles.current.push(boundingBox);
            });


            // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            // scene.add(ambientLight);

            const flickeringLight = new THREE.PointLight(0xffffff, 1, 10);
            flickeringLight.position.set(0, 3, 0);
            scene.add(flickeringLight);

            const roofLight = new THREE.PointLight(0xffffff, 0.2, 10);  // Stronger light source

            roofLight.position.set(30, 15, 0);
            scene.add(roofLight);

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

            const addCeilingLights = () => {
                for (let x = -15; x <= 15; x += 6) {
                    for (let z = -15; z <= 15; z += 6) {
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

            addCeilingLights();

            Floor(scene);

            // Ceil(textureLoader, scene);

            camera.position.y = 2;
            controls = new PointerLockControls(camera, document.body);
            controlsRef.current = controls;

            document.addEventListener("click", () => {
                controls.lock();
            });

            document.addEventListener("keydown", onKeyDown);
            document.addEventListener("keyup", onKeyUp);
            const listener = new THREE.AudioListener();
            camera.add(listener);

            walkingSound = new THREE.Audio(listener);
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load("walking-sound-effect-272246.mp3", (buffer) => {
                walkingSound.setBuffer(buffer);
                walkingSound.setLoop(true);
                walkingSound.setVolume(0.5); // Adjust volume as needed
            });

            playerBoundingBox = new THREE.Box3().setFromCenterAndSize(
                camera.position,
                new THREE.Vector3(1, 2, 1) // Adjust size as needed
            );
        };
        const onKeyDown = (event) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = true;
                    playWalkingSound(walkingSound);
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward = true;
                    playWalkingSound(walkingSound);
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft = true;
                    playWalkingSound(walkingSound);
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight = true;
                    playWalkingSound(walkingSound);
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
            stopWalkingSound(walkingSound);
        };

        const checkCollisions = (velocity) => {
            const newBoundingBox = playerBoundingBox.clone();
            newBoundingBox.translate(velocity);

            for (const obstacle of obstacles.current) {
                if (newBoundingBox.intersectsBox(obstacle)) {
                    return true; // Collision detected
                }
            }
            return false; // No collision
        };

        const animate = () => {
            requestAnimationFrame(animate);

            if (controlsRef.current.isLocked) {
                const velocity = new THREE.Vector3();

                // Update velocity based on input
                if (moveForward) velocity.z -= moveSpeed;
                if (moveBackward) velocity.z += moveSpeed;
                if (moveLeft) velocity.x -= moveSpeed;
                if (moveRight) velocity.x += moveSpeed;

                // Normalize velocity to prevent faster diagonal movement
                if (velocity.length() > 0) {
                    velocity.normalize().multiplyScalar(moveSpeed);
                }

                // Update player bounding box
                playerBoundingBox.setFromCenterAndSize(
                    camera.position.clone(),
                    new THREE.Vector3(1, 2, 1) // Adjust dimensions as needed
                );

                // Check for collisions
                if (!checkCollisions(velocity.clone())) {
                    // If no collision, apply movement
                    controlsRef.current.moveRight(velocity.x);
                    controlsRef.current.moveForward(-velocity.z);

                    // Reset stuck timer if movement is successful
                    stuckTimer = 0;

                    // Update position and direction state
                    setPosition({
                        x: camera.position.x.toFixed(2),
                        z: camera.position.z.toFixed(2),
                    });

                    setDirection((camera.rotation.y * (180 / Math.PI)).toFixed(0));
                } else {
                    // Increment stuck timer if collision occurs
                    stuckTimer += 16; // Approximate frame duration in milliseconds

                    // Apply low-speed movement in all directions if stuck for more than maxStuckTime
                    if (stuckTimer >= maxStuckTime) {
                        controlsRef.current.moveRight(unstuckSpeed);
                        controlsRef.current.moveForward(-unstuckSpeed);

                        console.log("Applying unstuck movement");
                    }
                }
            }

            // Render the scene
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
            walkingSound.stop();
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
                <p className="text-sm">WASD to move and press P or N to change content</p>
                <p className="text-sm">Mouse to look around</p>
            </div>
        </div>
    );
};

export default MazeGame;
