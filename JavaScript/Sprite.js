const GAME_FRAME = 50;

export class Sprite {
  constructor({ src='', width=1000, height=1000, startX=0, endX=0, startY=0, endY=0, rate=GAME_FRAME }) {
    this.image = new Image(); this.image.src = src;
    this.width = width; this.height = height;

    this.startX = startX; this.endX = endX;
    this.startY = startY; this.endY = endY;

    this.totalFrame = (endX - startX + 1) * (endY - startY + 1); 
    this.frame = 0;

    this.rate = rate;

    this.isFinished = false;
  }

  update() {
    this.frame += this.rate / GAME_FRAME;
    if (this.frame >= this.totalFrame) {
      this.isFinished = true;
      this.frame = 0;
    }
  }

  clone() {
    return new Sprite({
      src: this.image.src,
      width: this.width,
      height: this.height,
      startX: this.startX,
      endX: this.endX,
      startY: this.startY,
      endY: this.endY,
      rate: this.rate
    });
  }
}

