import clamp from "clamp";
import {
  BOTTOM_MENU_HEIGHT,
  COLOR_BLACK,
  COLOR_BROWN,
  COLOR_BROWN_LIGHT,
  COLOR_DARK_BLUE,
  COLOR_DARK_BURGUNDY,
  COLOR_DARK_GREEN,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GREEN,
  COLOR_LIGHT_VIOLA,
  COLOR_ORANGE,
  COLOR_PEACH,
  COLOR_PINK,
  COLOR_RED,
  COLOR_WHITE,
  COLOR_YELLOW,
  GAME_HEIGHT,
  LINES_GAP,
  ORIGINAL_HEIGHT,
  ORIGINAL_WIDTH,
  TOP_MENU_HEIGHT,
  TOWER_RANGE,
  xGridStart,
  yGridStart,
} from "../constans";
import ECS from "../lib/ecs";
import { BOTTOM_BUTONS } from "../ui";
import { isPointerIn } from "../utils/collisions";
import { renderText } from "../utils/text";
import { drawButton } from "../utils/ui";
import { addToText, dist, hexToRGB } from "../utils/utils";
import { gameSystem, getGameData } from "./game";
import { getRange } from "./helpers/game";

// Initialize canvas
let MAIN_CANVAS = document.querySelector("canvas");
let canvasHeight = (MAIN_CANVAS.height = window.innerHeight);
let canvasWidth = (MAIN_CANVAS.width = (canvasHeight / 16) * 9);
let MAIN_CANVAS_CTX = MAIN_CANVAS.getContext("2d");

const GAME_CANVAS = MAIN_CANVAS.cloneNode(); // visible portion of map/viewport
const GAME_CTX = GAME_CANVAS.getContext("2d");

const TMP_CANVAS = MAIN_CANVAS.cloneNode(); // visible portion of map/viewport
const TMP_CTX = TMP_CANVAS.getContext("2d");

TMP_CANVAS.width = ORIGINAL_WIDTH;
TMP_CANVAS.height = ORIGINAL_HEIGHT;

const TOP_MENU_CANVAS = MAIN_CANVAS.cloneNode(); // visible portion of map/viewport
const TOP_MENU_CTX = TOP_MENU_CANVAS.getContext("2d");

const BOTTOM_MENU_CANVAS = MAIN_CANVAS.cloneNode(); // visible portion of map/viewport
const BOTTOM_MENU_CTX = BOTTOM_MENU_CANVAS.getContext("2d");

BOTTOM_MENU_CANVAS.width = ORIGINAL_WIDTH;
BOTTOM_MENU_CANVAS.height = BOTTOM_MENU_HEIGHT;

TOP_MENU_CANVAS.width = ORIGINAL_WIDTH;
TOP_MENU_CANVAS.height = TOP_MENU_HEIGHT;

function drawTopMenu(gameData) {
  TOP_MENU_CTX.beginPath();
  TOP_MENU_CTX.rect(0, 0, ORIGINAL_WIDTH, TOP_MENU_HEIGHT);
  TOP_MENU_CTX.fillStyle = COLOR_BLACK;
  TOP_MENU_CTX.fill();
  TOP_MENU_CTX.beginPath();
  TOP_MENU_CTX.rect(0, TOP_MENU_HEIGHT - 1, ORIGINAL_WIDTH, 1);
  TOP_MENU_CTX.fillStyle = COLOR_WHITE;
  TOP_MENU_CTX.fill();

  // energy
  renderText(
    TOP_MENU_CTX,
    addToText(gameData.energy, 3, " "),
    0,
    5,
    3,
    COLOR_LIGHT_BLUE
  );
  renderText(TOP_MENU_CTX, `/100>`, 35, 10, 2, COLOR_LIGHT_BLUE);

  // wave and hp
  renderText(
    TOP_MENU_CTX,
    `WAVE: ${gameData.wave}`,
    ORIGINAL_WIDTH / 2 + 80,
    10,
    2,
    COLOR_WHITE
  );
  renderText(
    TOP_MENU_CTX,
    `HP: ` + addToText(gameData.hp, 4, "0"),
    ORIGINAL_WIDTH / 2 - 40,
    5,
    3,
    COLOR_RED
  );

  // score
  renderText(
    TOP_MENU_CTX,
    addToText(gameData.score, 6, "0"),
    ORIGINAL_WIDTH - 70,
    5,
    3,
    COLOR_YELLOW
  );
}

function getColor(b) {
  let color;
  if (b.type === "gun") {
    color = COLOR_LIGHT_BLUE;
  }
  if (b.type === "sgun") {
    color = COLOR_YELLOW;
  }
  if (b.type === "rocket") {
    color = COLOR_BROWN;
  }
  return color;
}

