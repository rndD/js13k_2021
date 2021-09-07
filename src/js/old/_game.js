import { isMobile } from "./utils/mobile";
import { checkMonetization, isMonetizationEnabled } from "./utils/monetization";
import { loadSongs, playSound, playSong } from "./utils/sound";
import { save, load } from "./utils/storage";
import {
  ALIGN_LEFT,
  ALIGN_CENTER,
  ALIGN_RIGHT,
  CHARSET_SIZE,
  initCharset,
  renderText,
} from "./utils/text";
import { getRandSeed, setRandSeed, lerp, loadImg } from "./utils/utils";
import {
  constrainToViewport,
  testAABBCollision,
  correctAABBCollision,
} from "./utils/collisions";
import TILESET from "../img/tileset.webp";
import { GAME_VARIABLES } from "./game-vars";

let screen = GAME_VARIABLES.GAME_SCREENS.TITLE_SCREEN;
let tileset; // characters sprite, embedded as a base64 encoded dataurl by build script
let viewportOffsetX = 0;
let viewportOffsetY = 0;

// factor by which to reduce both moveX and moveY when player moving diagonally
// so they don't seem to move faster than when traveling vertically or horizontally
const RADIUS_ONE_AT_45_DEG = Math.cos(Math.PI / 4);
const TIME_TO_FULL_SPEED = 150; // in millis, duration till going full speed in any direction

let countdown; // in seconds
let hero;
let entities;

// LOOP VARIABLES

let currentTime;
let elapsedTime;
let lastTime;
let requestId;
let running = true;

// GAMEPLAY HANDLERS

function unlockExtraContent() {
  // NOTE: remember to update the value of the monetization meta tag in src/index.html to your payment pointer
}

function startGame() {
  // setRandSeed(getRandSeed());
  // if (isMonetizationEnabled()) { unlockExtraContent() }
  countdown = 60;
  viewportOffsetX = viewportOffsetY = 0;
  hero = createEntity(
    "hero",
    GAME_VARIABLES.VIEWPORT.width / 2,
    GAME_VARIABLES.VIEWPORT.height / 2
  );
  entities = [
    hero,
    createEntity("foe", 10, 10),
    createEntity("foe", 630 - 16, 10),
    createEntity("foe", 630 - 16, 470 - 18),
    createEntity("foe", 300, 200),
    createEntity("foe", 400, 300),
    createEntity("foe", 500, 400),
    createEntity("foe", 10, 470 - 18),
    createEntity("foe", 100, 100),
    createEntity("foe", 100, 118),
    createEntity("foe", 116, 118),
    createEntity("foe", 116, 100),
  ];
  renderMap();
  screen = GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN;
}

function updateCameraWindow() {
  // edge snapping
  if (
    0 < viewportOffsetX &&
    hero.x < viewportOffsetX + GAME_VARIABLES.CAMERA_WINDOW_X
  ) {
    viewportOffsetX = Math.max(0, hero.x - GAME_VARIABLES.CAMERA_WINDOW_X);
  } else if (
    viewportOffsetX <
      GAME_VARIABLES.MAP.width - GAME_VARIABLES.VIEWPORT.width &&
    hero.x + hero.w > viewportOffsetX + GAME_VARIABLES.CAMERA_WINDOW_WIDTH
  ) {
    viewportOffsetX = Math.min(
      GAME_VARIABLES.MAP.width - GAME_VARIABLES.VIEWPORT.width,
      hero.x + hero.w - GAME_VARIABLES.CAMERA_WINDOW_WIDTH
    );
  }
  if (
    0 < viewportOffsetY &&
    hero.y < viewportOffsetY + GAME_VARIABLES.CAMERA_WINDOW_Y
  ) {
    viewportOffsetY = Math.max(0, hero.y - GAME_VARIABLES.CAMERA_WINDOW_Y);
  } else if (
    viewportOffsetY <
      GAME_VARIABLES.MAP.height - GAME_VARIABLES.VIEWPORT.height &&
    hero.y + hero.h > viewportOffsetY + GAME_VARIABLES.CAMERA_WINDOW_HEIGHT
  ) {
    viewportOffsetY = Math.min(
      GAME_VARIABLES.MAP.height - GAME_VARIABLES.VIEWPORT.height,
      hero.y + hero.h - GAME_VARIABLES.CAMERA_WINDOW_HEIGHT
    );
  }
}

