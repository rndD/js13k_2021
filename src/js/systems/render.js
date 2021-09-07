import ECS from "../lib/ecs";

// Initialize canvas
let canvas = document.querySelector("canvas");
let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
let ctx = canvas.getContext("2d");

export const SHAPE_SIZE = 32;
const SHAPE_HALF_SIZE = SHAPE_SIZE / 2;

function drawBox(position) {
  ctx.beginPath();
  ctx.rect(
    position.x - SHAPE_HALF_SIZE,
    position.y - SHAPE_HALF_SIZE,
    SHAPE_SIZE,
    SHAPE_SIZE
  );
  ctx.fillStyle = "#e2736e";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#b74843";
  ctx.stroke();
}

export function rendererSystem(world) {
  const onUpdate = function (dt) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (const entity of ECS.getEntities(world, ["renderable"])) {
      drawBox(entity.position);
    }
  };

  return { onUpdate };
}
