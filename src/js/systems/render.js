import clamp from "clamp";
import {
  COLOR_BLACK,
  COLOR_BROWN,
  COLOR_LIGHT_BLUE,
  COLOR_PINK,
  COLOR_WHITE,
} from "../constans";
import ECS from "../lib/ecs";
import { dist, hexToRGB } from "../utils/utils";
import { getGameData } from "./game";

const BOTTOM_MENU_HEIGHT = 100;
const TOP_MENU_HEIGHT = 30;
const ORIGINAL_HEIGHT = 896;
const ORIGINAL_WIDTH = 504;
const LINES_GAP = 32;

// Initialize canvas
let MAIN_CANVAS = document.querySelector("canvas");
let canvasHeight = (MAIN_CANVAS.height = window.innerHeight);
let canvasWidth = (MAIN_CANVAS.width = (canvasHeight / 16) * 9);
console.log(canvasWidth, canvasHeight);
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

export const GAME_WIDTH = (GAME_CANVAS.width = ORIGINAL_WIDTH); // minus borders
export const GAME_HEIGHT = (GAME_CANVAS.height =
  ORIGINAL_HEIGHT - BOTTOM_MENU_HEIGHT - TOP_MENU_HEIGHT); // minus menus


function drawTopMenu() {
  TOP_MENU_CTX.beginPath();
  TOP_MENU_CTX.rect(0,0, ORIGINAL_WIDTH, TOP_MENU_HEIGHT );
  TOP_MENU_CTX.fillStyle = COLOR_WHITE;
  TOP_MENU_CTX.fill();
}


function drawBottomMenu() {
  BOTTOM_MENU_CTX.beginPath();
  BOTTOM_MENU_CTX.rect(0, 0, ORIGINAL_WIDTH, BOTTOM_MENU_HEIGHT );
  BOTTOM_MENU_CTX.fillStyle = COLOR_WHITE;
  BOTTOM_MENU_CTX.fill();
}

// TODO
function drawBgLines(now, bullets) {
  // ctx.strokeStyle = "rgba(255,255,255, 0.1)";
  let lg = LINES_GAP;
  // for (let x = -linesGap*2; x < 1500; x += lg) {
  //   ctx.beginPath();

  //   const offset = 0; //((now/100) % lg);
  //   ctx.moveTo(x + offset, 0);
  //   ctx.lineTo(x + offset, 1500);

  //   ctx.stroke();
  // }

  // const offset = ((now % 1000) / 500) * lg;
  const xOffset = 11;
  const yOffset = 0;
  // for (let y = -linesGap*2; y < 1500; y += lg) {
  //   ctx.beginPath();

  //   ctx.moveTo(0, y + offset);
  //   ctx.lineTo(1500, y + offset);

  //   ctx.stroke();
  // }

  // just cools effect

  for (const b of bullets) {
    yline = LINES_GAP * Math.floor(b.position.y / LINES_GAP) + yOffset;

    xmin = b.position.x - 32;
    xmax = b.position.x + 32;

    var grad = GAME_CTX.createLinearGradient(xmin, yline, xmax, yline);
    var light = 1 - (b.position.y - (yline + yOffset)) / LINES_GAP;
    grad.addColorStop(0, hexToRGB(COLOR_LIGHT_BLUE, 0));
    grad.addColorStop(0.5, hexToRGB(COLOR_LIGHT_BLUE, light));
    grad.addColorStop(1, hexToRGB(COLOR_LIGHT_BLUE, 0))
    GAME_CTX.strokeStyle = grad;

    GAME_CTX.beginPath();
    GAME_CTX.moveTo(xmin, yline);
    GAME_CTX.lineTo(xmax, yline);
    // ctx.strokeStyle = 'rgba(0,0,0, 0.8)';
    GAME_CTX.stroke();

    xline = LINES_GAP * Math.round(b.position.x / LINES_GAP) + xOffset;

    ymin = b.position.y - 32;
    ymax = b.position.y + 32;

    var grad = GAME_CTX.createLinearGradient(xline, ymin, xline, ymax);
    light = (1 - (xline - b.position.x + xOffset) / LINES_GAP) / 3;
    grad.addColorStop(0, hexToRGB(COLOR_LIGHT_BLUE, 0));
    grad.addColorStop(0.5, hexToRGB(COLOR_LIGHT_BLUE, light));
    grad.addColorStop(1, hexToRGB(COLOR_LIGHT_BLUE, 0));

    GAME_CTX.strokeStyle = grad;

    GAME_CTX.beginPath();
    GAME_CTX.moveTo(xline, ymin);
    GAME_CTX.lineTo(xline, ymax);
    // ctx.strokeStyle = 'rgba(0,0,0, 0.8)';
    GAME_CTX.stroke();
  }
}

