export const playWalkingSound = (walkingSound) => {
    if (!walkingSound.isPlaying) {
        walkingSound.play();
    }
};


export const stopWalkingSound = (walkingSound) => {
    if (walkingSound.isPlaying) {
        walkingSound.stop();
    }
};