function drawBottomMenu(gameData, pointer) {
  BOTTOM_MENU_CTX.beginPath();
  BOTTOM_MENU_CTX.rect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
  BOTTOM_MENU_CTX.fillStyle = COLOR_BLACK;
  BOTTOM_MENU_CTX.fill();
  BOTTOM_MENU_CTX.beginPath();
  BOTTOM_MENU_CTX.rect(0, 0, ORIGINAL_WIDTH, 1);
  BOTTOM_MENU_CTX.fillStyle = COLOR_WHITE;
  BOTTOM_MENU_CTX.fill();

  for (const [i, b] of BOTTOM_BUTONS.entries()) {
    let isSelected, isSelectable;
    if (pointer) {
      isSelected = isPointerIn(pointer, b);
    }
    if (i != 6) {
      isSelectable = gameData.energy > b.price;
    } else {
      isSelectable = gameData.score > b.price;
    }

    drawButton(BOTTOM_MENU_CTX, b.x, b.y, b.w, b.h, {
      isSelectable,
      isSelected,
      color: b.color,
      topText: b.topText,
      bottomText: b.bottomText,
      bottomTextColor: b.bottomTextColor,
    });
  }
}

// TODO
function drawBgLines(now, bullets) {
  // ctx.strokeStyle = "rgba(255,255,255, 0.1)";
  let lg = LINES_GAP;
  for (let x = -lg * 2; x < 1500; x += lg) {
    GAME_CTX.beginPath();

    GAME_CTX.strokeStyle = hexToRGB(COLOR_LIGHT_BLUE, 0.1);
    GAME_CTX.moveTo(x + xGridStart, 0);
    GAME_CTX.lineTo(x + xGridStart, 1500);

    GAME_CTX.stroke();
    GAME_CTX.closePath()
  }

  const offset = 0; //((now % 1000) / 500) * lg;
  const xOffset = xGridStart;
  const yOffset = 0;
  for (let y = -lg * 2; y < 1500; y += lg) {
    GAME_CTX.beginPath();
    GAME_CTX.strokeStyle = hexToRGB(COLOR_LIGHT_BLUE, 0.1);

    GAME_CTX.moveTo(0, y + offset);
    GAME_CTX.lineTo(1500, y + offset);

    GAME_CTX.stroke();
    GAME_CTX.closePath()
  }

  // just cools effect

  for (const b of bullets) {
    GAME_CTX.beginPath();
    const color = getColor(b.bullet);

    yline = LINES_GAP * Math.floor(b.position.y / LINES_GAP) + yOffset;

    xmin = b.position.x - 16;
    xmax = b.position.x + 16;

    var grad = GAME_CTX.createLinearGradient(xmin, yline, xmax, yline);
    var light = 1 - (b.position.y - (yline + yOffset)) / LINES_GAP;
    grad.addColorStop(0, hexToRGB(color, 0.1));
    grad.addColorStop(0.5, hexToRGB(color, light));
    grad.addColorStop(1, hexToRGB(color, 0.1));
    GAME_CTX.strokeStyle = grad;

    GAME_CTX.moveTo(xmin, yline);
    GAME_CTX.lineTo(xmax, yline);
    // ctx.strokeStyle = 'rgba(0,0,0, 0.8)';
    GAME_CTX.stroke();

    xline = LINES_GAP * Math.round(b.position.x / LINES_GAP) + xOffset;

    ymin = b.position.y - 32;
    ymax = b.position.y + 32;

    var grad = GAME_CTX.createLinearGradient(xline, ymin, xline, ymax);
    light = (1 - (xline - b.position.x + xOffset) / LINES_GAP) / 3;
    grad.addColorStop(0, hexToRGB(color, 0));
    grad.addColorStop(0.5, hexToRGB(color, light));
    grad.addColorStop(1, hexToRGB(color, 0));

    GAME_CTX.strokeStyle = grad;

    GAME_CTX.beginPath();
    GAME_CTX.moveTo(xline, ymin);
    GAME_CTX.lineTo(xline, ymax);
    // ctx.strokeStyle = 'rgba(0,0,0, 0.8)';
    GAME_CTX.stroke();
  }
}

function drawBulletLines(from, to, b) {
  const color = getColor(b);
  var grad = GAME_CTX.createLinearGradient(from.x, from.y, to.x, to.y);
  grad.addColorStop(0, hexToRGB(color, 0.05));
  grad.addColorStop(1, hexToRGB(color, 0.2));

  GAME_CTX.strokeStyle = grad;

  GAME_CTX.beginPath();
  GAME_CTX.moveTo(from.x, from.y);
  GAME_CTX.lineTo(to.x, to.y);
  GAME_CTX.stroke();
}

