/**
 * Class representing the Endboss enemy.
 * Extends MovableObjetcs and handles animations, movement, attack logic, and health.
 */
class Endboss extends MovableObjetcs {
    /** @type {number} Height of the Endboss in pixels. */
    height = 400;

    /** @type {number} Width of the Endboss in pixels. */
    width = 250;

    /** @type {number} Vertical position (y-coordinate) of the Endboss. */
    y = 60;

    /** @type {number} Horizontal movement speed of the Endboss. */
    speed = 5;

    /** @type {boolean} Flag indicating if the character has been spotted. */
    spotCharacter = false;

    /** @type {boolean} Flag indicating if the Endboss is currently in a walking state. */
    isWalking = false;

    /** @type {number} The current health points of the Endboss. */
    energy = 100;

    /** @type {boolean} Flag indicating if the Endboss is currently in a hurt state. */
    isHurt = false;

    /** @type {boolean} Flag indicating if the Endboss is currently in an attacking state. */
    isAttacking = false;

    /** @type {number} Timestamp of the last attack, used for cooldown. */
    lastAttackTime = 0;

    /** @type {number} Minimum interval in milliseconds between attacks. */
    attackCooldown = 1500;

    /** @type {number} The distance in which the Endboss can attack the character. */
    attackRange = 100;

    /** @type {boolean} Flag indicating if the initial alert animation has been played. */
    alertPlayed = false;

    /** @type {boolean} Flag for completion of the death animation. */
    isDeadAnimationComplete = false;

    /** @type {boolean} Flag to stop all animations and actions of the Endboss. */
    stopAnimations = false;

    /** @type {string[]} Array of image paths for the alert animation. */
    Images_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /** @type {string[]} Array of image paths for the walking animation. */
    Images_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** @type {string[]} Array of image paths for the attack animation. */
    Images_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    /** @type {string[]} Array of image paths for the hurt animation. */
    Images_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} Array of image paths for the death animation. */
    Images_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates an Endboss instance.
     * Loads all images for the animations and sets the initial x-position.
     */
    constructor() {
        super();
        this.loadImage(this.Images_ALERT[0]);
        this.loadImages(this.Images_ALERT);
        this.loadImages(this.Images_WALKING);
        this.loadImages(this.Images_ATTACK);
        this.loadImages(this.Images_HURT);
        this.loadImages(this.Images_DEAD);
        this.x = 2500;
    }

    /**
     * Starts the Endboss logic, including animation loops and movement/attack logic.
     */
    startLogic() {
        setInterval(() => this.handleAnimations(), 200); // Animation loop
        setInterval(() => this.handleMovementAndAttack(), 1000/60); // Movement and attack loop
    }

    /**
     * Handles all Endboss animations based on its current state (dead, hurt, attacking, walking, or alert).
     */
    handleAnimations() {
        if (this.stopAnimations) return;

        if (this.isDead()) {
            if (!this.isDeadAnimationComplete) {
                this.playAnimation(this.Images_DEAD);
                setTimeout(() => {
                    this.isDeadAnimationComplete = true;
                    this.loadImage(this.Images_DEAD[this.Images_DEAD.length - 1]);
                }, this.Images_DEAD.length * 600);
            }
        } else if (this.isHurt) {
            this.playAnimation(this.Images_HURT);
        } else if (this.isAttacking) {
            this.playAnimation(this.Images_ATTACK);
        } else if (this.spotCharacter && this.isWalking) {
            this.playAnimation(this.Images_WALKING);
        } else {
            this.playAnimation(this.Images_ALERT);
        }
    }

    /**
     * Handles the Endboss's movement towards the character and its attack logic.
     * The Endboss walks toward the character once spotted and attacks when in range, respecting the cooldown.
     */
    handleMovementAndAttack() {
        if (this.stopAnimations) return;

        if (this.world.character.x >= 2200 && !this.spotCharacter) {
            this.spotCharacter = true;
            setTimeout(() => {
                this.isWalking = true;
                this.alertPlayed = true;
            }, this.Images_ALERT.length * 200);
        }

        if (!this.spotCharacter || !this.alertPlayed || this.isHurt || this.isDead()) return;

        let distance = this.x - this.world.character.x;

        if (Math.abs(distance) < this.attackRange) {
            this.isWalking = false;
            this.isAttacking = true;
            if (new Date().getTime() - this.lastAttackTime > this.attackCooldown) {
                this.world.character.hit();
                this.world.healthStatusBar.setPercentage(this.world.character.energy);
                this.lastAttackTime = new Date().getTime();
            }
        } else {
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