function createEntity(type, x = 0, y = 0) {
  const action = "move";
  const sprite = GAME_VARIABLES.ATLAS[type][action][0];
  return {
    action,
    frame: 0,
    frameTime: 0,
    h: sprite.h,
    moveDown: 0,
    moveLeft: 0,
    moveRight: 0,
    moveUp: 0,
    moveX: 0,
    moveY: 0,
    speed: GAME_VARIABLES.ATLAS[type].speed,
    type,
    w: sprite.w,
    x,
    y,
  };
}

function updateHeroInput() {
  // TODO can touch & desktop be handled the same way?
  if (isTouch) {
    hero.moveX = hero.moveLeft + hero.moveRight;
    hero.moveY = hero.moveUp + hero.moveDown;
  } else {
    if (hero.moveLeft || hero.moveRight) {
      hero.moveX =
        (hero.moveLeft > hero.moveRight ? -1 : 1) *
        lerp(
          0,
          1,
          (currentTime - Math.max(hero.moveLeft, hero.moveRight)) /
            TIME_TO_FULL_SPEED
        );
    } else {
      hero.moveX = 0;
    }
    if (hero.moveDown || hero.moveUp) {
      hero.moveY =
        (hero.moveUp > hero.moveDown ? -1 : 1) *
        lerp(
          0,
          1,
          (currentTime - Math.max(hero.moveUp, hero.moveDown)) /
            TIME_TO_FULL_SPEED
        );
    } else {
      hero.moveY = 0;
    }
  }
}

function updateEntity(entity) {
  // update animation frame
  entity.frameTime += elapsedTime;
  if (entity.frameTime > GAME_VARIABLES.FRAME_DURATION) {
    entity.frameTime -= GAME_VARIABLES.FRAME_DURATION;
    entity.frame += 1;
    entity.frame %= GAME_VARIABLES.ATLAS[entity.type][entity.action].length;
  }
  // update position
  const scale = entity.moveX && entity.moveY ? RADIUS_ONE_AT_45_DEG : 1;
  const distance = entity.speed * elapsedTime * scale;
  entity.x += distance * entity.moveX;
  entity.y += distance * entity.moveY;
}

function update() {
  switch (screen) {
    case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
      countdown -= elapsedTime;
      if (countdown < 0) {
        screen = GAME_VARIABLES.GAME_SCREENS.END_SCREEN;
      }
      updateHeroInput();
      entities.forEach(updateEntity);
      entities.slice(1).forEach((entity) => {
        const test = testAABBCollision(hero, entity);
        if (test.collide) {
          correctAABBCollision(hero, entity, test);
        }
      });
      constrainToViewport(hero, GAME_VARIABLES.MAP);
      updateCameraWindow();
      break;
  }
}

// RENDER HANDLERS

function blit() {
  // copy backbuffer onto visible canvas, scaling it to screen dimensions
  GAME_VARIABLES.CTX.drawImage(
    GAME_VARIABLES.VIEWPORT,
    0,
    0,
    GAME_VARIABLES.VIEWPORT.width,
    GAME_VARIABLES.VIEWPORT.height,
    0,
    0,
    c.width,
    c.height
  );
}