function drawBox(position, w, h, entity) {
  GAME_CTX.beginPath();
  // ctx.shadowColor = color;
  // ctx.shadowBlur = 5;
  GAME_CTX.rect(position.x, position.y, w, h);
  if (entity.bullet) {
    if (entity.bullet.type === "rocket") {
      GAME_CTX.fillStyle = COLOR_ORANGE;
    }
    if (entity.bullet.type === "gun") {
      GAME_CTX.fillStyle = COLOR_LIGHT_BLUE;
    }
    if (entity.bullet.type === "sgun") {
      GAME_CTX.fillStyle = COLOR_YELLOW;
    }
  }

  if (entity.unit) {
    if (entity.unit.type === "shield") {
      GAME_CTX.fillStyle = COLOR_DARK_BLUE;
    }
    if (entity.unit.type === "gun") {
      GAME_CTX.fillStyle = COLOR_LIGHT_BLUE;
    }
    if (entity.unit.type === "generator") {
      GAME_CTX.fillStyle = COLOR_PEACH;
    }
    if (entity.unit.type === "rocket") {
      GAME_CTX.fillStyle = COLOR_ORANGE;
    }
    if (entity.unit.type === "sgun") {
      GAME_CTX.fillStyle = COLOR_YELLOW;
    }
  }
  GAME_CTX.fill();
  GAME_CTX.closePath();
}

function drawEnemy(now, position, w, h, entity) {
  GAME_CTX.beginPath();

  const { x, y } = position;

  GAME_CTX.rect(x, y, w, h);

  // //position.x, position.y, w, h
  // GAME_CTX.shadowBlur = 2;
  // GAME_CTX.shadowColor = COLOR_RED;
  GAME_CTX.lineWidth = 1;
  GAME_CTX.strokeStyle = COLOR_RED;
  GAME_CTX.stroke();
  GAME_CTX.closePath();

  if (entity.enemy.tookDmg?.until > now) {
    const { dx, dy } = entity.enemy.tookDmg;
    GAME_CTX.beginPath();
    var grad = GAME_CTX.createLinearGradient(x*dx*-1-h,y*dy*-1-w, x*dx,y*dy);
    grad.addColorStop(1, hexToRGB(COLOR_WHITE, 0.0));
    grad.addColorStop(0, hexToRGB(COLOR_WHITE, 1));

    GAME_CTX.rect(x, y, w, h);

    //position.x, position.y, w, h
    GAME_CTX.lineWidth = 1;
    GAME_CTX.strokeStyle = grad;
    GAME_CTX.stroke();
    GAME_CTX.closePath();
  }
  // GAME_CTX.fillStyle = COLOR_RED;

  // GAME_CTX.fill();
}

function drawPlatforms(world) {
  for (const entity of ECS.getEntities(world, ["platform"])) {
    GAME_CTX.beginPath();
    GAME_CTX.lineWidth = 2;
    GAME_CTX.strokeStyle = COLOR_WHITE;
    GAME_CTX.lineJoin = "bevel";
    GAME_CTX.strokeRect(
      entity.position.x,
      entity.position.y,
      entity.body.w,
      entity.body.h
    );
  }
}

function drawBuildingGrid(gameData, pointer) {
  if (gameData.mode?.type === "building" && gameData.mode.avaiblePoints) {
    for (const [xy, { x, y, w, h }] of Object.entries(
      gameData.mode.avaiblePoints
    )) {
      GAME_CTX.beginPath();
      GAME_CTX.lineWidth = 2;
      // GAME_CTX.shadowColor = COLOR_DARK_GREEN;
      // GAME_CTX.shadowBlur = 1;
      let showCircle = false;
      if (isPointerIn(pointer, { x, y, w, h })) {
        GAME_CTX.strokeStyle = COLOR_YELLOW;

        // has cyrcle
        if ([1, 4, 5, 6].includes(gameData.mode.index)) {
          showCircle = true;
        }
      } else {
        GAME_CTX.strokeStyle = COLOR_DARK_GREEN;
      }
      GAME_CTX.lineJoin = "bevel";
      GAME_CTX.strokeRect(x, y, w, h);

      // range cyrcle
      if (showCircle) {
        GAME_CTX.beginPath();
        const range = getRange(gameData.mode.index);
        GAME_CTX.arc(x + 32 / 2, y + 32 / 2, range, 0, Math.PI * 2, true);
        GAME_CTX.strokeStyle = COLOR_LIGHT_BLUE;
        GAME_CTX.stroke();
      }
    }
  }
}

function renderPointer(pointer) {
  let ctx;
  if (pointer.ctxTarget === "game") {
    ctx = GAME_CTX;
  }
  if (pointer.ctxTarget === "top") {
    ctx = TOP_MENU_CTX;
  }
  if (pointer.ctxTarget === "bottom") {
    ctx = BOTTOM_MENU_CTX;
  }
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 5, 0, Math.PI * 2, true);
  ctx.strokeStyle = COLOR_BROWN;
  ctx.stroke();
}

