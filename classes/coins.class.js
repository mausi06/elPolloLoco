class Coins extends MovableObjetcs{
  y = 300;

  width = 100;
  height = 100;

  Images_Walking = [
    'img/8_coin/coin_2.png',
  ];

  constructor(){
    super().loadImage(this.Images_Walking[0]);
    this.loadImages(this.Images_Walking);

    this.x = 300 + Math.random() * 1800;
    this.animate();
  }
   animate(){
    setInterval(() =>{
      this.playAnimation(this.Images_Walking)
    }, 200);
   }
}
