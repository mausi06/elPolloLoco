class Endboss extends MovableObjetcs {
    height = 400;
    width = 250;
    y = 60;
    speed = 5;
    spotCharacter = false;
    isWalking = false;
    turnAroundDistance = 100;
    attackDistance = 70; // WICHTIG: Angriffsradius, ab dem der Boss angreift.
    energy = 100;
    isHurt = false;
    isAttacking = false;
    lastAttackTime = 0;

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
    Images_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
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
    Images_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    Images_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

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

    startLogic() {
        // Animationen
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.Images_DEAD);
            } else if (this.isHurt) {
                this.playAnimation(this.Images_HURT);
            } else if (this.isAttacking) {
                this.playAnimation(this.Images_ATTACK);
            } else if (this.spotCharacter && this.isWalking) {
                this.playAnimation(this.Images_WALKING);
            } else {
                this.playAnimation(this.Images_ALERT);
            }
        }, 200);

        // Bewegung und Logik
        setInterval(() => {
            // Endboss wird aktiv, wenn Charakter nah genug ist
            if (this.world.character.x >= 2200 && !this.spotCharacter) {
                this.spotCharacter = true;
                setTimeout(() => {
                    this.isWalking = true;
                }, this.Images_ALERT.length * 200);
            }
            
            // Wenn der Endboss den Charakter "gesehen" hat, prüfe die Bedingungen
            if (this.spotCharacter && !this.isHurt && !this.isDead()) {
                let distanceToCharacter = Math.abs(this.world.character.x - this.x);

                if (distanceToCharacter <= this.attackDistance) {
                    // Stoppt die Bewegung und startet den Angriff, wenn der Boss nah genug ist
                    if (!this.isAttacking) {
                        this.isWalking = false;
                        this.attack();
                    }
                } else if (!this.isAttacking) { // WICHTIG: Er läuft nur, wenn er nicht angreift!
                    this.isWalking = true;
                    // Läuft weiter, wenn der Boss zu weit entfernt ist
                    if (this.world.character.x < this.x - this.turnAroundDistance) {
                        this.moveLeft();
                        this.otherDirection = false;
                    } else if (this.world.character.x > this.x + this.turnAroundDistance) {
                        this.moveRight();
                        this.otherDirection = true;
                    }
                }
            }
        }, 1000 / 60);
    }
    
    hit() {
        this.energy -= 20;
        if (this.energy <= 0) {
            this.energy = 0;
        }

        this.isHurt = true;
        setTimeout(() => {
            this.isHurt = false;
        }, 500);
    }

    attack() {
        if (!this.isAttacking && !this.isHurt && !this.isDead()) {
            this.isAttacking = true;
            this.lastAttackTime = new Date().getTime();

            // Beendet den Angriffs-Zustand, nachdem die Animation durchgelaufen ist
            setTimeout(() => {
                this.isAttacking = false;
                // Nach dem Angriff soll der Boss wieder laufen, um den Charakter zu verfolgen
                this.isWalking = true; 
            }, this.Images_ATTACK.length * 200);
        }
    }
    
    isDead() {
        return this.energy == 0;
    }
}
