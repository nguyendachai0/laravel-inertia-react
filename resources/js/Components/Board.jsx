import * as THREE from "three";

// Reusable function for creating a canvas with text
const createCanvasForText = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext("2d");

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#3a3a3a");
    gradient.addColorStop(1, "#1c1c1c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ffffff";
    context.font = "bold 18px 'Arial', sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "#000000";
    context.shadowBlur = 10;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;

    const words = text.split(" ");
    let line = "";
    let lines = [];
    const maxWidth = canvas.width - 40;

    for (let word of words) {
        const testLine = line + word + " ";
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth) {
            lines.push(line);
            line = word + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    const lineHeight = 20;
    const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
    lines.forEach((line, i) => {
        context.fillText(line.trim(), canvas.width / 2, startY + i * lineHeight);
    });

    return canvas;
};

// Function to create a board in the scene
export const createBoard = (scene, board, text, position, rotation) => {
    const canvas = createCanvasForText(text);
    const texture = new THREE.CanvasTexture(canvas);

    if (!board) {
        // Create the board mesh only once
        const boardGeometry = new THREE.BoxGeometry(6, 4, 0.4); // Thicker board
        const boardMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.3,
        });

        // Create the board mesh
        board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.copy(position);
        board.rotation.copy(rotation);

        // Add lighting to enhance the 3D effect
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5); // Position the light to illuminate the board
        scene.add(pointLight);

        // Add the board to the scene
        scene.add(board);
    } else {
        // Update the existing board texture without recreating it
        board.material.map = texture;
        board.material.needsUpdate = true;
    }

    return board;
};

// Function to update the board content
export const updateBoardContent = (board, newText) => {
    if (newText.startsWith("<img")) {
        // Extract the image source from the <img> tag
        const imgSrc = newText.match(/src=["'](.*?)["']/);
        if (imgSrc && imgSrc[1]) {
            const imageUrl = imgSrc[1];

            // Load the image as texture
            const texture = new THREE.TextureLoader().load(imageUrl, () => {
                // Once the image is loaded, update the board texture
                board.material.map = texture;
                board.material.needsUpdate = true;
            });
        }
    } else {
        // If the content is text, create a canvas from the text and update the board
        const canvas = createCanvasForText(newText);
        const texture = new THREE.CanvasTexture(canvas);
        board.material.map = texture;
        board.material.needsUpdate = true;
    }
};
