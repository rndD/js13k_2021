import {
  ALWAYS_AVALIBLE_IF_BROKEN,
  BLACKLIST_POINTS,
  BULLET_SPEED,
  COLOR_DARK_BLUE,
  COLOR_LIGHT_BLUE,
  DMGS,
  GAME_HEIGHT,
  GAME_WIDTH,
  RANGES,
  RELOAD,
  xGridStart,
  yGridStart,
} from "../../constans";
import ECS from "../../lib/ecs";
import { BOTTOM_BUTONS } from "../../ui";
import { bam } from "../particles";
import { createPlatform, createUnit } from "../units";

export function emp(world, gameData, price) {
	if (!gameData.energy > price) {
		return;
	}
	gameData.energy -= price;
	for (const entitie of ECS.getEntities(world, ["enemy"])) {
		entitie.enemy.hp = 0;
	}
	bam(world, COLOR_LIGHT_BLUE, 0, {x: GAME_WIDTH/2, y:GAME_HEIGHT - 300});
}



export function buy(world, index, xy, gameData) {
  const [x, y] = xy.split(".");
  const xGrid = Number(x);
  const yGrid = Number(y);
  if (index === 0) {
    const { price } = BOTTOM_BUTONS[index];
    if (gameData.energy >= price) {
      gameData.platforms[xy] = createPlatform(world, xGrid, yGrid, false);
      gameData.energy = gameData.energy - price;
    }
  }

  if ([1, 2, 4, 5].includes(index)) {
    const { price } = BOTTOM_BUTONS[index];
    if (gameData.energy >= price) {
      gameData.platforms[xy] = createUnit(world, xGrid, yGrid, index, false);
      gameData.energy = gameData.energy - price;
    }
  }

  // s gun
  if (index === 6) {
    const { price } = BOTTOM_BUTONS[index];
    if (gameData.score >= price) {
      gameData.platforms[xy] = createUnit(world, xGrid, yGrid, index, false);
      gameData.score = gameData.score - price;
    }
  }
}

export function setBuildingMode(index, gameData) {
  gameData.mode = { type: "building", index, avaiblePoints: null };
}

export function clearMode(gameData) {
  gameData.mode = null;
}

export function calcBuildingAvaliblePoints(world, gameData) {
  const avaiblePoints = {};
  const { platforms, units } = gameData;

  if (gameData.mode.index === 0) {
    for (const [xy, id] of Object.entries(platforms)) {
      let [x, y] = xy.split(".");
      x = Number(x);
      y = Number(y);
      if (
        15 > x - 1 &&
        x - 1 > 0 &&
        !platforms[`${x - 1}.${y}`] &&
        !BLACKLIST_POINTS[`${x - 1}.${y}`]
      ) {
        avaiblePoints[`${x - 1}.${y}`] = 1;
      }
      if (
        15 > x + 1 &&
        x + 1 > 0 &&
        !platforms[`${x + 1}.${y}`] &&
        !BLACKLIST_POINTS[`${x + 1}.${y}`]
      ) {
        avaiblePoints[`${x + 1}.${y}`] = 1;
      }
      if (
        15 > y + 1 &&
        y + 1 > 0 &&
        !platforms[`${x}.${y + 1}`] &&
        !BLACKLIST_POINTS[`${x}.${y + 1}`]
      ) {
        avaiblePoints[`${x}.${y + 1}`] = 1;
      }
      if (
        15 > y - 1 &&
        y - 1 > 0 &&
        !platforms[`${x}.${y - 1}`] &&
        !BLACKLIST_POINTS[`${x}.${y - 1}`]
      ) {
        avaiblePoints[`${x}.${y - 1}`] = 1;
      }
    }

    for (const [xy] of Object.entries(ALWAYS_AVALIBLE_IF_BROKEN)) {
      if (!platforms[xy]) {
        avaiblePoints[xy] = 1;
      }
    }
  } else {
    // units
    for (const [xy] of Object.entries(platforms)) {
      if (!units[xy]) {
        avaiblePoints[xy] = 1;
      }
    }
  }

  for (const [xy] of Object.entries(avaiblePoints)) {
    let [x, y] = xy.split(".");
    xGrid = Number(x);
    yGrid = Number(y);
    x = xGridStart + xGrid * 32 + 2;
    y = yGridStart - yGrid * 32 + 2;
    const w = 28;
    const h = 28;
    avaiblePoints[xy] = { x, y, w, h };
  }
  gameData.mode.avaiblePoints = avaiblePoints;
}

export function getRange(index) {
  const range = RANGES[index];
  if (!range) {
    throw new Error("no range for index " + index);
  }
  return range;
}

export function getDmg(index) {
  const range = DMGS[index];
  if (!range) {
    throw new Error("no dmg for index " + index);
  }
  return range;
}

export function getReload(index) {
  const range = RELOAD[index];
  if (!range) {
    throw new Error("no reload for index " + index);
  }
  return range;
}

export function getBulletSpeed(index) {
  const range = BULLET_SPEED[index];
  if (!range) {
    throw new Error("no speed for index " + index);
  }
  return range;
}
