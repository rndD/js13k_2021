import ECS from "./lib/ecs";
import keyboard from "./utils/keyboard";
import clamp from "clamp";

// Initialize canvas
let canvas = document.querySelector("canvas");
let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
let ctx = canvas.getContext("2d");

const SHAPE_SIZE = 150;
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

// generates a new entity component system
const world = ECS.createWorld();

// set up the player
const PLAYER = ECS.createEntity(world);
ECS.addComponentToEntity(world, PLAYER, "position", { x: 105, y: 123 });
ECS.addComponentToEntity(world, PLAYER, "moveable", { dx: 0, dy: 0 });
ECS.addComponentToEntity(world, PLAYER, "renderable");

// update entity velocity based on key pressed
function keyboardControlSystem(world) {
  // called each game loop
  const onUpdate = function (dt) {
    // get all of the entities in the world that pass the filter
    for (const entity of ECS.getEntities(world, ["moveable"])) {
      //     console.log(keyboard.keyPressed('up'))
      // update the entity position according to what is pressed
      if (keyboard.keyPressed("up")) entity.moveable.dy -= 1;
      if (keyboard.keyPressed("down")) entity.moveable.dy += 1;
      if (keyboard.keyPressed("left")) entity.moveable.dx -= 1;
      if (keyboard.keyPressed("right")) entity.moveable.dx += 1;

      entity.moveable.dx = clamp(entity.moveable.dx, -10, 10);
      entity.moveable.dy = clamp(entity.moveable.dy, -10, 10);
    }
  };

  return { onUpdate };
}

function movementSystem(world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, ["position", "moveable"])) {
      entity.position.x += entity.moveable.dx;
      entity.position.y += entity.moveable.dy;
    }
  };

  return { onUpdate };
}

function rendererSystem(world) {
  const onUpdate = function (dt) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (const entity of ECS.getEntities(world, ["renderable"])) {
      drawBox(entity.position);
    }
  };

  return { onUpdate };
}

ECS.addSystem(world, keyboardControlSystem);
ECS.addSystem(world, movementSystem);
ECS.addSystem(world, rendererSystem);

let currentTime = performance.now();

function gameLoop() {
  const newTime = performance.now();
  const frameTime = newTime - currentTime; // in milliseconds, e.g. 16.64356
  currentTime = newTime;

  // run onUpdate for all added systems
  ECS.update(world, frameTime);

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world);

  requestAnimationFrame(gameLoop);
}

// finally start the game loop
gameLoop();
