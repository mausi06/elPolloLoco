class Character extends MovableObjetcs {
  y = 80;
  height = 250;
  speed = 10;
  Images_Walking = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png'
  ];
  Images_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];
  Images_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];
  Images_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png'
  ]

  world;
  walking_sound = new Audio('audio/walking-sound-effect-272246.mp3');
  jump_sound = new Audio('audio/jump.mp3');
  hurt_sound = new Audio('audio/hurt.mp3');

  constructor() {
    super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImages(this.Images_Walking);
    this.loadImages(this.Images_JUMPING);
    this.loadImages(this.Images_DEAD);
    this.loadImages(this.Images_HURT);
    this.applyGravity();
    this.animate();
    this.walking_sound.loop = true;
  }

  /**
   * NEU: Überschreibt die hit()-Methode von MovableObjetcs.
   * Führt die Logik der übergeordneten Klasse aus und spielt dann den hurt_sound ab.
   */
  hit() {
    super.hit(); // Ruft die ursprüngliche hit()-Methode auf
    this.hurt_sound.play();
  }

  /**
   * NEU: Überschreibt die jump()-Methode von MovableObjetcs, um den Sprung-Sound zu spielen.
   */
  jump() {
    super.jump(); // Ruft die ursprüngliche jump()-Methode auf
    this.jump_sound.play();
  }


  animate() {
    // Set Interval for movement and sound
    setInterval(() => {
      if (this.isGameActive()) {
        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;

        if (isMoving && !this.isAboveGround()) {
          this.walking_sound.play().catch(e => console.log('Sound play error:', e));
        } else {
          this.walking_sound.pause();
        }

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
          this.moveRight();
          this.otherDirection = false;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
          this.moveLeft();
          this.otherDirection = true;
        }

        if (this.world.keyboard.UP && !this.isAboveGround()) {
          this.jump(); // Ruft jetzt die überschriebene jump()-Methode auf
        }
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);


    // Set Interval for animations
    setInterval(() => {
      if (this.isGameActive()) {
        if (this.isDead()) {
          this.playAnimation(this.Images_DEAD);
        } else if (this.isHurt()) {
          this.playAnimation(this.Images_HURT);
          // HIER ENTFERNT: Der hurt_sound wird jetzt in der hit()-Methode gespielt
        } else if (this.isAboveGround()) {
          this.playAnimation(this.Images_JUMPING);
        } else {
          if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.Images_Walking);
          }
        }
      } else {
        if (this.isDead()) {
          this.playAnimation(this.Images_DEAD);
        }
      }
    }, 50);
  }
}