function render() {
  GAME_VARIABLES.VIEWPORT_CTX.fillStyle = "#000";
  GAME_VARIABLES.VIEWPORT_CTX.fillRect(
    0,
    0,
    GAME_VARIABLES.VIEWPORT.width,
    GAME_VARIABLES.VIEWPORT.height
  );

  switch (screen) {
    case GAME_VARIABLES.GAME_SCREENS.TITLE_SCREEN:
      renderText("title screen", CHARSET_SIZE, CHARSET_SIZE);
      renderText(
        isMobile ? "tap to start" : "press any key",
        GAME_VARIABLES.VIEWPORT.width / 2,
        GAME_VARIABLES.VIEWPORT.height / 2,
        ALIGN_CENTER
      );
      break;
    case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
      GAME_VARIABLES.VIEWPORT_CTX.drawImage(
        GAME_VARIABLES.MAP,
        // adjust x/y offset
        viewportOffsetX,
        viewportOffsetY,
        GAME_VARIABLES.VIEWPORT.width,
        GAME_VARIABLES.VIEWPORT.height,
        0,
        0,
        GAME_VARIABLES.VIEWPORT.width,
        GAME_VARIABLES.VIEWPORT.height
      );
      renderText("game screen", CHARSET_SIZE, CHARSET_SIZE);
      renderCountdown();
      // uncomment to debug mobile input handlers
      // renderDebugTouch();
      entities.forEach((entity) => renderEntity(entity));
      break;
    case GAME_VARIABLES.GAME_SCREENS.END_SCREEN:
      renderText("end screen", CHARSET_SIZE, CHARSET_SIZE);
      // renderText(monetizationEarned(), TEXT.width - CHARSET_SIZE, TEXT.height - 2*CHARSET_SIZE, ALIGN_RIGHT);
      break;
  }

  blit();
}

function renderCountdown() {
  const minutes = Math.floor(Math.ceil(countdown) / 60);
  const seconds = Math.ceil(countdown) - minutes * 60;
  renderText(
    `${minutes}:${seconds <= 9 ? "0" : ""}${seconds}`,
    GAME_VARIABLES.VIEWPORT.width - CHARSET_SIZE,
    CHARSET_SIZE,
    ALIGN_RIGHT
  );
}

function renderEntity(entity, ctx = GAME_VARIABLES.VIEWPORT_CTX) {
  const sprite = GAME_VARIABLES.ATLAS[entity.type][entity.action][entity.frame];
  // TODO skip draw if image outside of visible canvas
  ctx.drawImage(
    tileset,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    Math.round(entity.x - viewportOffsetX),
    Math.round(entity.y - viewportOffsetY),
    sprite.w,
    sprite.h
  );
}

function renderMap() {
  GAME_VARIABLES.MAP_CTX.fillStyle = "#000";
  GAME_VARIABLES.MAP_CTX.fillRect(
    0,
    0,
    GAME_VARIABLES.MAP.width,
    GAME_VARIABLES.MAP.height
  );
  // TODGAME_VARIABLES.O cache map by rendering static entities on the MAP canvas
}

// LOOP HANDLERS

function loop() {
  if (running) {
    requestId = requestAnimationFrame(loop);
    currentTime = performance.now();
    elapsedTime = (currentTime - lastTime) / 1000;
    update();
    render();
    lastTime = currentTime;
  }
}

function toggleLoop(value) {
  running = value;
  if (running) {
    lastTime = performance.now();
    loop();
  } else {
    cancelAnimationFrame(requestId);
  }
}

// EVENT HANDLERS

onload = async (e) => {
  // the real "main" of the game
  document.title = "RndD's js13k game 2021";

  onresize();
  //checkMonetization();

  await initCharset(GAME_VARIABLES.VIEWPORT_CTX);
  tileset = await loadImg(TILESET);
  // speak = await initSpeech();

  toggleLoop(true);
};

onresize = onrotate = function () {
  // scale canvas to fit screen while maintaining aspect ratio
  const scaleToFit = Math.min(
    innerWidth / GAME_VARIABLES.VIEWPORT.width,
    innerHeight / GAME_VARIABLES.VIEWPORT.height
  );
  c.width = GAME_VARIABLES.VIEWPORT.width * scaleToFit;
  c.height = GAME_VARIABLES.VIEWPORT.height * scaleToFit;
  // disable smoothing on image scaling
  GAME_VARIABLES.CTX.imageSmoothingEnabled =
    GAME_VARIABLES.MAP_CTX.imageSmoothingEnabled =
    GAME_VARIABLES.VIEWPORT_CTX.imageSmoothingEnabled =
      false;

  // fix key events not received on itch.io when game loads in full screen
  window.focus();
};

// UTILS

document.onvisibilitychange = function (e) {
  // pause loop and game timer when switching tabs
  toggleLoop(!e.target.hidden);
};

// INPUT HANDLERS

