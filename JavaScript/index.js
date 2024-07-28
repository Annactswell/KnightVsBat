/** @type { HTMLCanvasElement } */ 

import { Sprite } from './Sprite.js';
import { Canvas2D } from './Canvas2D.js';
import { Item } from './Item.js';

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
    fly: new Sprite({ src: './Images/bat/bat.png', width: 64, height: 64, startX: 0, endX: 3, startY: 0, endY: 0, rate: 15 })
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
  knightFight: function(knight) {

    // 结束攻击动作
    if ((knight.state === 'slashX' || knight.state === 'slashY' || knight.state === 'jump') && knight.sprite.isFinished) {
      knight.state = 'idle';
      knight.sprite = sprites.knight.idle;
      knight.sprite.isFinished = false;
    }

    switch (curKey) {
      case 'ArrowRight':
        knight.x += knight.speed;
        break;
      case 'ArrowLeft':
        knight.x -= knight.speed;
        break;

      case 'x': case 'X':
        if (knight.state !== 'idle') break;
        knight.state = 'slashX';
        knight.sprite = sprites.knight.slashX;
        knight.sprite.isFinished = false;

        items.fires.push(new Item({
          sprite: sprites.fire.iceBall.clone(),
          state: 'fly',
          logic: logics.fireFly,
          x: knight.x + 0.2 * knight.width,
          y: knight.y + 0.7 * knight.height,
          size: 6,
          speed: 30,
          angle: Math.PI
        }));

        break;

      case 'z': case 'Z':
        if (knight.state !== 'idle') break;
        knight.state = 'slashY';
        knight.sprite = sprites.knight.slashY;
        knight.sprite.isFinished = false;

        for (let i = 0; i < 6; i++) {
          items.fires.push(new Item({
            sprite: sprites.fire.iceBall.clone(),
            state: 'fly',
            logic: logics.fireFly,
            x: knight.x + 0.2 * knight.width,
            y: knight.y + 0.7 * knight.height,
            size: 6,
            speed: 30,
            angle: Math.PI - Math.PI * i / 12
          }));
        }
          
        break;

      // case 'c': case 'C':
      //   if (knight.state !== 'idle') break;
      //   knight.state = 'jump';
      //   knight.sprite = sprites.knight.idle;
        
      //   // 在这里写跳跃的逻辑

      //   knight.sprite.isFinished = false;
      //   break;

      default:
        break;
    }

    // 边界处理
    if (knight.x + 0.5 * knight.width > screen.width) knight.x = screen.width - 0.5 * knight.width;
    if (knight.x + 0.3 * knight.width < 0) knight.x = -0.3 * knight.width;
  },
  fireFly: function(fire) {
    fire.x += fire.speed * Math.cos(Math.PI - fire.angle);
    fire.y += fire.speed * Math.sin(-fire.angle);
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
      bat.x -= bat.speed;
      if (bat.x + bat.width < 0) bat.x = screen.width;
      if (bat.x > screen.width) bat.x = -bat.width;
    },
  }
}




const items = {
  knight: new Item({
    sprite: sprites.knight.idle.clone(),
    state: 'idle',
    logic: logics.knightFight,
    x: 0,
    y: screen.height * 0.7,
    size: 4,
    speed: 10
  }),
  bats: ((num) => {
    const bats = [];
    for (let i = 0; i < num; i++) {
      bats.push(new Item({
        sprite: sprites.bat.fly.clone(),
        state: 'fly',
        logic: logics.bat.fly,
        x: Math.random() * screen.width,
        y: Math.random() * screen.height * 0.6,
        size: 3,
        speed: 10
      }));
    }
    return bats;
  })(10),
  fires: [],
  backgrounds: (() => {
    let backgrounds = [];
    backgrounds.push(new Item({ sprite: sprites.background.sky.clone(), state: 'move', logic: logics.background.move, x: 0, y: 0, size: screen.height / sprites.background.sky.height, speed: 1}));
    backgrounds.push(new Item({ sprite: sprites.background.sky.clone(), state: 'move', logic: logics.background.move, x: screen.height / sprites.background.sky.height * sprites.background.sky.width, y: 0, size: screen.height / sprites.background.sky.height, speed: 1}));

    backgrounds.push(new Item({ sprite: sprites.background.tree1.clone(), state: 'move', logic: logics.background.move, x: 0, y: 0, size: screen.height / sprites.background.tree1.height, speed: 2}));
    backgrounds.push(new Item({ sprite: sprites.background.tree1.clone(), state: 'move', logic: logics.background.move, x: screen.height / sprites.background.tree1.height * sprites.background.tree1.width, y: 0, size: screen.height / sprites.background.tree1.height, speed: 2}));

    backgrounds.push(new Item({ sprite: sprites.background.tree2.clone(), state: 'move', logic: logics.background.move, x: 0, y: 0, size: screen.height / sprites.background.tree2.height, speed: 3}));
    backgrounds.push(new Item({ sprite: sprites.background.tree2.clone(), state: 'move', logic: logics.background.move, x: screen.height / sprites.background.tree2.height * sprites.background.tree2.width, y: 0, size: screen.height / sprites.background.tree2.height, speed: 3}));

    backgrounds.push(new Item({ sprite: sprites.background.tree3.clone(), state: 'move', logic: logics.background.move, x: 0, y: 0, size: screen.height / sprites.background.tree3.height, speed: 4}));
    backgrounds.push(new Item({ sprite: sprites.background.tree3.clone(), state: 'move', logic: logics.background.move, x: screen.height / sprites.background.tree3.height * sprites.background.tree3.width, y: 0, size: screen.height / sprites.background.tree3.height, speed: 4}));

    backgrounds.push(new Item({ sprite: sprites.background.tree4.clone(), state: 'move', logic: logics.background.move, x: 0, y: 0, size: screen.height / sprites.background.tree4.height, speed: 5}));
    backgrounds.push(new Item({ sprite: sprites.background.tree4.clone(), state: 'move', logic: logics.background.move, x: screen.height / sprites.background.tree4.height * sprites.background.tree4.width, y: 0, size: screen.height / sprites.background.tree4.height, speed: 5}));

    backgrounds.push(new Item({ sprite: sprites.background.ground.clone(), state: 'move', logic: logics.background.move, x: 0, y: screen.height * 0.75, size: 1, speed: 10}));
    backgrounds.push(new Item({ sprite: sprites.background.ground.clone(), state: 'move', logic: logics.background.move, x: sprites.background.ground.width, y: screen.height * 0.75, size: 1, speed: 10}));

    return backgrounds;
  })()
}



  




function animate() {
  screen.clear();

  items.backgrounds.forEach(background => background.animate(screen));
  items.bats.forEach(bat => bat.animate(screen));
  items.fires.forEach(fire => fire.animate(screen));
  items.knight.animate(screen);

  // 还没有移除火球

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / GAME_FRAME);
  
}

animate();



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
  console.log(keyboard.innerHTML);

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
    console.log(curKey);
  }));
}

setKeyboard();






