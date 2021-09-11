import ECS from "../lib/ecs";
import { correctAABBCollision, testAABBCollision } from "../utils/collisions";
import { getGameData } from "./game";

export function spawnSystem(world) {
  const onUpdate = function (dt) {
    const now = getGameData(world).lifeTime;

    for (const entity of ECS.getEntities(world, ["spawn"])) {
      if (isNextTick(entity, now)) {
        createEnemy(world, entity.position, entity.spawn.level, "linear");
        createEnemy(world, entity.position, entity.spawn.level, "zigzag");
        createEnemy(world, entity.position, entity.spawn.level, "zigzag");
        createEnemy(world, entity.position, entity.spawn.level, "linear");
        createEnemy(world, entity.position, entity.spawn.level, "zigzag");
       
      
      }
    }
  };

  return { onUpdate };
}

function isNextTick(entity, now) {
  if (entity.spawn.nextTick) {
    if (now > entity.spawn.nextTick) {
      console.log("SPAWN");
      entity.spawn.nextTick = now + (5 + entity.spawn.level) * 1000;
      entity.spawn.level++;
      return true;
    }
  } else {
    entity.spawn.nextTick = now + (5 + entity.spawn.level) * 1000;
  }
}

function createEnemy(world, position, level, movementType) {
  const { x, y } = position;

  const enemy = ECS.createEntity(world);
  ECS.addComponentToEntity(world, enemy, "position", { x, y });
  ECS.addComponentToEntity(world, enemy, "renderable");
  ECS.addComponentToEntity(world, enemy, "data", {
    creationTime: getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, enemy, "moveable", { dx: 0, dy: 0 });
  ECS.addComponentToEntity(world, enemy, "enemy", {
    hp: 10,
    level,
    movementType,
  });
  ECS.addComponentToEntity(world, enemy, "body", { w: 25, h: 25 });
}

const AMPLITUDE = 1;

export function enemyMovementSystem(world) {
  const onUpdate = function (dt) {

    const lifeTime = getGameData(world).lifeTime;
    const entities = ECS.getEntities(world, ["enemy", "moveable"]).filter((e) => {
      if (e.enemy.hp < 0) {
        ECS.removeEntity(world, e);
        return false;
      }
      return true;
    });

    for (const entity of entities) {
      let levelSpeed = 20 * entity.enemy.level;
      if (entity.enemy.movementType === "linear") {
        entity.moveable.dy = (dt / 1000) * levelSpeed;
      }

      if (entity.enemy.movementType === "zigzag") {
        entity.moveable.dy = (dt / 1000) * levelSpeed;
        entity.moveable.dx = Math.cos((lifeTime - entity.data.creationTime) / 1000 ) * AMPLITUDE;
      }
    }

    
    for (let i = 0; i < entities.length; i++) {
      for (let j = i+1; j < entities.length; j++) {
        const test = testAABBCollision(entities[i].position, entities[i].body, entities[j].position, entities[j].body);
        if (test.collide) {
          correctAABBCollision(entities[i], entities[j], test);
        }
      }
    }

   
  };

  return { onUpdate };
}
