class MiniChicken extends MovableObjetcs {
  y = 350;

  width = 50;
  height = 70;

  Images_Walking = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  constructor() {
    super().loadImage(this.Images_Walking[0]);
    this.loadImages(this.Images_Walking);

    this.x = 600 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
        // 💡 NEU: Prüfe zuerst, ob 'world' existiert
        if (world && world.gameIsRunning) {
            this.moveLeft();
        }
    }, 1000 / 60);

    setInterval(() => {
        // 💡 NEU: Prüfe zuerst, ob 'world' existiert
        if (world && world.gameIsRunning) {
            this.playAnimation(this.Images_Walking);
        }
    }, 200);
}
}