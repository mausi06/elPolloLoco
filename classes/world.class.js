class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthStatusBar = new HealthStatusBar();
    coinStatusBar = new CoinStatusBar();
    totalCoins;
    collectedCoins = 0;
    bottleStatusBar = new BottleStatusBar();
    totalBottles;
    collectedBottles = 0;
    gameIsRunning = true;
    
    characterIsDead = false;
    gameOver;
    throwableObjects = [];

    endbossHealthStatusBar = new EndbossHealthStatusBar();
    
    game_music = new Audio('audio/game-music.mp3');
    game_over_sound = new Audio('audio/game-over.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.totalCoins = this.level.coins.length;
        this.collectedCoins = 0;
        this.totalBottles = this.level.bottles.length;
        this.collectedBottles = 0;

        this.healthStatusBar = new HealthStatusBar();
        this.coinStatusBar = new CoinStatusBar();
        this.coinStatusBar.setPercentage(0, this.totalCoins);
        this.bottleStatusBar = new BottleStatusBar();
        this.bottleStatusBar.setPercentage(0, this.totalBottles);
        this.endbossHealthStatusBar = new EndbossHealthStatusBar();

        this.gameOver = new GameOver();

        this.draw();
        this.setWorld();
        this.checkCollisions();

        //this.game_music.loop = true;
        //this.game_music.play();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.startLogic();
            }
        });
    }

    checkCollisions() {
        setInterval(() => {
            if (this.gameIsRunning) {
                if (this.character.isDead() && !this.characterIsDead) {
                    this.triggerGameOver();
                }

                if (!this.characterIsDead) {
                    this.level.enemies.forEach((enemy) => {
                        if (this.character.isColliding(enemy)) {
                            // Wichtige Änderung hier: !enemy.isAttacking wurde entfernt
                            if (enemy instanceof Endboss) {
                                let timeSinceLastAttack = new Date().getTime() - enemy.lastAttackTime;
                                // 1500 ms = 1.5 Sekunden Abklingzeit
                                if (timeSinceLastAttack > 1500) { 
                                    enemy.attack(); 
                                    this.character.hit();
                                    this.healthStatusBar.setPercentage(this.character.energy);
                                }
                            } else {
                                this.character.hit();
                                this.healthStatusBar.setPercentage(this.character.energy);
                            }
                        }
                    });

                    this.level.coins.forEach((coin, index) => {
                        if (this.character.isColliding(coin)) {
                            this.level.coins.splice(index, 1);
                            this.collectedCoins++;
                            this.coinStatusBar.setPercentage(this.collectedCoins, this.totalCoins);
                        }
                    });

                    this.level.bottles.forEach((bottle, index) => {
                        if (this.character.isColliding(bottle)) {
                            this.level.bottles.splice(index, 1);
                            this.collectedBottles++;
                            this.bottleStatusBar.setPercentage(this.collectedBottles, this.totalBottles);
                        }
                    });
                }

                if (this.keyboard.SPACE && this.collectedBottles > 0) {
                    let bottle = new ThrowableObject(this.character.x, this.character.y, this.character.otherDirection);
                    this.throwableObjects.push(bottle);
                    this.collectedBottles--;
                    this.bottleStatusBar.setPercentage(this.collectedBottles, this.totalBottles);
                    this.keyboard.SPACE = false;
                }
                
                this.throwableObjects.forEach((bottle, bottleIndex) => {
                    this.level.enemies.forEach((enemy, enemyIndex) => {
                        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                            enemy.hit();
                            this.throwableObjects.splice(bottleIndex, 1);
                            this.endbossHealthStatusBar.setPercentage(enemy.energy);
                        }
                    });
                });
            }
        }, 200);
    }

    triggerGameOver() {
        this.characterIsDead = true; 
        this.gameIsRunning = false; 
        this.gameOver.startAnimation();
        this.game_music.pause();
        this.game_over_sound.play();
    }
        
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.spotCharacter && !endboss.isDead()) {
            this.endbossHealthStatusBar.setPercentage(endboss.energy);
            this.addToMap(this.endbossHealthStatusBar);
        }
        
        if (this.gameOver.isAnimating || this.gameOver.isGameOver) {
            this.gameOver.draw(this.ctx);
        }
        
        this.gameOver.animate();

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawBorder(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
