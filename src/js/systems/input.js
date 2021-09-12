import {
  BOTTOM_MENU_HEIGHT,
  ORIGINAL_HEIGHT,
  ORIGINAL_WIDTH,
  TOP_MENU_HEIGHT,
} from "../constans";
import ECS from "../lib/ecs";
import { GAME_HEIGHT, GAME_WIDTH } from "./render";

let MAIN_CANVAS = document.querySelector("canvas");

function relativeCoords(e) {
  var bounds = e.target.getBoundingClientRect();

  const xScale = ORIGINAL_WIDTH / MAIN_CANVAS.width;
  const yScale = ORIGINAL_HEIGHT / MAIN_CANVAS.height;

  return {
    x: ((e.pageX || e.changedTouches[0].pageX) - bounds.left) * xScale,
    y: ((e.pageY || e.changedTouches[0].pageY) - bounds.top) * yScale,
  };
}

let pointer = { x: 0, y: 0 };

MAIN_CANVAS.ontouchmove = MAIN_CANVAS.onpointermove = function (e) {
  e.preventDefault();

  pointer = relativeCoords(e);
};

export const inputSystem = (world) => {
  // called each game loop
  const onUpdate = function (dt) {
    let ctxTarget;
    let { x, y } = pointer;
    const game = ECS.getEntities(world, ["input"])[0];
    if (y <= TOP_MENU_HEIGHT) {
      ctxTarget = "top";
    } else if (y < ORIGINAL_HEIGHT - BOTTOM_MENU_HEIGHT) {
      ctxTarget = "game";
      y = y - TOP_MENU_HEIGHT;
    } else {
      ctxTarget = "bottom";
      y = y - ORIGINAL_HEIGHT + BOTTOM_MENU_HEIGHT;
    }
    game.input.pointer = { x, y, ctxTarget };
  };

  return { onUpdate };
};
