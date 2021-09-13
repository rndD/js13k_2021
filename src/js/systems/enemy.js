import {
  ALWAYS_AVALIBLE_IF_BROKEN,
  COLOR_BROWN_LIGHT,
  COLOR_LIGHT_BLUE,
  COLOR_ORANGE,
  COLOR_RED,
  COLOR_WHITE,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../constans";
import ECS from "../lib/ecs";
import { correctAABBCollision, testAABBCollision } from "../utils/collisions";
import { dist, randInt, shuffleArray } from "../utils/utils";
import { getGameData } from "./game";
import { createEnemy, isNextTick, WAVES } from "./helpers/enemy";
import { bam, boom } from "./particles";

export function spawnSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;

    if (gameData.paused) {
	    return;
    }

    for (const entity of ECS.getEntities(world, ["spawn"])) {
      if (isNextTick(gameData)) {
        if (WAVES[gameData.wave]) {

        shuffleArray( WAVES[gameData.wave].enemies);
        for (const e of WAVES[gameData.wave].enemies) {
          let {x,y} = entity.position;
          if (gameData.wave == 1) {
            y=0;
          }

          x = x + randInt(-GAME_WIDTH/3, GAME_WIDTH/3);
          y = y - randInt(-100, 100);

          
          createEnemy(world, {x,y}, entity.spawn.level, e);

        }  

        // createEnemy(world, entity.position, entity.spawn.level, "medium");
        // createEnemy(world, entity.position, entity.spawn.level, "boss");
        // createEnemy(world, entity.position, entity.spawn.level, "boss2");
        // createEnemy(world, entity.position, entity.spawn.level, "huge");
        }
      }
    }
  };

  return { onUpdate };
}

const AMPLITUDE = 1;

export function enemyMovementSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const { lifeTime } = gameData;

    if (gameData.paused) {
	    return;
    }

    const shields = ECS.getEntities(world, ["shield"]).filter((e) => {
      return e.shield.hp > 0;
    });
    const units = ECS.getEntities(world, ["unit"]);
    const platforms = ECS.getEntities(world, ["platform"]);

    const entities = ECS.getEntities(world, ["enemy", "moveable"]).filter(
      (e) => {
        let hit = false;
        if (e.position.y > GAME_HEIGHT - 10) {
          ECS.removeEntity(world, e);
          gameData.hp -= e.enemy.fullHp;
          hit = true;

          boom(world, COLOR_RED, 0, {
            dx: e.moveable.dx * 2,
            dy: e.moveable.dy * 2,
            x: e.position.x,
            y: e.position.y - 30,
          });
          boom(world, COLOR_RED, 0, {
            dx: e.moveable.dx * 2,
            dy: e.moveable.dy * 2,
            x: e.position.x + 5,
            y: e.position.y - 30,
          });
          return false;
        }

        if (!hit) {
          for (const s of shields) {
            if (
              dist(s.shield, {
                x: e.position.x + e.body.w,
                y: e.position.y + e.body.h,
              }) < s.shield.range
            ) {
              const newEnemyHp = e.enemy.hp - s.shield.hp;
              s.shield.hp -= e.enemy.hp;
              e.enemy.hp = newEnemyHp;
              boom(world, COLOR_LIGHT_BLUE, 0, {
                dx: e.moveable.dx * 2,
                dy: e.moveable.dy * 2,
                x: e.position.x + e.body.w,
                y: e.position.y + e.body.h,
              });
              hit = true;
            }
          }
        }
        if (!hit) {
          for (const u of units) {
            if (
              testAABBCollision(u.position, u.body, e.position, e.body).collide
            ) {
              const newEnemyHp = e.enemy.hp - u.unit.hp;
              u.unit.hp -= e.enemy.hp;
              e.enemy.hp = newEnemyHp;
              boom(world, COLOR_WHITE, 0, {
                dx: e.moveable.dx * 2,
                dy: e.moveable.dy * 2,
                x: e.position.x + e.body.w,
                y: e.position.y + e.body.h,
              });
              hit = true;
            }
          }
        }
        if (!hit) {
          for (const p of platforms) {
            if (
              testAABBCollision(p.position, p.body, e.position, e.body).collide
            ) {
              const newEnemyHp = e.enemy.hp - p.platform.hp;
              p.platform.hp -= e.enemy.hp;
              e.enemy.hp = newEnemyHp;
              boom(world, COLOR_WHITE, 0, {
                dx: e.moveable.dx * 2,
                dy: e.moveable.dy * 2,
                x: e.position.x + e.body.w,
                y: e.position.y + e.body.h,
              });
              hit = true;
            }
          }
        }

        if (e.enemy.hp <= 0) {
          ECS.removeEntity(world, e);
          bam(world, COLOR_RED, 1, {
            x: e.position.x + e.body.w,
            y: e.position.y + e.body.h,
          });
          gameData.score += e.enemy.score;

          return false;
        }

        return true;
      }
    );

    for (const entity of entities) {
      const speed = entity.enemy.speed * 20;
      if (entity.enemy.movementType === "linear") {
        entity.moveable.dy = (dt / 1000) * speed;
      }

      if (entity.enemy.movementType === "zigzag") {
        entity.moveable.dy = (dt / 1000) * speed;
        entity.moveable.dx =
          Math.cos((lifeTime - entity.data.creationTime) / 1000) * AMPLITUDE;
      }
    }

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const test = testAABBCollision(
          entities[i].position,
          entities[i].body,
          entities[j].position,
          entities[j].body
        );
        if (test.collide) {
          correctAABBCollision(entities[i], entities[j], test);
        }
      }
    }
  };

  return { onUpdate };
}
