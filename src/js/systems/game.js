
import { getInitialPlatforms, getInitialUnits } from "../init_data";
import ECS from "../lib/ecs";
import { BOTTOM_BUTONS } from "../ui";
import { isPointerIn } from "../utils/collisions";
import { buy, setBuildingMode, clearMode, calcBuildingAvaliblePoints, emp } from "./helpers/game";

export function createGame(world) {
  const GAME = ECS.createEntity(world);
  ECS.addComponentToEntity(world, GAME, "gameData", {
    wave: 1,
    lifeTime: 0,
    score: 1005,
    hp: 1000,
    energy: 40,
    mode: null,
    platforms: getInitialPlatforms(world),
    units: getInitialUnits(world)
  });

  ECS.addComponentToEntity(world, GAME, "input", {
    pointer: { x: 0, y: 0 },
    clicked: null,
  });
}

export function gameSystem(world) {
  const onUpdate = function (dt) {
    const game = ECS.getEntities(world, ["gameData"])[0];
    // lifetime
    game.gameData.lifeTime += dt;
    const { gameData } = game;

    // input click
    if (game.input.clicked) {
      game.input.clicked = null;
      const { pointer } = game.input;

      // Bottom logic
      if (pointer.ctxTarget === "bottom") {
        clearMode(gameData);
        for (const [i, b] of BOTTOM_BUTONS.entries()) {
          if (isPointerIn(pointer, b)) {
		  if (i == 3) {
			emp(world, gameData, b.price);
			break;
		  }
            setBuildingMode(i, gameData);
            break;
          }
        }
      }

      // Game logic
      if (pointer.ctxTarget === "game") {
        if (gameData.mode?.type === "building") {
          for (const [xy, box] of Object.entries(gameData.mode.avaiblePoints)) {
            if (isPointerIn(pointer, box)) {
              buy(world, gameData.mode.index, xy, gameData);
              break;
            }
          }
          clearMode(gameData);
        }
      }
    }

    //  prepare points
    if (game.gameData.mode?.type === "building") {
      calcBuildingAvaliblePoints(world, gameData);
    }
  };

  return { onUpdate };
}




export function getGameData(world) {
  const game = ECS.getEntities(world, ["gameData"])[0];
  return game.gameData;
}
