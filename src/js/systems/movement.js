import ECS from "../lib/ecs";
import { getGameData } from "./game";



export function movementSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    if (gameData.paused) {
	    return;
    }
    for (const entity of ECS.getEntities(world, ["position", "moveable"])) {
      entity.position.x += entity.moveable.dx;
      entity.position.y += entity.moveable.dy;
    }
  };

  return { onUpdate };
}
