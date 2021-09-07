import ECS from "../lib/ecs";
import keyboard from "../utils/keyboard";
import clamp from "clamp";

export const keyboardControlSystem = (world) => {
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
