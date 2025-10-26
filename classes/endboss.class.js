/**
 * Class representing the Endboss enemy.
 * Extends MovableObjetcs and handles animations, movement, attack logic, and health.
 */
class Endboss extends MovableObjetcs {
    height = 400;
    width = 250;
    y = 60;
    speed = 5;
    spotCharacter = false;
    isWalking = false;
    energy = 100;
    isHurt = false;
    isAttacking = false;
    lastAttackTime = 0;
    attackCooldown = 1500;
    attackRange = 100;
    alertPlayed = false;
    isDeadAnimationComplete = false;
    stopAnimations = false;

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
    }

    /**
     * Starts the Endboss logic, including animation loops and movement/attack logic.
     */
    startLogic() {
        setInterval(() => this.handleAnimations(), 200);
        setInterval(() => this.handleMovementAndAttack(), 1000/60);
    }

    /**
     * Handles all Endboss animations based on its current state (dead, hurt, attacking, walking, or alert).
     */
    handleAnimations() {
        if (this.stopAnimations) return;

        if (this.isDead()) {
            this.handleDeathAnimation();
        } else if (this.isHurt) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAttacking) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.spotCharacter && this.isWalking) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_ALERT);
        }
    }

    /**
     * Handles the Endboss death animation and sets the final frame when complete.
     */
    handleDeathAnimation() {
        if (this.isDeadAnimationComplete) return;

        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
            this.isDeadAnimationComplete = true;
            this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
        }, this.IMAGES_DEAD.length * 600);
    }

    /**
     * Handles the Endboss's movement towards the character and its attack logic.
     * The Endboss walks toward the character once spotted and attacks when in range, respecting the cooldown.
     */
    handleMovementAndAttack() {
        if (this.stopAnimations) return;

        this.detectCharacter();

        if (!this.spotCharacter || !this.alertPlayed || this.isHurt || this.isDead()) return;

        const distance = this.x - this.world.character.x;
        Math.abs(distance) < this.attackRange ? this.attack() : this.moveTowardsCharacter(distance);
    }

    /**
     * Detects when the character enters the Endboss's range and triggers alert/walking state.
     */
    detectCharacter() {
        if (this.world.character.x < 2200 || this.spotCharacter) return;
        this.spotCharacter = true;
        setTimeout(() => {
            this.isWalking = true;
            this.alertPlayed = true;
        }, this.IMAGES_ALERT.length * 200);
    }

    /**
     * Handles Endboss attack behavior and cooldown timing.
     */
    attack() {
        this.isWalking = false;
        this.isAttacking = true;

        const now = Date.now();
        if (now - this.lastAttackTime > this.attackCooldown) {
            this.world.character.hit();
            this.world.healthStatusBar.setPercentage(this.world.character.energy);
            this.lastAttackTime = now;
        }
    }

    /**
     * Moves the Endboss toward the character, updating direction and state.
     * @param {number} distance - Horizontal distance between Endboss and character.
     */
    moveTowardsCharacter(distance) {
        this.isAttacking = false;
        this.isWalking = true;

        if (distance > 0) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Reduces the Endboss's energy by 20 points and triggers the hurt state.
     */
    hit() {
        this.energy -= 20;
        if (this.energy <= 0) this.energy = 0;

        this.isHurt = true;
        setTimeout(() => this.isHurt = false, 500);
    }

    /**
     * Checks if the Endboss is dead.
     * @returns {boolean} True if the energy is 0, otherwise false.
     */
    isDead() {
        return this.energy === 0;
    }
}