import ECS from "../lib/ecs";


export function spawnSystem(world) {
  const onUpdate = function (dt) {
    const now = performance.now();

    for (const entity of ECS.getEntities(world, ["spawn"])) {
      if (isNextTick(entity, now)) {
        createEnemy(world, entity.position, entity.spawn.level);
      }

    }
  };

  return { onUpdate };
}


function isNextTick(entity, now) {
  if (entity.spawn.nextTick) {
    if (now > entity.spawn.nextTick) {
      console.log("SPAWN");
      entity.spawn.nextTick = now + ((3 + entity.spawn.level) * 1000);
      entity.spawn.level++;
      return true;
    }
  } else {
    entity.spawn.nextTick = now + ((3 + entity.spawn.level) * 1000);
  }
}


function createEnemy(world, position, level) {
  const {x,y} = position;

  const enemy = ECS.createEntity(world);
  ECS.addComponentToEntity(world, enemy, "position", {x, y});
  ECS.addComponentToEntity(world, enemy, "renderable");
  ECS.addComponentToEntity(world, enemy, "moveable", { dx: 0, dy: 2});
  ECS.addComponentToEntity(world, enemy, "enemy", { hp: 10, level});

}