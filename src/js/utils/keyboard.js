class Keyboard {
  constructor() {
    this.p = {};
  }
  keyPressed(k) {
    return Boolean(this.p[k]);
  }
}

export default keyboard = new Keyboard();

onkeydown = function (e) {
  // prevent itch.io from scrolling the page up/down
  e.preventDefault();

  if (!e.repeat) {
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
      case "KeyQ": // French keyboard support
        keyboard.p["left"] = 1;
        break;
      case "ArrowUp":
      case "KeyW":
      case "KeyZ": // French keyboard support
        keyboard.p["up"] = 1;
        break;
      case "ArrowRight":
      case "KeyD":
        keyboard.p["right"] = 1;
        break;
      case "ArrowDown":
      case "KeyS":
        keyboard.p["down"] = 1;
        break;
      case "KeyP":
        break;
    }
  }
};

onkeyup = function (e) {
  switch (e.code) {
    case "ArrowLeft":
    case "KeyA":
    case "KeyQ": // French keyboard support
      keyboard.p["left"] = 0;
      break;
    case "ArrowRight":
    case "KeyD":
      keyboard.p["right"] = 0;
      break;
    case "ArrowUp":
    case "KeyW":
    case "KeyZ": // French keyboard support
      keyboard.p["up"] = 0;
      break;
    case "ArrowDown":
    case "KeyS":
      keyboard.p["down"] = 0;
      break;
  }
};