onkeydown = function (e) {
  // prevent itch.io from scrolling the page up/down
  e.preventDefault();

  if (!e.repeat) {
    switch (screen) {
      case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
        switch (e.code) {
          case "ArrowLeft":
          case "KeyA":
          case "KeyQ": // French keyboard support
            hero.moveLeft = currentTime;
            break;
          case "ArrowUp":
          case "KeyW":
          case "KeyZ": // French keyboard support
            hero.moveUp = currentTime;
            break;
          case "ArrowRight":
          case "KeyD":
            hero.moveRight = currentTime;
            break;
          case "ArrowDown":
          case "KeyS":
            hero.moveDown = currentTime;
            break;
          case "KeyP":
            // Pause game as soon as key is pressed
            toggleLoop(!running);
            break;
        }
        break;
    }
  }
};

onkeyup = function (e) {
  switch (screen) {
    case GAME_VARIABLES.GAME_SCREENS.TITLE_SCREEN:
      startGame();
      break;
    case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
        case "KeyQ": // French keyboard support
          if (hero.moveRight) {
            // reversing right while hero moving left
            hero.moveRight = currentTime;
          }
          hero.moveLeft = 0;
          break;
        case "ArrowRight":
        case "KeyD":
          if (hero.moveLeft) {
            // reversing left while hero moving right
            hero.moveLeft = currentTime;
          }
          hero.moveRight = 0;
          break;
        case "ArrowUp":
        case "KeyW":
        case "KeyZ": // French keyboard support
          if (hero.moveDown) {
            // reversing down while hero moving up
            hero.moveDown = currentTime;
          }
          hero.moveUp = 0;
          break;
        case "ArrowDown":
        case "KeyS":
          if (hero.moveUp) {
            // reversing up while hero moving down
            hero.moveUp = currentTime;
          }
          hero.moveDown = 0;
          break;
      }
      break;
    case GAME_VARIABLES.GAME_SCREENS.END_SCREEN:
      switch (e.code) {
        case "KeyT":
          open(
            `https://twitter.com/intent/tweet?text=viral%20marketing%20message%20https%3A%2F%2Fgoo.gl%2F${"some tiny Google url here"}`,
            "_blank"
          );
          break;
        default:
          screen = GAME_VARIABLES.GAME_SCREENS.TITLE_SCREEN;
          break;
      }
      break;
  }
};

// MOBILE INPUT HANDLERS

let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;
let MIN_DISTANCE = 30; // in px
let touches = [];
let isTouch = false;

// adding onmousedown/move/up triggers a MouseEvent and a PointerEvent
// on platform that support both (duplicate event, pointer > mouse || touch)
ontouchstart = onpointerdown = function (e) {
  e.preventDefault();
  switch (screen) {
    case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
      isTouch = true;
      [maxX, maxY] = [minX, minY] = pointerLocation(e);
      break;
  }
};

ontouchmove = onpointermove = function (e) {
  e.preventDefault();
  switch (screen) {
    case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
      if (minX && minY) {
        setTouchPosition(pointerLocation(e));
      }
      break;
  }
};

ontouchend = onpointerup = function (e) {
  e.preventDefault();
  switch (screen) {
    case GAME_VARIABLES.GAME_SCREENS.TITLE_SCREEN:
      startGame();
      break;
    case GAME_VARIABLES.GAME_SCREENS.GAME_SCREEN:
      isTouch = false;
      // stop hero
      hero.moveLeft = hero.moveRight = hero.moveDown = hero.moveUp = 0;
      // end touch
      minX = minY = maxX = maxY = 0;
      break;
    case GAME_VARIABLES.GAME_SCREENS.END_SCREEN:
      screen = GAME_VARIABLES.GAME_SCREENS.TITLE_SCREEN;
      break;
  }
};

// utilities
function pointerLocation(e) {
  return [
    e.pageX || e.changedTouches[0].pageX,
    e.pageY || e.changedTouches[0].pageY,
  ];
}

