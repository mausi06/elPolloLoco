class DrawableObject{
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  width = 100;
  height = 150;
  
    
  loadImage(path){
    this.img = new Image(); 
    this.img.src = path;
  }
  
  draw(ctx) {
    if (this.isGameOverScreen) {
      ctx.drawImage(this.img, 0, 0, 720, 480);
    } else {
      try{
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      } catch(e){
        console.warn('Error loading image!', e);
        console.log('Could not load image', this.img.src);
        
      }
    }
  }

  drawBorder(ctx){
    if(this instanceof Character || this instanceof MiniChicken || this instanceof Chicken || this instanceof Endboss ){
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  loadImages(arr){
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}