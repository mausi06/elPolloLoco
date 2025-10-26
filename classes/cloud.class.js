/**
 * Class representing a cloud in the background.
 * Extends MovableObjetcs to allow movement.
 */
class Cloud extends MovableObjetcs {
    y = 20;
    width = 500;
    height = 250;
    x;
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 200 + Math.random() * 500;
        this.animation();
    }

    /**
     * Animates the cloud by moving it continuously to the left.
     * Runs at ~60 frames per second.
     */
    animation() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
