/** @type { HTMLCanvasElement } */ 

import { Sprite } from './Sprite.js';
import { Canvas2D } from './Canvas2D.js';
import { Item } from './Item.js';
import { HitBox } from './HitBox.js';

let curKey = 0;
document.addEventListener('keydown', event => curKey = event.key);
document.addEventListener('keyup', event => curKey = 0);

const GAME_FRAME = 50;


const screen = new Canvas2D({
  CSS: '#canvas', 
  width: 1000,
  height: 1000
});


const sprites = {
  knight: {
    idle: new Sprite({ src: './Images/knight/knight.png', width: 86, height: 49, startX: 0, endX: 5, startY: 0, endY: 0, rate: 15 }),
    slashX: new Sprite({ src: './Images/knight/knight.png', width: 86, height: 49, startX: 0, endX: 6, startY: 1, endY: 1, rate: 15 }),
    slashY: new Sprite({ src: './Images/knight/knight.png', width: 86, height: 49, startX: 0, endX: 4, startY: 2, endY: 2, rate: 15 }),
    death: new Sprite({ src: './Images/knight/knight.png', width: 86, height: 49, startX: 0, endX: 6, startY: 3, endY: 3, rate: 15 }),
    jump: new Sprite({ src: './Images/knight/knight.png', width: 86, height: 49, startX: 0, endX: 5, startY: 0, endY: 0, rate: 15 })
  },
  bat: {
    fly: new Sprite({ src: './Images/bat/bat.png', width: 64, height: 64, startX: 0, endX: 3, startY: 0, endY: 0, rate: 20 })
  },
  fire: {
    iceBall: new Sprite({ src: './Images/fire/iceBall.png', width: 84, height: 9, startX: 0, endX: 9, startY: 0, endY: 5, rate: 50 })
  },
  background: {
    cloud: new Sprite({ src: './Images/background/cloud.png', width: 4000, height: 312, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
    ground: new Sprite({ src: './Images/background/ground.png', width: 4000, height: 700, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
    sky: new Sprite({ src: './Images/background/sky.png', width: 4000, height: 1200, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
    tree1: new Sprite({ src: './Images/background/trees-1.png', width: 4000, height: 1200, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
    tree2: new Sprite({ src: './Images/background/trees-2.png', width: 4000, height: 1200, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
    tree3: new Sprite({ src: './Images/background/trees-3.png', width: 4000, height: 1200, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
    tree4: new Sprite({ src: './Images/background/trees-4.png', width: 4000, height: 1200, startX: 0, endX: 0, startY: 0, endY: 0, rate: 10 }),
  } 
}


const logics = {
  knight: {
    fight: function(knight) {

      // 结束攻击动作
      if ((knight.state === 'slashX' || knight.state === 'slashY' || knight.state === 'jump') && knight.sprite.isFinished) {
        knight.state = 'idle';
        knight.sprite = sprites.knight.idle;
        knight.sprite.isFinished = false;
      }

      let iceBall = null;
      
  
      switch (curKey) {
        case 'ArrowRight':
          knight.move({x: 1});
          break;
        case 'ArrowLeft':
          knight.move({x: -1});
          break;
        case 'ArrowUp':
          knight.move({y: -1});
          break;
        case 'ArrowDown':
          knight.move({y: 1});
          break;
  
        case 'x': case 'X':
          if (knight.state !== 'idle') break;
          knight.state = 'slashX';
          knight.sprite = sprites.knight.slashX;
          knight.sprite.isFinished = false;

          iceBall = staticItems.fire.iceBall.clone();
          iceBall.moveTo({ x: knight.x + knight.width * -0.75, y: knight.y + knight.height * 0.5 });
          dynamicItems.fires.push(iceBall);
  
          break;
  
        case 'z': case 'Z':
          if (knight.state !== 'idle') break;
          knight.state = 'slashY';
          knight.sprite = sprites.knight.slashY;
          knight.sprite.isFinished = false;
  
          for (let i = 0; i < 6; i++) {
            iceBall = staticItems.fire.iceBall.clone();
            iceBall.moveTo({ x: knight.x + knight.width * -0.75, y: knight.y + knight.height * 0.5 });
            iceBall.rotate({ angle: i * Math.PI / 12 });
            dynamicItems.fires.push(iceBall);
          }
            
            
          break;
  
        case 's': case 'S':
          knight.state = 'death';
          knight.sprite = sprites.knight.death;
          knight.sprite.isFinished = false;
          
        default:
          break;
      }          
  
      // 边界处理，重构
      // if (knight.hitBox.centerX + knight.hitBox.width / 2 > screen.width) knight.move({ x: (screen.width - knight.hitBox.centerX + knight.hitBox.width / 2) / knight.speed });
      if (knight.hitBox.centerX + knight.hitBox.width / 2 > screen.width) knight.move({ x: -1 });
      if (knight.hitBox.centerX - knight.hitBox.width / 2 < 0) knight.move({ x: 1 });
      if (knight.hitBox.centerY + knight.hitBox.height / 2 > screen.height) knight.move({ y: -1 });
      if (knight.hitBox.centerY - knight.hitBox.height / 2 < 0) knight.move({ y: 1 });
    },
  },
  fire: {
    fly: function(fire) {
      // return;
      fire.move({ x: 1 });

      // 之后重构
      dynamicItems.bats = dynamicItems.bats.filter(bat => !fire.hitBox.isCollision(bat.hitBox));
        
    }
  },
  background: {
    move: function(background) {
      background.x -= background.speed;
      if (background.x + background.width < 0)
        background.x += 2 * background.width;
    }
  },
  bat: {
    fly: function(bat) {
      bat.move({ x: -1 });
    
    },
  }
}


const staticItems = {
  knight: null,
  bat: null,
  fire: {
    iceBall: null
  },
  backgrounds: {
    sky: null
  }
}
function setStaticItems() {
  
  function setKnight() {
    const sprite = sprites.knight.idle.clone();
    const state = 'idle';
    const logic = logics.knight.fight;
    const x = 0;  // 可修改
    const y = screen.height * 0.7;
    const size = 4;
    const speed = 10;
    const width = sprite.width * size;
    const height = sprite.height * size;
    const hitBox = new HitBox({
      type: 'rectangle',
      centerX: x + width * 0.42,
      centerY: y + height * 0.6,
      width: width * 0.25,
      height: height * 0.75,
      angle: 0
    });
    staticItems.knight = new Item({ sprite, state, logic, x, y, size, speed, hitBox });
  }
  setKnight();
  
  function setBat() {
    const sprite = sprites.bat.fly.clone();
    const state = 'fly';
    const logic = logics.bat.fly;
    const x = 0;
    const y = 0;
    const size = 3;
    const speed = 10;
    const width = sprite.width * size;
    const height = sprite.height * size;
    const hitBox = new HitBox({
      type: 'rectangle',
      centerX: x + width * 0.46,
      centerY: y + height * 0.5,
      width: width * 0.3,
      height: height * 0.3,
      angle: 0
    });
    staticItems.bat = new Item({ sprite, state, logic, x, y, size, speed, hitBox });
  }
  setBat();
  
  function setBackgrounds() {
    const state = 'move';
    const logic = logics.background.move;
    const x = 0, y = 0;
    const hitBox = new HitBox({
      type: 'rectangle',  // 可能需要改为原图的大小
      centerX: screen.width / 2,
      centerY: screen.height / 2,
      width: screen.width,
      height: screen.height,
      angle: 0
    })

    staticItems.backgrounds.sky = new Item({
      sprite: sprites.background.sky.clone(),
      size: screen.height / sprites.background.sky.height,
      speed: 1,
      state, logic, x, y, hitBox
    });

    for (let i = 1; i <= 4; i++) {
      staticItems.backgrounds[`tree${i}`] = new Item({
        sprite: sprites.background[`tree${i}`].clone(),
        size: screen.height / sprites.background[`tree${i}`].height,
        speed: Math.floor(Math.pow(i, 1.3)) + 1,
        state, logic, x, y, hitBox
      });
    }

    staticItems.backgrounds.ground = new Item({
      sprite: sprites.background.ground.clone(),
      size: screen.height / sprites.background.ground.height,
      speed: 7,
      state, logic, x, hitBox,
      y: 0.7 * screen.height
    });
  }
  setBackgrounds();

  function setFire() {
    const sprite = sprites.fire.iceBall.clone();
    const state = 'fly';
    const logic = logics.fire.fly;
    const x = 300;
    const y = 300;
    const size = 6;
    const speed = 30;
    const angle = 0;
    const width = sprite.width * size;
    const height = sprite.height * size;
    const hitBox = new HitBox({
      type: 'circle',
      centerX: x + width * 0.95,
      centerY: y + height * 0.45,
      radius: height * 0.75,
      angle: 0
    });
    staticItems.fire.iceBall = new Item({ sprite, state, logic, x, y, size, speed, angle, hitBox });
  }
  setFire();
}
setStaticItems();
  

const dynamicItems = {
  knight: null,
  bats: [],
  fires: [],
  backgrounds: []
}
function setDynamicItems() {
  Object.values(staticItems.backgrounds).forEach(background => {  // 创建背景
    const backgroundCopy = background.clone();
    dynamicItems.backgrounds.push(backgroundCopy.clone());
    backgroundCopy.x += backgroundCopy.width;
    dynamicItems.backgrounds.push(backgroundCopy.clone());
  });

  dynamicItems.knight = staticItems.knight.clone();  // 创建骑士

  setInterval(() => {  // 创建蝙蝠
    const bat = staticItems.bat.clone();
    bat.moveTo({
      x: screen.width + Math.random() * screen.width * 0.3,
      y: Math.random() * screen.height * 0.7
    })
    dynamicItems.bats.push(bat);
  }, 200);
}


function animate() {
  screen.clear();

  dynamicItems.backgrounds.forEach(background => background.animate(screen));
  dynamicItems.bats.forEach(bat => bat.animate(screen));
  dynamicItems.fires.forEach(fire => fire.animate(screen));
  dynamicItems.knight.animate(screen);

  // 还没有移除火球

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / GAME_FRAME);
  
}


function setKeyboard() {
  let keyboardCharacters = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+', '←'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
    ['↑'],
    ['←', '↓', '→']
  ];
  const keyboard = document.querySelector('.keyboard');
  for (let i = 0; i < keyboardCharacters.length; i++) {
    for (let j = 0; j < keyboardCharacters[i].length; j++) {
      keyboard.innerHTML += `<button class='key'>${keyboardCharacters[i][j]}</button>`;
    }
    keyboard.innerHTML += '<br>';
  }
  // console.log(keyboard.innerHTML);

  const keys = document.querySelectorAll('.keyboard .key');
  keys.forEach(key => key.addEventListener('click', function() {
    switch (key.innerHTML) {
      case '←':
        curKey = 'ArrowLeft';
        break;
      case '→':
        curKey = 'ArrowRight';
        break;
      case '↑':
        curKey = 'ArrowUp';
        break;
      case '↓':
        curKey = 'ArrowDown';
        break;
      default:
        curKey = key.innerHTML;
        break;
    }
    // console.log(curKey);
  }));
}


function gameStart() {
  setKeyboard();  // 打印键盘
  setDynamicItems();  // 创建需要创建的Item实例
  animate();  // 动画
}
gameStart();



