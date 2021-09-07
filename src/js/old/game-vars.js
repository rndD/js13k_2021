// RENDER VARIABLES

const CTX = c.getContext("2d"); // visible canvas
const MAP = c.cloneNode(); // full map rendered off screen
const MAP_CTX = MAP.getContext("2d");
MAP.width = 640; // map size
MAP.height = 480;
const VIEWPORT = c.cloneNode(); // visible portion of map/viewport
const VIEWPORT_CTX = VIEWPORT.getContext("2d");
VIEWPORT.width = 240; // viewport size
VIEWPORT.height = 240;

// camera-window & edge-snapping settings
const CAMERA_WINDOW_X = 100;
const CAMERA_WINDOW_Y = 50;
const CAMERA_WINDOW_WIDTH = VIEWPORT.width - CAMERA_WINDOW_X;
const CAMERA_WINDOW_HEIGHT = VIEWPORT.height - CAMERA_WINDOW_Y;

const ATLAS = {
  hero: {
    move: [
      { x: 0, y: 0, w: 16, h: 18 },
      { x: 16, y: 0, w: 16, h: 18 },
      { x: 32, y: 0, w: 16, h: 18 },
      { x: 48, y: 0, w: 16, h: 18 },
      { x: 64, y: 0, w: 16, h: 18 },
    ],
    speed: 100,
  },
  foe: {
    move: [{ x: 0, y: 0, w: 16, h: 18 }],
    speed: 0,
  },
};
const FRAME_DURATION = 0.1; // duration of 1 animation frame, in seconds

// GAMEPLAY VARIABLES
const GAME_SCREENS = {
  TITLE_SCREEN:  0,
  GAME_SCREEN: 1,
  END_SCREEN: 2
};

export const GAME_VARIABLES = {
  CTX,
  MAP,
  MAP_CTX,
  VIEWPORT,
  VIEWPORT_CTX,
  CAMERA_WINDOW_X,
  CAMERA_WINDOW_Y,
  CAMERA_WINDOW_HEIGHT,
  CAMERA_WINDOW_WIDTH,
  ATLAS,
  FRAME_DURATION,
  GAME_SCREENS
};
