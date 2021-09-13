import { getGameData } from "../game";
import ECS from "../../lib/ecs";

export function isNextTick(gameData) {
  if (gameData.lifeTime > gameData.nextWaveTime) {
    //     console.log("SPAWN");
    gameData.wave++;
    if (WAVES[gameData.wave]) {
      gameData.nextWaveTime = gameData.lifeTime + WAVES[gameData.wave].time;
      return true;
    }
  }
  return false;
}

const ENEMIES_TYPES = {
  tiny: { size: 10, hp: 1, score: 1, speed: 0.5, movementType: "linear" },
  "small-slow": {
    size: 16,
    hp: 2,
    score: 1,
    speed: 0.5,
    movementType: "linear",
  },
  small: { size: 16, hp: 2, score: 1, speed: 2, movementType: "linear" },
  "medium-slow": {
    size: 24,
    hp: 3,
    score: 3,
    speed: 0.5,
    movementType: "linear",
  },
  medium: { size: 24, hp: 5, score: 5, speed: 2, movementType: "linear" },
  "medium-slow-zig": {
    size: 24,
    hp: 6,
    score: 6,
    speed: 1,
    movementType: "zigzag",
  },
  "medium-zig": { size: 24, hp: 3, score: 7, speed: 2, movementType: "zigzag" },
  "big-slow": {
    size: 32,
    hp: 10,
    score: 5,
    speed: 0.5,
    movementType: "linear",
  },
  big: { size: 32, hp: 10, score: 10, speed: 2, movementType: "linear" },
  "big-zig": { size: 32, hp: 3, score: 15, speed: 2, movementType: "zigzag" },
  huge: { size: 64, hp: 30, score: 20, speed: 2, movementType: "linear" },
  boss: { size: 120, hp: 55, score: 50, speed: 2.5, movementType: "linear" },
  boss2: { size: 250, hp: 100, score: 100, speed: 3, movementType: "zigzag" },
};

export const WAVES = [
  { time: 1 * 1000, enemies: [] },
  {
    time: 20 * 1000,
    enemies: [
      ...Array(20).fill("tiny"),
      ...Array(10).fill("small-slow"),
      ...Array(5).fill("medium-slow"),
      ...Array(3).fill("medium-slow-zig"),
    ],
  },
  {
    time: 30 * 1000,
    enemies: [
      ...Array(10).fill("tiny"),
      ...Array(10).fill("small"),
      ...Array(5).fill("medium-slow"),
      ...Array(5).fill("medium"),
      ...Array(3).fill("medium-zig"),
    ],
  },
  {
    time: 30 * 1000,
    enemies: [
      ...Array(30).fill("small"),
      ...Array(20).fill("medium-slow"),
      ...Array(10).fill("medium"),
      ...Array(10).fill("medium-zig"),
    ],
  },
  {
    time: 40 * 1000,
    enemies: [
      ...Array(4).fill("big"),
      ...Array(1).fill("big-zig"),
      ...Array(1).fill("huge"),
      ...Array(20).fill("medium"),
      ...Array(10).fill("medium-zig"),
    ],
  },

  {
    time: 40 * 1000,
    enemies: [
      ...Array(30).fill("small"),
      ...Array(4).fill("big-zig"),
      ...Array(2).fill("huge"),
      ...Array(1).fill("boss"),
      ...Array(10).fill("medium-zig"),
    ],
  },
  {
    time: 50 * 1000,
    enemies: [
      ...Array(100).fill("small"),
      ...Array(4).fill("big-zig"),
      ...Array(4).fill("huge"),
      ...Array(2).fill("boss"),
      ...Array(2).fill("boss2"),
      ...Array(10).fill("medium-zig"),
    ],
  },
];

export function createEnemy(world, position, level, type) {
  const { x, y } = position;

  if (!ENEMIES_TYPES[type]) {
    throw new Error("there is no shuch type " + type);
  }

  const { size, hp, score, speed, movementType } = ENEMIES_TYPES[type];

  const enemy = ECS.createEntity(world);
  ECS.addComponentToEntity(world, enemy, "position", { x, y });
  ECS.addComponentToEntity(world, enemy, "renderable");
  ECS.addComponentToEntity(world, enemy, "data", {
    creationTime: getGameData(world).lifeTime,
  });
  ECS.addComponentToEntity(world, enemy, "moveable", { dx: 0, dy: 0 });
  ECS.addComponentToEntity(world, enemy, "enemy", {
    hp: hp,
    fullHp: hp,
    level,
    movementType,
    score,
    speed,
  });
  ECS.addComponentToEntity(world, enemy, "body", { w: size, h: size });
}
