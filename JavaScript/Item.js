export class Item {
  constructor({ sprite=null, state='', logic=()=>{}, x=0, y=0, size=1, speed=10, angle=0 }) {
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
  }

  update() {
    this.logic(this);
    this.sprite.update(); 
  }

  // changeState(itemSprites, state) {
  //   this.state = state;
  //   this.sprite = itemSprites[state];
  //   this.sprite.isFinished = false;
  // }

  draw(screen) {
    // screen.drawRect(this.x, this.y, this.width, this.height);
    screen.drawSprite(this.sprite, this.x, this.y, this.width, this.height, this.angle);
  }

  animate(screen) {
    this.update();
    this.draw(screen);
  }
}
