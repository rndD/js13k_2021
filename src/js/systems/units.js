import clamp from "clamp";
import {
  BULLETS_WH,
  COLOR_BROWN_LIGHT,
  COLOR_GRAY,
  COLOR_LIGHT_BLUE,
  COLOR_ORANGE,
  COLOR_WHITE,
  COLOR_YELLOW,
  GAME_HEIGHT,
  GAME_WIDTH,
  GENERATOR_TICK_TIME,
  GENERATOR_TICK_VALUE,
  MAX_ENERGY,
  SCORE_TOWER_SCORE,
  SHIELD_HP,
  SHIELD_RANGE,
  SHIELD_TICK,
  SHIELD_TICK_VALUE,
  xGridStart,
  yGridStart,
} from "../constans";
import ECS from "../lib/ecs";
import { BOTTOM_BUTONS } from "../ui";
import { testAABBCollision } from "../utils/collisions";
import { dist, id } from "../utils/utils";
import { getGameData } from "./game";
import { getBulletSpeed, getDmg, getRange, getReload } from "./helpers/game";
import { bam, boom } from "./particles";

export function unitSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;
    if (gameData.paused) {
      return;
    }

    for (const entity of ECS.getEntities(world, ["platform"])) {
      if (entity.platform.hp <= 0) {
        delete gameData.platforms[entity.platform.xy];
        ECS.removeEntity(world, entity);
      }
    }
    for (const entity of ECS.getEntities(world, ["unit"])) {
      if (entity.unit.hp <= 0) {
        bam(world, COLOR_GRAY, 1, {
          x: entity.position.x + entity.body.w,
          y: entity.position.y + entity.body.h,
        });
        delete gameData.units[entity.unit.xy];
        ECS.removeEntity(world, entity);
      }
    }
  };

  return { onUpdate };
}

export function towerSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;
    const enemies = ECS.getEntities(world, ["enemy"]);

    if (enemies.length === 0) {
      return;
    }
    if (gameData.paused) {
      return;
    }

    for (const entity of ECS.getEntities(world, ["unit"])) {
      const { position } = entity;
      let minDistance = Infinity;
      let target, shootTarget;
      if (["gun", "sgun", "rocket"].includes(entity.unit.type)) {
        if (!entity.unit.nextShot || now >= entity.unit.nextShot) {
          for (const enemy of enemies) {
            const d = dist(position, enemy.position);
            if (minDistance > d) {
              minDistance = d;
              target = enemy.position;
              const range = getRange(entity.unit.type);
              if (d <= range) {
                shootTarget = target;
              }
            }
          }
        }
      }

      if (target) {
        if (shootTarget) {
          const { w, h } = BULLETS_WH[entity.unit.type];
          const dmg = getDmg(entity.unit.type);
          const reload = getReload(entity.unit.type);
          const speed = getBulletSpeed(entity.unit.type);
          const type = entity.unit.type;
          let canShoot = false;
          if (type == "sgun") {
            if (gameData.score > SCORE_TOWER_SCORE) {
              canShoot = true;
              gameData.score = gameData.score - SCORE_TOWER_SCORE;
            }
          } else {
            canShoot = true;
          }
          if (canShoot) {
            shoot(
              world,
              {
                x: entity.position.x + entity.body.w / 2,
                y: entity.position.y + entity.body.h / 2,
              },
              target,
              { dmg, type, w, h, speed }
            );
            entity.unit.nextShot = now + reload;
            entity.unit.target = shootTarget;
          }
        } else {
          entity.unit.target = target;
        }
      }
    }
  };

  return { onUpdate };
}

export function generatorSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;

    if (gameData.paused) {
      return;
    }

    for (const entity of ECS.getEntities(world, ["unit"])) {
      if (entity.unit.type === "generator") {
        if (!entity.unit.nextShot || now >= entity.unit.nextShot) {
          entity.unit.nextShot = now + GENERATOR_TICK_TIME;
          if (gameData.energy < MAX_ENERGY) {
            gameData.energy += GENERATOR_TICK_VALUE;
            if (gameData.energy > MAX_ENERGY) {
              gameData.energy = MAX_ENERGY;
            }
          }
        }
      }
    }
  };

  return { onUpdate };
}

