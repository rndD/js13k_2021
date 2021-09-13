import ECS from "./lib/ecs";
import { createGame, gameSystem } from "./systems/game";
import { movementSystem } from "./systems/movement";
import { rendererSystem } from "./systems/render";
import { enemyMovementSystem, spawnSystem } from "./systems/enemy";
import {
  bulletMovementSystem,
  generatorSystem,
  shieldSystem,
  towerSystem,
  unitSystem,
} from "./systems/units";
import { inputSystem } from "./systems/input";
import { particleSystem } from "./systems/particles";
import { GAME_WIDTH, xGridStart } from "./constans";

// generates a new entity component system
const world = ECS.createWorld();

// set spawn

let SPAWN = ECS.createEntity(world);
ECS.addComponentToEntity(world, SPAWN, "position", {
  x: GAME_WIDTH /2,
  y: -10,
});
ECS.addComponentToEntity(world, SPAWN, "spawn", {});

createGame(world);

ECS.addSystem(world, gameSystem);

ECS.addSystem(world, inputSystem);

ECS.addSystem(world, spawnSystem);
ECS.addSystem(world, towerSystem);
ECS.addSystem(world, generatorSystem);
ECS.addSystem(world, shieldSystem);
ECS.addSystem(world, unitSystem);

ECS.addSystem(world, enemyMovementSystem);
ECS.addSystem(world, movementSystem);
ECS.addSystem(world, bulletMovementSystem);
ECS.addSystem(world, enemyMovementSystem);

ECS.addSystem(world, particleSystem);
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
