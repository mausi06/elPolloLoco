/**
 * Handles all collisions and interactions between the character and game objects.
 */
class CollisionManager {
    /**
     * Creates a CollisionManager.
     * @param {World} world - Reference to the main game world.
     */
    constructor(world) {
        /** @type {World} */
        this.world = world;
        /** @type {number} Timestamp of the last time the character hit the endboss. */
        this.lastEndbossHitTime = 0;
    }

    /**
     * Updates all collisions and interactions in the game.
     * Called every frame by the World class.
     */
    update() {
        if (!this.world.gameIsRunning) return;
        this.checkCharacterState();
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowAction();
        this.checkThrowableCollisions();
        this.checkEndbossState();
    }

    /**
     * Checks if the character is dead and triggers game over if needed.
     */
    checkCharacterState() {
        if (this.world.character.isDead() && !this.world.characterIsDead) {
            this.world.triggerGameOver();
        }
    }

    /**
     * Checks collisions between the character and all enemies.
     * Handles jump kills, endboss damage, and standard enemy collisions.
     */
    checkEnemyCollisions() {
        if (this.world.characterIsDead) return;
        let hasJumpedOnEnemy = false;

        this.world.level.enemies.forEach((enemy, index) => {
            if (!this.world.character.isColliding(enemy) || enemy.isDead()) return;

            if (this.handleJumpOnEnemy(enemy, index)) {
                hasJumpedOnEnemy = true;
                return;
            }

            if (this.handleEndbossCollision(enemy)) return;
            this.handleNormalEnemyCollision(hasJumpedOnEnemy);
        });
    }

    /**
     * Handles the character jumping on a regular enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @param {number} index - The index of the enemy in the enemies array.
     * @returns {boolean} True if the character successfully jumped on the enemy.
     */
    handleJumpOnEnemy(enemy, index) {
        const charBottom = this.world.character.y + this.world.character.height;
        const enemyTop = enemy.y;
        const isFalling = this.world.character.speedY < 0;

        if (isFalling && charBottom > enemyTop && charBottom < enemyTop + enemy.height * 0.5) {
            enemy.hit();
            if (enemy.isDead()) this.world.level.enemies.splice(index, 1);
            this.world.character.speedY = 20;
            return true;
        }
        return false;
    }

    /**
     * Handles collisions with the endboss.
     * The character can only take damage if enough time has passed since the last hit.
     * @param {Endboss} enemy - The endboss object.
     * @returns {boolean} True if the collision was handled.
     */
    handleEndbossCollision(enemy) {
        if (!(enemy instanceof Endboss)) return false;
        const now = Date.now();
        if (now - this.lastEndbossHitTime > 400) {
            this.world.character.hit();
            this.world.healthStatusBar.setPercentage(this.world.character.energy);
            this.lastEndbossHitTime = now;
        }
        return true;
    }

    /**
     * Handles collisions with normal enemies when the character hasn't jumped on them.
     * @param {boolean} hasJumpedOnEnemy - Indicates if the character just jumped on an enemy.
     */
    handleNormalEnemyCollision(hasJumpedOnEnemy) {
        if (!hasJumpedOnEnemy && !this.world.character.isHurt()) {
            this.world.character.hit();

            this.world.level.enemies.forEach(enemy => {
                if (enemy instanceof MiniChicken || enemy instanceof Chicken) {
                    if (this.world.character.isColliding(enemy)) {
                        this.world.character.hit();
                    }
                }
            });

            this.world.healthStatusBar.setPercentage(this.world.character.energy);
        }
    }

    /**
     * Checks collisions between the character and collectible coins.
     */
    checkCoinCollisions() {
        if (this.world.characterIsDead) return;
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin, { offsetX: 20, offsetY: 20 })) {
                this.world.level.coins.splice(index, 1);
                this.world.collectedCoins++;
                this.world.coinStatusBar.setPercentage(this.world.collectedCoins, this.world.totalCoins);
            }
        });
    }

    /**
     * Checks collisions between the character and collectible bottles.
     */
    checkBottleCollisions() {
        if (this.world.characterIsDead) return;
        this.world.level.bottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle, { offsetX: 20, offsetY: 20 })) {
                this.world.level.bottles.splice(index, 1);
                this.world.collectedBottles++;
                this.world.bottleStatusBar.setPercentage(this.world.collectedBottles, this.world.totalBottles);
            }
        });
    }

    /**
     * Checks if the character should throw a bottle based on keyboard input.
     */
    checkThrowAction() {
        if (this.world.keyboard.SPACE && this.world.collectedBottles > 0) {
            let bottle = new ThrowableObject(this.world.character.x, this.world.character.y, this.world.character.otherDirection);
            this.world.throwableObjects.push(bottle);
            this.world.collectedBottles--;
            this.world.bottleStatusBar.setPercentage(this.world.collectedBottles, this.world.totalBottles);
            this.world.keyboard.SPACE = false;
        }
    }

    /**
     * Checks collisions between thrown bottles and enemies, applying damage if necessary.
     */
    checkThrowableCollisions() {
        this.world.throwableObjects.forEach(bottle => {
            this.world.level.enemies.forEach(enemy => {
                if (bottle.isColliding(enemy) && !bottle.hasHit) {
                    enemy.hit();
                    bottle.hasHit = true;
                    if (enemy instanceof Endboss) {
                        this.world.endbossHealthStatusBar.setPercentage(enemy.energy);
                    }
                }
            });
        });
    }

    /**
     * Checks the state of the endboss to determine if the game has been won.
     */
    checkEndbossState() {
        let endboss = this.world.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead() && endboss.isDeadAnimationComplete && !this.world.gameIsWon) {
            this.world.triggerGameWon();
        }
    }
}