function drawShields(now, shields) {
  for (const entity of shields) {
    const { x, y, range, hp, fullHp } = entity.shield;
    if (hp > 0) {
      const xAnimationOffset = Math.round((Math.round(now) % 1000) / 1000);

      var grad = GAME_CTX.createLinearGradient(
        x - xAnimationOffset,
        y - range,
        x + range,
        y + range
      );
      const alpha = hp / fullHp;
      grad.addColorStop(0, hexToRGB(COLOR_LIGHT_BLUE, alpha));
      grad.addColorStop(1, hexToRGB(COLOR_LIGHT_BLUE, 0.5));

      GAME_CTX.beginPath();
      GAME_CTX.strokeStyle = grad;
      GAME_CTX.arc(x, y, range, 0, Math.PI * 2, true);
      GAME_CTX.stroke();
    }
  }
}

function drawParticles(now, particles) {
  for (const entity of particles) {
    entity.particle.size;
    const { size, color, lifeTime, circle } = entity.particle;
    const { x, y } = entity.position;
    const { creationTime } = entity.data;
    const alpha = 0.3; //now - creationTime + lifeTime;

    GAME_CTX.beginPath();

    const c = hexToRGB(color, alpha);
    GAME_CTX.fillStyle = c;
    if (circle) {
      entity.particle.size += 0.5;
      GAME_CTX.strokeStyle = c;
      GAME_CTX.arc(x, y, entity.particle.size, 0, Math.PI * 2, true);

      // GAME_CTX.shadowColor = c;
      // GAME_CTX.shadowBlur = 2;
      GAME_CTX.stroke();
    } else {
      GAME_CTX.rect(x, y, size, size);
      GAME_CTX.fill();
    }
  }
}

function drawAlert(gameData) {
  if (gameData.won) {
  renderText(GAME_CTX, "You won!", 20, GAME_HEIGHT/2, 15, COLOR_YELLOW);
  renderText(GAME_CTX, "Score: " + gameData.score, 120, GAME_HEIGHT/2+100, 8, COLOR_YELLOW);
  }

  if (gameData.gameOver) {
    renderText(GAME_CTX, "Game Over!", 20, GAME_HEIGHT/2, 12, COLOR_RED);
    renderText(GAME_CTX, "Score: " + gameData.score, 120, GAME_HEIGHT/2+100, 8, COLOR_RED);
    }

}


export function rendererSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;
    const { pointer } = ECS.getEntities(world, ["input"])[0].input;

    GAME_CTX.fillStyle = COLOR_BLACK;
    GAME_CTX.fillRect(0, 0, canvasWidth, canvasHeight);

    drawPlatforms(world, gameData.platforms);
    drawBuildingGrid(gameData, pointer);

    drawBgLines(now, ECS.getEntities(world, ["bullet"]));

    drawParticles(now, ECS.getEntities(world, ["particle"]));

    for (const entity of ECS.getEntities(world, ["bullet"])) {
      drawBulletLines(entity.bullet.from, entity.position, entity.bullet);
    }

    for (const entity of [
      ...ECS.getEntities(world, ["renderable", "unit"]),
      ...ECS.getEntities(world, ["renderable", "bullet"]),
    ]) {
      drawBox(entity.position, entity.body.w, entity.body.h, entity);
    }

    for (const entity of [...ECS.getEntities(world, ["renderable", "enemy"])]) {
      drawEnemy(now, entity.position, entity.body.w, entity.body.h, entity);
    }

    drawShields(now, ECS.getEntities(world, ["shield"]));

    drawTopMenu(gameData);
    drawBottomMenu(gameData, pointer);

    // borders
    // MAIN_CANVAS_CTX.fillStyle = COLOR_WHITE;
    // MAIN_CANVAS_CTX.fillRect(0, 0, canvasWidth, canvasHeight);

    // DEBUG POINTER
    renderPointer(pointer);
    
    drawAlert(gameData);

    // compose

    TMP_CTX.drawImage(TOP_MENU_CANVAS, 0, 0);
    TMP_CTX.drawImage(GAME_CANVAS, 0, TOP_MENU_HEIGHT);

    TMP_CTX.drawImage(
      BOTTOM_MENU_CANVAS,
      0,
      ORIGINAL_HEIGHT - BOTTOM_MENU_HEIGHT
    );

    // upscale
    MAIN_CANVAS_CTX.drawImage(
      TMP_CANVAS,
      0,
      0,
      ORIGINAL_WIDTH,
      ORIGINAL_HEIGHT,
      0,
      0,
      MAIN_CANVAS.width,
      MAIN_CANVAS.height
    );
  };

  return { onUpdate };
}
