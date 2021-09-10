import clamp from "clamp";
import ECS from "../lib/ecs";
import { testAABBCollision } from "../utils/collisions";
import { dist } from "../utils/utils";
import { getGameData } from "./game";

const RELOAD = 0.2 * 1000;
const RANGE = 1000;
const BULLET_SPEED = 10;
const BOUNDS_LIMITS = 2000;

export function unitsSystem(world) {
  const onUpdate = function (dt) {
    const now = getGameData(world).lifeTime;
    const enemies = ECS.getEntities(world, ["enemy"]);

    if (enemies.length === 0) {
      return;
    }

    for (const entity of ECS.getEntities(world, ["unit"])) {
      const { position } = entity;
      let minDistance = 100000;
      let target, shootTarget;
      if (entity.unit.type === "tower") {
        if (!entity.unit.nextShot || now >= entity.unit.nextShot) {
          for (const enemy of enemies) {
            const d = dist(position, enemy.position);
            if (minDistance > d) {
              minDistance = d;
              target = enemy.position;
              if (d <= RANGE) {
                shootTarget = target;
              }
            }
          }
        }
      }

      if (target) {
        if (shootTarget) {
          shoot(world, entity.position, target);

          entity.unit.nextShot = now + RELOAD;
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
  const dx = ((to.x - x) / d) * BULLET_SPEED;
  const dy = ((to.y - y) / d) * BULLET_SPEED;

  const bullet = ECS.createEntity(world);
  ECS.addComponentToEntity(world, bullet, "position", { x, y });
  ECS.addComponentToEntity(world, bullet, "renderable");
  ECS.addComponentToEntity(world, bullet, "data", {
    creationTime: getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, bullet, "moveable", { dx, dy });
  ECS.addComponentToEntity(world, bullet, "bullet", {
    dmg: 5, from
  });
  ECS.addComponentToEntity(world, bullet, "body", { w: 2, h: 2 });
}


export function bulletMovementSystem(world) {
	const onUpdate = function (dt) {
	
	  for (const entity of ECS.getEntities(world, ["bullet"])) {
	    // REMOVE THINGS OUT OF BOUNDS
	    if (entity.position.x > BOUNDS_LIMITS || entity.position.x < 0 || entity.position.y > BOUNDS_LIMITS || entity.position.y < 0 ) {
	      ECS.removeEntity(world, entity);
	      continue;
	    } 
      
	    for (const enemy of ECS.getEntities(world, ["enemy"])) {
	      if (testAABBCollision(enemy.position, enemy.body, entity.position, enemy.body).collide) {
		ECS.removeEntity(world, entity);
		enemy.enemy.hp -= entity.bullet.dmg;
      
		// small bump
		enemy.position.x = enemy.position.x + clamp((entity.moveable.dx * 0.1), -1, 1);
		enemy.position.y = enemy.position.y + clamp((entity.moveable.dy * 0.1), -1, 1);
	      }
	    }
      
	    
      
	  }
	};
      
	return { onUpdate };
      }
      