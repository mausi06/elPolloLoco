class ThrowableObject extends MovableObjetcs {
    Images_Bottle = [
      'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
      'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
      'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
      'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    
    // NEU: direction-Variable hinzugefügt
    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.Images_Bottle);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw(otherDirection); // Den neuen Parameter übergeben
        this.animate();
    }
    
    // NEU: Logik, die die Wurfrichtung ändert
    throw(otherDirection) {
        this.speedY = 20;
        this.applyGravity();
        
        let throwSpeed = 10;

        setInterval(() => {
            if (otherDirection) {
                // Wenn otherDirection true ist (Charakter schaut nach links), fliege nach links
                this.x -= throwSpeed;
            } else {
                // Ansonsten fliege nach rechts
                this.x += throwSpeed;
            }
        }, 25);
    }
    
    animate() {
        setInterval(() => {
            this.playAnimation(this.Images_Bottle);
        }, 60);
    }
}
