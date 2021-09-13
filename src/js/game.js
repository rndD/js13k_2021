import ECS from "./lib/ecs";
import { createGame, gameSystem } from "./systems/game";
import { keyboardControlSystem } from "./systems/keyboard";
import { movementSystem} from "./systems/movement";
import { rendererSystem } from "./systems/render";
import { enemyMovementSystem, spawnSystem } from "./systems/enemy";
import { bulletMovementSystem, generatorSystem, shieldSystem, towerSystem, unitSystem} from "./systems/units";
import { inputSystem } from "./systems/input";
import { particleSystem } from "./systems/particles";


// generates a new entity component system
const world = ECS.createWorld();

// set spawn

for (let i = 0; i < 1; i++) {
  const SPAWN = ECS.createEntity(world);
  ECS.addComponentToEntity(world, SPAWN, "position", { x: 20 + (i * 80 * 2), y: 100 });
  ECS.addComponentToEntity(world, SPAWN, "spawn", { nextTick: 500, level: 1 });
}

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
