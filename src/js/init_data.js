import { createPlatform, createUnit } from "./systems/units";

export function getInitialPlatforms(world) {
  return {
    "0.0": createPlatform(world, 0, 0, 1),
    "1.0": createPlatform(world, 1, 0, 1),
    "6.0": createPlatform(world, 6, 0, 1),
    "7.0": createPlatform(world, 7, 0, 1),
    "7.1": createPlatform(world, 7, 1, 1),
    "8.0": createPlatform(world, 8, 0, 1),
    "13.0": createPlatform(world, 13, 0, 1),
    "14.0": createPlatform(world, 14, 0, 1),
  };
}

export function getInitialUnits(world) {
  return {
    "7.1": createUnit(world, 7, 1, 1, 1),
    "7.0": createUnit(world, 7, 0, 2, 1),
  };
}
