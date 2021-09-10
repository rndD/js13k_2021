import ECS from "../lib/ecs";



export function movementSystem(world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, ["position", "moveable"])) {
      entity.position.x += entity.moveable.dx;
      entity.position.y += entity.moveable.dy;
    }
  };

  return { onUpdate };
}