function drawBulletLines(from, to) {
  var grad = GAME_CTX.createLinearGradient(from.x, from.y, to.x, to.y);
  grad.addColorStop(0, hexToRGB(COLOR_LIGHT_BLUE, 0.05));
  grad.addColorStop(1, hexToRGB(COLOR_LIGHT_BLUE, 0.2));

  GAME_CTX.strokeStyle = grad;

  GAME_CTX.beginPath();
  GAME_CTX.moveTo(from.x, from.y);
  GAME_CTX.lineTo(to.x, to.y);
  GAME_CTX.stroke();
}

function drawBox(position, w, h, color) {
  GAME_CTX.beginPath();
  // ctx.shadowColor = color;
  // ctx.shadowBlur = 5;
  GAME_CTX.rect(position.x - w / 2, position.y - h / 2, w, h);
  GAME_CTX.fillStyle = color;
  GAME_CTX.fill();
}

function drawBuildGreed(world) {
  const xOffset = 11;
  const yOffset = 524;
  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 6; y++) {
      if ([2, 3, 4, 5, 9, 10, 11, 12].includes(x)) {
        if ([4, 5, 3].includes(y)) {
          continue;
        }
      }

      GAME_CTX.lineWidth = 2;
      GAME_CTX.strokeStyle = COLOR_WHITE;
      GAME_CTX.lineJoin = "bevel";
      GAME_CTX.strokeRect(x * 32 + xOffset, y * 32 + yOffset, 29, 29);
      // ctx.stroke();
    }
  }
}

function renderPointer(pointer) {
  GAME_CTX.beginPath();
  GAME_CTX.arc(pointer.x, pointer.y, 10, 0, Math.PI * 2, true);
  GAME_CTX.strokeStyle = COLOR_BROWN;
  GAME_CTX.stroke();
}

export function rendererSystem(world) {
  const onUpdate = function (dt) {
    const now = getGameData(world).lifeTime;

    GAME_CTX.fillStyle = COLOR_BLACK;
    GAME_CTX.fillRect(0, 0, canvasWidth, canvasHeight);

    drawBuildGreed(world);

    drawBgLines(now, ECS.getEntities(world, ["bullet"]));

    for (const entity of ECS.getEntities(world, ["bullet"])) {
      drawBulletLines(entity.bullet.from, entity.position);
    }

    for (const entity of ECS.getEntities(world, ["renderable"])) {
      drawBox(
        entity.position,
        entity.body.w,
        entity.body.h,
        entity.bullet ? COLOR_LIGHT_BLUE : COLOR_PINK
      );
    }

    drawTopMenu();
    drawBottomMenu();

    // borders
    // MAIN_CANVAS_CTX.fillStyle = COLOR_WHITE;
    // MAIN_CANVAS_CTX.fillRect(0, 0, canvasWidth, canvasHeight);

    // DEBUG POINTER
    // renderPointer(ECS.getEntities(world, ["input"])[0].input.pointer);

    // compose

    TMP_CTX.drawImage(TOP_MENU_CANVAS, 0, 0);
    TMP_CTX.drawImage(
      GAME_CANVAS,
      0,
      TOP_MENU_HEIGHT
    );


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
