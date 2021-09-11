import clamp from "clamp";
import { TOWER_BULLET_SPEED, TOWER_RANGE, TOWER_RELOAD } from "../constans";
import ECS from "../lib/ecs";
import { testAABBCollision } from "../utils/collisions";
import { dist } from "../utils/utils";
import { getGameData } from "./game";
import { GAME_HEIGHT, GAME_WIDTH } from "./render";


export function unitsSystem(world) {
  const onUpdate = function (dt) {
    const now = getGameData(world).lifeTime;
    const enemies = ECS.getEntities(world, ["enemy"]);

    if (enemies.length === 0) {
      return;
    }

    for (const entity of ECS.getEntities(world, ["unit"])) {
      const { position } = entity;
      let minDistance = Infinity;
      let target, shootTarget;
      if (entity.unit.type === "tower") {
        if (!entity.unit.nextShot || now >= entity.unit.nextShot) {
          for (const enemy of enemies) {
            const d = dist(position, enemy.position);
            if (minDistance > d) {
              minDistance = d;
              target = enemy.position;
              if (d <= TOWER_RANGE) {
                shootTarget = target;
              }
            }
          }
        }
      }

      if (target) {
        if (shootTarget) {
          shoot(world, entity.position, target);

          entity.unit.nextShot = now + TOWER_RELOAD;
          entity.unit.target = shootTarget;
        } else {
          entity.unit.target = target;
        }
      }
    }
  };

  return { onUpdate };
}

function shoot(world, from, to) {
  const { x, y } = from;
  const d = dist(from, to);
  const dx = ((to.x - x) / d) * TOWER_BULLET_SPEED;
  const dy = ((to.y - y) / d) * TOWER_BULLET_SPEED;

  const bullet = ECS.createEntity(world);
  ECS.addComponentToEntity(world, bullet, "position", { x, y });
  ECS.addComponentToEntity(world, bullet, "renderable");
  ECS.addComponentToEntity(world, bullet, "data", {
    creationTime: getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, bullet, "moveable", { dx, dy });
  ECS.addComponentToEntity(world, bullet, "bullet", {
    dmg: 5,
    from,
  });
  ECS.addComponentToEntity(world, bullet, "body", { w: 2, h: 3 });
}

export function bulletMovementSystem(world) {
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, ["bullet"])) {
      // REMOVE THINGS OUT OF BOUNDS
      if (
        entity.position.x > GAME_WIDTH ||
        entity.position.x < 0 ||
        entity.position.y > GAME_HEIGHT ||
        entity.position.y < 0
      ) {
        ECS.removeEntity(world, entity);
        continue;
      }

      for (const enemy of ECS.getEntities(world, ["enemy"])) {
        if (
          testAABBCollision(
            enemy.position,
            enemy.body,
            entity.position,
            enemy.body
          ).collide
        ) {
          ECS.removeEntity(world, entity);
          enemy.enemy.hp -= entity.bullet.dmg;

          // small bump
          enemy.position.x =
            enemy.position.x + clamp(entity.moveable.dx * 0.1, -1, 1);
          enemy.position.y =
            enemy.position.y + clamp(entity.moveable.dy * 0.1, -1, 1);
        }
      }
    }
  };

  return { onUpdate };
}
