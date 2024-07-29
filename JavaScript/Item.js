import { HitBox } from './HitBox.js'

export class Item {
  constructor({ sprite=null, state='', logic=()=>{}, x=0, y=0, size=1, speed=10, angle=0, hitBox=new HitBox('rectangle') }) {
    this.sprite = sprite.clone();
    this.state = state;
    this.logic = logic;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.angle = angle;
    this.width = this.sprite.width * this.size;
    this.height = this.sprite.height * this.size;

    this.hitBox = hitBox;
  }

  move({ x=0, y=0 }) {
    if (this.angle === 0) {
      this.x += this.speed * x;
      this.y += this.speed * y;
      this.hitBox.centerX += this.speed * x;
      this.hitBox.centerY += this.speed * y;
    } else {
      const movementX = this.speed * (x * Math.cos(this.angle) + y * Math.sin(this.angle));  // 可能是 -this.angle ？
      const movementY = this.speed * (x * Math.sin(-this.angle) + y * Math.cos(this.angle));
      this.x += movementX;
      this.y += movementY;
      this.hitBox.centerX += movementX;
      this.hitBox.centerY += movementY;
    }
  }

  moveTo({ x=0, y=0 }) {
    this.hitBox.centerX += x - this.x;
    this.hitBox.centerY += y - this.y;
    this.x = x;
    this.y = y;
  }

  rotate({angle=0}) {
    this.angle += angle;
    this.hitBox.angle += angle;
  }

  update() {
    this.logic(this);
    this.sprite.update(); 
  }

  draw(screen) {
    // screen.drawRect(this.x, this.y, this.width, this.height);
    screen.drawSprite({
      sprite: this.sprite,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      this: this.angle,
      rotate: this.angle === 0 ? null : {
        centerX: this.hitBox.centerX,
        centerY: this.hitBox.centerY,
        angle: this.hitBox.angle
      }
    });
    this.hitBox.drawOutline(screen);
  }

  animate(screen) {
    this.update();
    this.draw(screen);
  }

  clone() {
    return new Item({
      sprite: this.sprite,
      state: this.state,
      logic: this.logic,
      x: this.x,
      y: this.y,
      size: this.size,
      speed: this.speed,
      angle: this.angle,
      hitBox: this.hitBox.clone()
    })
  }
}


