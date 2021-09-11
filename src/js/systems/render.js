import clamp from "clamp";
import { COLOR_BLACK, COLOR_BROWN, COLOR_LIGHT_BLUE, COLOR_PINK, COLOR_WHITE } from "../constans";
import ECS from "../lib/ecs";
import { dist } from "../utils/utils";
import { getGameData } from "./game";

// Initialize canvas
let canvas = document.querySelector("canvas");
let canvasHeight = (canvas.height = window.innerHeight);
let canvasWidth = (canvas.width = (canvasHeight / 16) * 9);
console.log(canvasWidth, canvasHeight);
let mainCanvasCtx = canvas.getContext("2d");

const VIEWPORT = canvas.cloneNode(); // visible portion of map/viewport
const ctx = VIEWPORT.getContext("2d");
export const GAME_WIDTH = (VIEWPORT.width = 504 - 2); // minus borders
export const GAME_HEIGHT = (VIEWPORT.height = 896 - 150 - 30); // minus menus
console.log(GAME_WIDTH);
const linesGap = 32;

// TODO
function drawBgLines(now, bullets) {
  // ctx.strokeStyle = "rgba(255,255,255, 0.1)";
  let lg = linesGap;
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
    yline = linesGap * Math.floor(b.position.y / linesGap) + yOffset;

    xmin = b.position.x - 32;
    xmax = b.position.x + 32;

    var grad = ctx.createLinearGradient(xmin, yline, xmax, yline);
    var light = 1 - (b.position.y - (yline + yOffset)) / linesGap;
    grad.addColorStop(0, "rgba(0, 0, 255, 0.0)");
    grad.addColorStop(0.5, `rgba(0, 0, 255, ${light})`);
    grad.addColorStop(1, "rgba(0, 0, 255, 0.0)");

    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(xmin, yline);
    ctx.lineTo(xmax, yline);
    // ctx.strokeStyle = 'rgba(0,0,0, 0.8)';
    ctx.stroke();

    xline = linesGap * Math.round(b.position.x / linesGap) + xOffset;

    ymin = b.position.y - 32;
    ymax = b.position.y + 32;

    var grad = ctx.createLinearGradient(xline, ymin, xline, ymax);
    light = (1 - (xline - b.position.x + xOffset) / linesGap) / 3;
    grad.addColorStop(0, "rgba(0, 0, 255, 0.0)");
    grad.addColorStop(0.5, `rgba(0, 0, 255, ${light})`);
    grad.addColorStop(1, "rgba(0, 0, 255, 0.0)");

    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(xline, ymin);
    ctx.lineTo(xline, ymax);
    // ctx.strokeStyle = 'rgba(0,0,0, 0.8)';
    ctx.stroke();
  }
}

function drawBulletLines(from, to) {
  var grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
  grad.addColorStop(0, "rgba(0, 0, 255, 0.05)");
  grad.addColorStop(1, "rgba(0, 0, 255, 0.3)");

  ctx.strokeStyle = grad;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function drawBox(position, w, h, color) {
  ctx.beginPath();
  // ctx.shadowColor = color;
  // ctx.shadowBlur = 5;
  ctx.rect(position.x - w / 2, position.y - h / 2, w, h);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawBuildGreed(world) {
  const xOffset = 11;
  const yOffset = 524;
  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 6; y ++) {
      if ([2,3,4,5,9,10,11,12].includes(x)){
        if ([4,5,3].includes(y)){
          continue
        }
      }

      

      ctx.lineWidth = 2;
      ctx.strokeStyle = COLOR_WHITE;
      ctx.lineJoin = 'bevel';
      ctx.strokeRect(x*32+xOffset , y*32+yOffset , 29, 29);
      // ctx.stroke();
    }
  }
}

function renderPointer(pointer) {
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 10, 0, Math.PI * 2, true); 
  ctx.strokeStyle = COLOR_BROWN;
  ctx.stroke();

}

export function rendererSystem(world) {
  const onUpdate = function (dt) {
    ctx.fillStyle = COLOR_BLACK;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawBuildGreed(world);

    const now = getGameData(world).lifeTime;

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

    // borders
    mainCanvasCtx.fillStyle = COLOR_WHITE;
    mainCanvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    renderPointer(ECS.getEntities(world, ["input"])[0].input.pointer);

    // game
    mainCanvasCtx.drawImage(
      VIEWPORT,
      0,
      0,
      VIEWPORT.width,
      VIEWPORT.height,
      1,
      30,
      canvas.width - 2,
      canvas.height - 150
    );
  };

  return { onUpdate };
}
