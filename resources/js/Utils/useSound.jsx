import * as THREE from "three";

const useWalkingSound = () => {
    const walkingSound = new THREE.Audio(new THREE.AudioListener());
    const audioLoader = new THREE.AudioLoader();

    const playSound = (audioUrl) => {
        audioLoader.load(audioUrl, (buffer) => {
            walkingSound.setBuffer(buffer);
            walkingSound.setLoop(true);
            walkingSound.setVolume(0.5);
            walkingSound.play();
        });
    };

    const stopSound = () => {
        walkingSound.stop();
    };

    return { playSound, stopSound };
};

export default useWalkingSound;
