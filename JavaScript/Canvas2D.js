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

  drawSprite({ sprite=null, x=0, y=0, width=0, height=0, rotate=null }) {
    const frame = Math.floor(sprite.frame);
    const length = sprite.endX - sprite.startX + 1;
    const frameX = sprite.startX + frame % length;
    const frameY = sprite.startY + Math.floor(frame / length);
    if (!rotate) {
      this.ctx.drawImage(sprite.image, frameX * sprite.width, frameY * sprite.height, sprite.width, sprite.height, x, y, width, height);
    } else {
      this.ctx.save();
      this.ctx.translate(rotate.centerX, rotate.centerY);
      this.ctx.rotate(-rotate.angle);
      this.ctx.drawImage(sprite.image, frameX * sprite.width, frameY * sprite.height, sprite.width, sprite.height, x - rotate.centerX, y - rotate.centerY, width, height);
      this.ctx.restore();
    }
  }

  drawRect(x, y, width, height) {  // 加入角度
    this.ctx.strokeRect(x, y, width, height);
  }

  fillRect(x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);
  }
}