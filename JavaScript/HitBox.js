export class HitBox {
  constructor({ type='', centerX=0, centerY=0, width=0, height=0, angle=0, radius=0 }) {
    this.type = type;
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = angle;
    switch (this.type) {
      case 'rectangle':
        this.width = width;
        this.height = height;
        break;
      case 'circle':
        this.radius = radius;
        break;
      default:
        console.log('碰撞箱类型错误');
        break;
    }
  }

  isCollision(other) {
    if (this.type === 'rectangle' && other.type === 'rectangle') return this.rectRectCollision(this, other);
    if (this.type === 'rectangle' && other.type === 'circle') return this.rectCircleCollision(this, other);
    if (this.type === 'circle' && other.type === 'rectangle') return this.rectCircleCollision(other, this);
    if (this.type === 'circle' && other.type === 'circle') return this.circleCircleCollision(other, this);
    console.log('碰撞类型错误');
    return false;
  }

  circleCircleCollision(circle1, circle2) {
    const distance = Math.sqrt(Math.pow(circle1.centerX - circle2.centerX, 2) + Math.pow(circle1.centerY - circle2.centerY, 2));
    return distance <= circle1.radius + circle2.radius;
  }

  rectRectCollision(rect1, rect2) {  
    if (rect1.angle === 0 && rect2.angle === 0) {  // 未旋转时使用轴对齐边界框
      return (
        rect1.centerX < rect2.centerX + rect2.width &&
        rect1.centerX + rect1.width > rect2.centerX &&
        rect1.centerY < rect2.centerY + rect2.height &&
        rect1.centerY + rect1.height > rect2.centerY
      );
    } else return this.satCollision(rect1, rect2);  // 旋转时使用分离轴定理
  }

  rectCircleCollision(rect, circle) {
    const rectHalfWidth = rect.width / 2;
    const rectHalfHeight = rect.height / 2;
    const unrotatedCircleX = Math.cos(-rect.angle) * (circle.centerX - rect.centerX) - Math.sin(-rect.angle) * (circle.centerY - rect.centerY) + rect.centerX;  // 将圆心坐标逆时针旋转回原矩形角度
    const unrotatedCircleY = Math.sin(-rect.angle) * (circle.centerX - rect.centerX) + Math.cos(-rect.angle) * (circle.centerY - rect.centerY) + rect.centerY;
    const closestX = Math.max(rect.centerX - rectHalfWidth, Math.min(unrotatedCircleX, rect.centerX + rectHalfWidth));  // 找到矩形中最接近圆心的点
    const closestY = Math.max(rect.centerY - rectHalfHeight, Math.min(unrotatedCircleY, rect.centerY + rectHalfHeight));
    const distance = Math.sqrt(Math.pow(closestX - unrotatedCircleX, 2) + Math.pow(closestY - unrotatedCircleY, 2));  // 计算圆心与最近点之间的距离
    return distance < circle.radius;  // 如果距离小于圆的半径，则发生碰撞
  }

  satCollision(rect1, rect2) {  // 分离轴定理（SAT）碰撞检测
    
    const rect1Vertices = this.getVertices(rect1);  // 获取第一个矩形的顶点
    const rect2Vertices = this.getVertices(rect2);  // 获取第二个矩形的顶点
    const axes = [  // 获取所有分离轴
      ...this.getAxes(rect1Vertices),
      ...this.getAxes(rect2Vertices)
    ];
    for (let axis of axes) {  // 在每个轴上投影并检查是否有间隙
      const projection1 = this.projectVertices(rect1Vertices, axis);
      const projection2 = this.projectVertices(rect2Vertices, axis);
      if (!this.overlap(projection1, projection2)) return false;  // 如果在某个轴上没有重叠，则没有碰撞
    }
    return true; // 所有轴上都有重叠，则发生碰撞
  }

  getVertices(rect) {  // 获取矩形的顶点坐标
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    const angle = rect.angle;
    const vertices = [
      { x: rect.centerX - halfWidth, y: rect.centerY - halfHeight },
      { x: rect.centerX + halfWidth, y: rect.centerY - halfHeight },
      { x: rect.centerX + halfWidth, y: rect.centerY + halfHeight },
      { x: rect.centerX - halfWidth, y: rect.centerY + halfHeight }
    ];
    return vertices.map(vertex => {  // 根据矩形的旋转角度调整顶点坐标
      const x = rect.centerX + (vertex.x - rect.centerX) * Math.cos(angle) - (vertex.y - rect.centerY) * Math.sin(angle);
      const y = rect.centerY + (vertex.x - rect.centerX) * Math.sin(angle) + (vertex.y - rect.centerY) * Math.cos(angle);
      return { x, y };
    });
  }

  getAxes(vertices) {  // 获取顶点的分离轴
    const axes = [];
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[i + 1 === vertices.length ? 0 : i + 1];
      const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
      axes.push({ x: -edge.y, y: edge.x });  // 获取垂直于边的向量作为分离轴
    }
    return axes;
  }

  projectVertices(vertices, axis) {  // 在指定轴上投影顶点
    let min = Infinity;
    let max = -Infinity;
    for (let vertex of vertices) {
      const projection = vertex.x * axis.x + vertex.y * axis.y;
      min = Math.min(min, projection);
      max = Math.max(max, projection);
    }
    return { min, max };  // 返回投影范围
  }

  overlap(projection1, projection2) {  // 检查两个投影范围是否重叠
    return projection1.max >= projection2.min && projection2.max >= projection1.min;
  }

  drawOutline(screen) {
    screen.ctx.save();
    
    screen.ctx.translate(this.centerX, this.centerY);
    screen.ctx.rotate(this.angle);
    if (this.type === 'rectangle') {
      screen.ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else if (this.type === 'circle') {
      screen.ctx.beginPath();
      screen.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      screen.ctx.stroke();
    }
    screen.ctx.restore();
  }

  clone() {
    return new HitBox({
      type: this.type,
      centerX: this.centerX,
      centerY: this.centerY,
      width: this.width,
      height: this.height,
      angle: this.angle,
      radius: this.radius
    });
  }
  
};



