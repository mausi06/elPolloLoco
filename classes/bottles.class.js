class Bottle extends MovableObjetcs {
  y = 380;
  width = 50;
  height = 50;

  Images_BOTTLE = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
  ];

  constructor() {
    super().loadImage(this.Images_BOTTLE[0]);
    this.x = 300 + Math.random() * 1800;
  }
}