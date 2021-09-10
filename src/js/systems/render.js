import ECS from "../lib/ecs";

// Initialize canvas
let canvas = document.querySelector("canvas");
let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
let ctx = canvas.getContext("2d");

let linesLevel1Outline = 0;
let linesLevel2Outline = -10;
const linesGap = 50;

// TODO
function drawBgLines(dt) {
  linesLevel1Outline += dt / 100;
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
  ctx.rect(position.x - w / 2, position.y - h / 2, w, h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#b74843";
  ctx.stroke();
}

export function rendererSystem(world) {
  const onUpdate = function (dt) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // drawBgLines(dt);
    for (const entity of ECS.getEntities(world, ["bullet"])) {
      drawBulletLines(entity.bullet.from, entity.position);
    }

    for (const entity of ECS.getEntities(world, ["renderable"])) {
      drawBox(entity.position, entity.body.w, entity.body.h, entity.bullet ? "#00f": "#f00");
    }
  };

  return { onUpdate };
}