function setTouchPosition([x, y]) {
  // touch moving further right
  if (x > maxX) {
    maxX = x;
    hero.moveRight = lerp(0, 1, (maxX - minX) / MIN_DISTANCE);
  }
  // touch moving further left
  else if (x < minX) {
    minX = x;
    hero.moveLeft = -lerp(0, 1, (maxX - minX) / MIN_DISTANCE);
  }
  // touch reversing left while hero moving right
  else if (x < maxX && hero.moveX >= 0) {
    minX = x;
    hero.moveRight = 0;
  }
  // touch reversing right while hero moving left
  else if (minX < x && hero.moveX <= 0) {
    maxX = x;
    hero.moveLeft = 0;
  }

  // touch moving further down
  if (y > maxY) {
    maxY = y;
    hero.moveDown = lerp(0, 1, (maxY - minY) / MIN_DISTANCE);
  }
  // touch moving further up
  else if (y < minY) {
    minY = y;
    hero.moveUp = -lerp(0, 1, (maxY - minY) / MIN_DISTANCE);
  }
  // touch reversing up while hero moving down
  else if (y < maxY && hero.moveY >= 0) {
    minY = y;
    hero.moveDown = 0;
  }
  // touch reversing down while hero moving up
  else if (minY < y && hero.moveY <= 0) {
    maxY = y;
    hero.moveUp = 0;
  }

  // uncomment to debug mobile input handlers
  // addDebugTouch(x, y);
}

function addDebugTouch(x, y) {
  touches.push([
    (x / innerWidth) * GAME_VARIABLES.VIEWPORT.width,
    (y / innerHeight) * GAME_VARIABLES.VIEWPORT.height,
  ]);
  if (touches.length > 10) {
    touches = touches.slice(touches.length - 10);
  }
}

function renderDebugTouch() {
  let x = (maxX / innerWidth) * GAME_VARIABLES.VIEWPORT.width;
  let y = (maxY / innerHeight) * GAME_VARIABLES.VIEWPORT.height;
  renderDebugTouchBound(x, x, 0, GAME_VARIABLES.VIEWPORT.height, "#f00");
  renderDebugTouchBound(0, GAME_VARIABLES.VIEWPORT.width, y, y, "#f00");
  x = (minX / innerWidth) * GAME_VARIABLES.VIEWPORT.width;
  y = (minY / innerHeight) * GAME_VARIABLES.VIEWPORT.height;
  renderDebugTouchBound(x, x, 0, GAME_VARIABLES.VIEWPORT.height, "#ff0");
  renderDebugTouchBound(0, GAME_VARIABLES.VIEWPORT.width, y, y, "#ff0");

  if (touches.length) {
    GAME_VARIABLES.VIEWPORT_CTX.strokeStyle =
      GAME_VARIABLES.VIEWPORT_CTX.fillStyle = "#02d";
    GAME_VARIABLES.VIEWPORT_CTX.beginPath();
    [x, y] = touches[0];
    GAME_VARIABLES.VIEWPORT_CTX.moveTo(x, y);
    touches.forEach(function ([x, y]) {
      GAME_VARIABLES.VIEWPORT_CTX.lineTo(x, y);
    });
    GAME_VARIABLES.VIEWPORT_CTX.stroke();
    GAME_VARIABLES.VIEWPORT_CTX.closePath();
    GAME_VARIABLES.VIEWPORT_CTX.beginPath();
    [x, y] = touches[touches.length - 1];
    GAME_VARIABLES.VIEWPORT_CTX.arc(x, y, 2, 0, 2 * Math.PI);
    GAME_VARIABLES.VIEWPORT_CTX.fill();
    GAME_VARIABLES.VIEWPORT_CTX.closePath();
  }
}

function renderDebugTouchBound(_minX, _maxX, _minY, _maxY, color) {
  GAME_VARIABLES.VIEWPORT_CTX.strokeStyle = color;
  GAME_VARIABLES.VIEWPORT_CTX.beginPath();
  GAME_VARIABLES.VIEWPORT_CTX.moveTo(_minX, _minY);
  GAME_VARIABLES.VIEWPORT_CTX.lineTo(_maxX, _maxY);
  GAME_VARIABLES.VIEWPORT_CTX.stroke();
  GAME_VARIABLES.VIEWPORT_CTX.closePath();
}
