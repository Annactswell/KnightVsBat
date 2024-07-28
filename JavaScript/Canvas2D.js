export class Canvas2D {
  constructor({ CSS='#canvas', width=1000, height=1000 }) {
    this.canvas = document.querySelector(CSS);
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawSprite(sprite, x, y, width, height, angle) {
    const frame = Math.floor(sprite.frame);
    const length = sprite.endX - sprite.startX + 1;
    const frameX = sprite.startX + frame % length;
    const frameY = sprite.startY + Math.floor(frame / length);
    if (!angle) this.ctx.drawImage(sprite.image, frameX * sprite.width, frameY * sprite.height, sprite.width, sprite.height, x, y, width, height);
    else {
      // angle = Math.PI * angle / 180;
      this.ctx.save();
      this.ctx.translate(x + sprite.width / 2, y + sprite.height / 2);
      this.ctx.rotate(angle);
      this.ctx.drawImage(sprite.image, frameX * sprite.width, frameY * sprite.height, sprite.width, sprite.height, - width / 2, - height / 2, width, height);
      this.ctx.restore();
    }
// 309 647
// 



  }

  drawRect(x, y, width, height) {
    this.ctx.strokeRect(x, y, width, height);
  }

  fillRect(x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);
  }
}