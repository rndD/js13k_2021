import ECS from "./lib/ecs";
import { gameSystem } from "./systems/game";
import { keyboardControlSystem } from "./systems/keyboard";
import { movementSystem} from "./systems/movement";
import { rendererSystem } from "./systems/render";
import { enemyMovementSystem, spawnSystem } from "./systems/enemy";
import { bulletMovementSystem, unitsSystem } from "./systems/units";


// generates a new entity component system
const world = ECS.createWorld();

// set spawn

for (let i = 0; i < 7; i++) {
  const SPAWN = ECS.createEntity(world);
  ECS.addComponentToEntity(world, SPAWN, "position", { x: 300 + (i * 100 * 2), y: 100 });
  ECS.addComponentToEntity(world, SPAWN, "spawn", { nextTick: 500, level: 1 });
}

const GAME = ECS.createEntity(world);
ECS.addComponentToEntity(world, GAME, "gameData", { level: 1, lifeTime: 0 });

// set up the player
for (let i = 0; i < 4; i++) {
  const PLAYER = ECS.createEntity(world);
  ECS.addComponentToEntity(world, PLAYER, "position", { x: 300 + (i * 150 * 2), y: 800 });
  ECS.addComponentToEntity(world, PLAYER, "renderable");
  ECS.addComponentToEntity(world, PLAYER, "data", { creationTime: 0 });
  ECS.addComponentToEntity(world, PLAYER, "body", { w: 32, h: 32 });
  ECS.addComponentToEntity(world, PLAYER, "unit", { hp: 100, type: "tower", nextShot: null});
}


ECS.addSystem(world, gameSystem);

ECS.addSystem(world, keyboardControlSystem);

ECS.addSystem(world, spawnSystem);
ECS.addSystem(world, unitsSystem);

ECS.addSystem(world, enemyMovementSystem);
ECS.addSystem(world, movementSystem);
ECS.addSystem(world, bulletMovementSystem);
ECS.addSystem(world, enemyMovementSystem);

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
