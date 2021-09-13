import { getGameData } from "../game";
import ECS from "../../lib/ecs";

export function isNextTick(entity, now) {
  if (entity.spawn.nextTick) {
    if (now > entity.spawn.nextTick) {
      //     console.log("SPAWN");
      entity.spawn.nextTick = now + (5 + entity.spawn.level) * 1000;
      entity.spawn.level++;
      return true;
    }
  } else {
    entity.spawn.nextTick = now + (5 + entity.spawn.level) * 1000;
  }
}

export function createEnemy(world, position, level, movementType) {
  const { x, y } = position;

  const enemy = ECS.createEntity(world);
  ECS.addComponentToEntity(world, enemy, "position", { x, y });
  ECS.addComponentToEntity(world, enemy, "renderable");
  ECS.addComponentToEntity(world, enemy, "data", {
    creationTime: getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, enemy, "moveable", { dx: 0, dy: 0 });
  ECS.addComponentToEntity(world, enemy, "enemy", {
    hp: 3,
    fullHp: 3,
    level,
    movementType,
    type: "big_asteroid",
    score: 5,
  });
  ECS.addComponentToEntity(world, enemy, "body", { w: 25, h: 25 });
}
