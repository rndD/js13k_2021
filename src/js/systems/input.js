import ECS from "../lib/ecs";

let canvas = document.querySelector("canvas");

function relativeCoords(e) {
  var bounds = e.target.getBoundingClientRect();
  return {
    x: (e.pageX || e.changedTouches[0].pageX) - bounds.left,
    y: (e.pageY || e.changedTouches[0].pageY) - bounds.top,
  };
}

let pointer = {x:0, y:0};

canvas.ontouchmove = canvas.onpointermove = function (e) {
  e.preventDefault();

  pointer = relativeCoords(e);
};

export const inputSystem = (world) => {
  // called each game loop
  const onUpdate = function (dt) {
    const game = ECS.getEntities(world, ["input"])[0];
    game.input.pointer = pointer;
  };

  return { onUpdate };
};
