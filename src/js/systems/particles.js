import { COLOR_LIGHT_BLUE } from "../constans";
import ECS from "../lib/ecs";
import { getGameData } from "./game";

export function createParticle(
  world,
  { dx, dy, x, y, size, color, lifeTime, circle }
) {
  const p = ECS.createEntity(world);
  ECS.addComponentToEntity(world, p, "position", { x, y });
  ECS.addComponentToEntity(world, p, "particle", {
    size,
    color,
    lifeTime,
    circle,
  });
  ECS.addComponentToEntity(world, p, "moveable", { dx, dy });
  ECS.addComponentToEntity(world, p, "renderable");
  ECS.addComponentToEntity(world, p, "data", {
    creationTime: getGameData(world).lifeTime,
  });
}

export function boom(world, color, isSmall, { dx, dy, x, y }) {
  dx *= -0.2;
  dy *= -0.2;
  if (isSmall) {
    createParticle(world, {
      dx: dx + 0.1,
      dy,
      color,
      x,
      y,
      size: 3,
      lifeTime: 1000,
    });
    createParticle(world, {
      dx: dx + 0.11,
      dy,
      color,
      x,
      y,
      size: 2,
      lifeTime: 1000,
    });
    createParticle(world, {
      dx: dx - 0.11,
      dy,
      color,
      x,
      y,
      size: 2,
      lifeTime: 800,
    });
    createParticle(world, {
      dx,
      dy: dy - 0.11,
      color,
      x,
      y,
      size: 2,
      lifeTime: 900,
    });
    createParticle(world, { dx, dy, color, x, y, size: 2, lifeTime: 800 });
    createParticle(world, {
      dx,
      dy: dy + 0.1,
      color,
      x,
      y,
      size: 2,
      lifeTime: 1400,
    });
    createParticle(world, {
      dx: dx + 0.12,
      dy: dy + 0.1,
      color,
      x,
      y,
      size: 3,
      lifeTime: 600,
    });
    return;
  }
  createParticle(world, {
    dx: dx + 0.1,
    dy: dy + 0.1,
    color,
    x,
    y,
    size: 4,
    lifeTime: 400,
  });
  createParticle(world, {
    dx: dx + 0.12,
    dy: dy + 0.11,
    color,
    x,
    y,
    size: 5,
    lifeTime: 600,
  });
  createParticle(world, {
    dx: dx + 0.15,
    dy: dy + 0.1,
    color,
    x,
    y,
    size: 5,
    lifeTime: 300,
  });
}

export function bam(world, color, isSmall, { x, y }) {
  if (isSmall) {
    createParticle(world, {
      dx: 0,
      dy: 0,
      color,
      x,
      y,
      size: 8,
      lifeTime: 1000,
      circle: true,
    });
    return;
  }
  createParticle(world, {
    dx: 0,
    dy: 0,
    color,
    x,
    y,
    size: 300,
    lifeTime: 3000,
    circle: true,
  });
}

export function particleSystem(world) {
  const onUpdate = function (dt) {
    const gameData = getGameData(world);
    const now = gameData.lifeTime;
    for (const entity of ECS.getEntities(world, ["particle"])) {
      if (now > entity.data.creationTime + entity.particle.lifeTime) {
        ECS.removeEntity(world, entity);
      }
    }
  };

  return { onUpdate };
}
