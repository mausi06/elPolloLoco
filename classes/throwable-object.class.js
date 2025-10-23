/**
 * Class representing a throwable bottle object.
 * Extends MovableObjetcs and handles throwing, gravity, and rotation animation.
 */
class ThrowableObject extends MovableObjetcs {
    IMAGES_Bottle = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_Bottle);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw(otherDirection);
        this.animate();
    }

    /**
     * Throws the bottle in the given direction and applies gravity.
     * @param {boolean} otherDirection - True to throw left, false to throw right
     */
    throw(otherDirection) {
        this.speedY = 20;
        this.applyGravity();
        
        let throwSpeed = 10;
        setInterval(() => {
            if (otherDirection) this.x -= throwSpeed;
            else this.x += throwSpeed;
        }, 25);
    }

    /**
     * Animates the bottle rotation by cycling through rotation images.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_Bottle);
        }, 60);
    }
}
