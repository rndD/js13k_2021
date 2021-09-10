import ECS from "../lib/ecs";

export function gameSystem(world) {
  const onUpdate = function (dt) {
    const game = ECS.getEntities(world, ["gameData"])[0];
    game.gameData.lifeTime += dt;
  };

  return { onUpdate };
}

export function getGameData(world) {
  const game = ECS.getEntities(world, ["gameData"])[0];
  return game.gameData;
}
