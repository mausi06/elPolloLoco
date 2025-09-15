/**
 * Class representing the main character of the game.
 * Extends MovableObjetcs to inherit movement, gravity, and collision logic.
 */
class Character extends MovableObjetcs {
    y = 80;
    height = 250;
    speed = 10;
    energy = 100;

    stopAnimations = false;
    isDeadAnimationComplete = false;
    hurt_sound_played = false;
    jumpAnimationPlayed = false;

    Images_IDILE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    Images_SLEEPING = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png'
];

    Images_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    Images_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    Images_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    Images_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    walking_sound = new Audio('audio/walking-sound-effect-272246.mp3');
    jump_sound = new Audio('audio/jump.mp3');
    hurt_sound = new Audio('audio/hurt.mp3');

    currentAnimation = null;
    currentFrameIndex = 0;
    frameTimer = 0;
    frameDelay = 50;
    animationLoop = true;

    // --- Idle/Sleep Tracking ---
    lastActionTime = Date.now();
    isSleeping = false;

    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.Images_IDILE);
        this.loadImages(this.Images_SLEEPING);
        this.loadImages(this.Images_WALKING);
        this.loadImages(this.Images_JUMPING);
        this.loadImages(this.Images_DEAD);
        this.loadImages(this.Images_HURT);

        this.currentAnimation = this.Images_IDILE;
        this.currentFrameIndex = 0;
        this.frameDelay = 150;
        this.animationLoop = true;
        this.loadImage(this.currentAnimation[this.currentFrameIndex]);

        this.applyGravity();
        this.walking_sound.loop = true;
        this.animate();
    }

    animate() {
        setInterval(() => this.handleMovementAndSound(), 1000 / 60);
        setInterval(() => this.handleAnimations(), 50);
    }

    handleMovementAndSound() {
        if (this.stopAnimations || !this.world?.gameIsRunning) {
            this.stopAllSounds();
            return;
        }

        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP;
        if (isMoving) {
            this.lastActionTime = Date.now();
            this.isSleeping = false;
        }

        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround()) {
            this.walking_sound.play().catch(() => {});
        } else {
            this.walking_sound.pause();
        }

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
        }

        this.world.camera_x = -this.x + 100;
    }

    handleAnimations() {
        if (this.stopAnimations) return;

        if (this.isDead()) {
            this.switchAnimation(this.Images_DEAD, 200, false);
            this.advanceAnimation(50);
            if (this.currentFrameIndex === this.Images_DEAD.length - 1) {
                this.isDeadAnimationComplete = true;
                this.stopAnimations = true;
                this.stopAllSounds();
            }
            return;
        }

        if (this.isHurt()) {
            this.switchAnimation(this.Images_HURT, 120, false);
            if (!this.hurt_sound_played) {
                this.hurt_sound.play().catch(() => {});
                this.hurt_sound_played = true;
            }
            this.advanceAnimation(50);
            return;
        } else {
            this.hurt_sound_played = false;
        }

        // Sleep-Check
        if (!this.isSleeping && Date.now() - this.lastActionTime > 10000) {
            this.isSleeping = true;
            this.switchAnimation(this.Images_SLEEPING, 200, true);
        }

        if (this.isSleeping) {
            this.advanceAnimation(50);
            return;
        }

        if (this.isAboveGround()) {
            if (!this.jumpAnimationPlayed) {
                this.switchAnimation(this.Images_JUMPING, 50, false);
                this.jumpAnimationPlayed = true;
            }
            this.advanceAnimation(50);
            return;
        }

        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.switchAnimation(this.Images_WALKING, 60, true);
            this.jumpAnimationPlayed = false;
            this.advanceAnimation(50);
            return;
        }

        this.switchAnimation(this.Images_IDILE, 150, true);
        this.jumpAnimationPlayed = false;
        this.advanceAnimation(50);
    }

    switchAnimation(images, frameDelayMs = 50, loop = true) {
        if (this.currentAnimation !== images) {
            this.currentAnimation = images;
            this.currentFrameIndex = -1; // -1 = noch kein Frame gesetzt
            this.frameTimer = 0;
            this.frameDelay = frameDelayMs;
            this.animationLoop = !!loop;
        }
    }

    advanceAnimation(deltaMs) {
        if (!this.currentAnimation || this.currentAnimation.length === 0) return;

        this.frameTimer += deltaMs;
        if (this.frameTimer < this.frameDelay && this.currentFrameIndex !== -1) return;

        this.frameTimer = 0;

        if (this.currentFrameIndex < this.currentAnimation.length - 1) {
            this.currentFrameIndex++;
        } else {
            this.currentFrameIndex = this.animationLoop ? 0 : this.currentAnimation.length - 1;
        }

        this.loadImage(this.currentAnimation[this.currentFrameIndex]);
    }

    isDead() {
        return this.energy === 0;
    }

    stopAllSounds() {
        this.walking_sound.pause();
        this.jump_sound.pause();
        this.hurt_sound.pause();
    }

    jump() {
        super.jump();
        this.jump_sound.play().catch(() => {});
    }

    hit() {
        super.hit();
        this.hurt_sound.play().catch(() => {});
    }
}
