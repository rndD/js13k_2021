import ECS from "./lib/ecs";
import { keyboardControlSystem } from "./systems/keyboard";
import { movementSystem} from "./systems/movement";
import { rendererSystem, SHAPE_SIZE } from "./systems/render";
import { spawnSystem } from "./systems/respawn";

const GAME_DATA = {};

// generates a new entity component system
const world = ECS.createWorld();

// set spawn
const SPAWN = ECS.createEntity(world);
let i = 0;
ECS.addComponentToEntity(world, SPAWN, "position", { x: 300 + (i * SHAPE_SIZE * 4), y: 100 });
ECS.addComponentToEntity(world, SPAWN, "spawn", { nextTick: null, level: 1 });



// set up the player
for (let i = 0; i < 3; i++) {
  const PLAYER = ECS.createEntity(world);
  ECS.addComponentToEntity(world, PLAYER, "position", { x: 300 + (i * SHAPE_SIZE * 2), y: 800 });
  ECS.addComponentToEntity(world, PLAYER, "moveable", { dx: 0, dy: 0 });
  ECS.addComponentToEntity(world, PLAYER, "renderable");
  ECS.addComponentToEntity(world, PLAYER, "unit", { hp: 100, type: "tower"});
}


ECS.addSystem(world, keyboardControlSystem);
ECS.addSystem(world, spawnSystem);
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