export function shieldSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;

    if (gameData.paused) {
      return;
    }

    for (const entity of ECS.getEntities(world, ["shield"])) {
      if (entity.shield.hp < entity.shield.fullHp) {
        if (!entity.shield.nextTick || now >= entity.shield.nextTick) {
          if (gameData.energy > SHIELD_TICK_VALUE) {
            entity.shield.nextTick = now + SHIELD_TICK;
            gameData.energy -= SHIELD_TICK_VALUE;
            entity.shield.hp++;
          }
        }
      }
    }
  };

  return { onUpdate };
}

export function bulletMovementSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;

    if (gameData.paused) {
      return;
    }

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
            entity.body
          ).collide
        ) {
          ECS.removeEntity(world, entity);
          enemy.enemy.hp -= entity.bullet.dmg;
          enemy.enemy.tookDmg = {
            until: now + 100,
            dx: entity.moveable.dx,
            dy: entity.moveable.dy,
          };

          boom(world, COLOR_LIGHT_BLUE, 1, {
            dx: entity.moveable.dx,
            dy: entity.moveable.dy,
            x: entity.position.x,
            y: entity.position.y,
          });
          if (entity.bullet.type == "rocket") {
            bam(world, COLOR_ORANGE, 1, {
              x: entity.position.x - 5,
              y: entity.position.y,
            });
          }

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

function shoot(world, from, to, { type, dmg, w, h, speed }) {
  const { x, y } = from;
  const d = dist(from, to);
  const dx = ((to.x - x) / d) * speed;
  const dy = ((to.y - y) / d) * speed;

  const bullet = ECS.createEntity(world);
  ECS.addComponentToEntity(world, bullet, "position", { x, y });
  ECS.addComponentToEntity(world, bullet, "renderable");
  ECS.addComponentToEntity(world, bullet, "data", {
    creationTime: getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, bullet, "moveable", { dx, dy });
  ECS.addComponentToEntity(world, bullet, "bullet", {
    dmg,
    type,
    from,
  });
  ECS.addComponentToEntity(world, bullet, "body", { w, h });
}

export function createPlatform(world, xGrid, yGrid, isInitial) {
  const platform = ECS.createEntity(world);
  const _id = id();

  const x = xGridStart + xGrid * 32;
  const y = yGridStart - yGrid * 32;

  ECS.addComponentToEntity(world, platform, "position", { x, y });
  ECS.addComponentToEntity(world, platform, "renderable");
  ECS.addComponentToEntity(world, platform, "data", {
    creationTime: isInitial ? 0 : getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, platform, "platform", {
    hp: 5,
    id: _id,
    xy: `${xGrid}.${yGrid}`,
  });
  ECS.addComponentToEntity(world, platform, "body", { w: 32, h: 32 });
  return _id;
}

export function createUnit(world, xGrid, yGrid, index, isInitial) {
  const unit = ECS.createEntity(world);
  const _id = id();

  const x = xGridStart + xGrid * 32;
  const y = yGridStart - yGrid * 32;

  ECS.addComponentToEntity(world, unit, "position", { x, y });
  ECS.addComponentToEntity(world, unit, "renderable");
  ECS.addComponentToEntity(world, unit, "data", {
    creationTime: isInitial ? 0 : getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, unit, "body", { w: 32, h: 32 });
  ECS.addComponentToEntity(world, unit, "unit", {
    hp: BOTTOM_BUTONS[index].hp,
    fullHp: BOTTOM_BUTONS[index].hp,
    type: BOTTOM_BUTONS[index].name,
    nextShot: null,
    xy: `${xGrid}.${yGrid}`,
  });

  // shield
  if (index == 5) {
    ECS.addComponentToEntity(world, unit, "shield", {
      hp: SHIELD_HP,
      x: x + 32 / 2,
      y: y + 32 / 2,
      fullHp: SHIELD_HP,
      range: SHIELD_RANGE,
      animations: { takeDmgUntil: null },
      nextTick: null,
    });
  }

  return _id;
}
