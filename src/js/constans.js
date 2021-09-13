// WH SIZES
export const BOTTOM_MENU_HEIGHT = 100;
export const TOP_MENU_HEIGHT = 30;

export const ORIGINAL_HEIGHT = 896;
export const ORIGINAL_WIDTH = 504;

export const GAME_HEIGHT =
  ORIGINAL_HEIGHT - BOTTOM_MENU_HEIGHT - TOP_MENU_HEIGHT;
export const GAME_WIDTH = ORIGINAL_WIDTH;

export const LINES_GAP = 32;

export const xGridStart = 11;
export const yGridStart = GAME_HEIGHT - 4 - 32;

// COLORS
export const COLOR_BLACK = "#000";
export const COLOR_DARK_BLUE = "#1D2B53";
export const COLOR_DARK_BURGUNDY = "#7E2553";
export const COLOR_DARK_GREEN = "#008751";
export const COLOR_BROWN = "#AB5236";
export const COLOR_BROWN_LIGHT = "#5F574F";
export const COLOR_GRAY = "#C2C3C7";
export const COLOR_WHITE = "#FFF1E8";
export const COLOR_RED = "#FF004D";
export const COLOR_ORANGE = "#FFA300";
export const COLOR_YELLOW = "#FFEC27";
export const COLOR_LIGHT_GREEN = "#00E436";
export const COLOR_LIGHT_BLUE = "#29ADFF";
export const COLOR_LIGHT_VIOLA = "#83769C";
export const COLOR_PINK = "#FF77A8";
export const COLOR_PEACH = "#FFCCAA";

// game balance
export const TOWER_RELOAD = 0.5 * 1000;
export const TOWER_RANGE = 800;
export const TOWER_BULLET_SPEED = 5;
export const TOWER_DMG = 1;

export const SCORE_TOWER_RELOAD = 0.1 * 1000;
export const SCORE_TOWER_RANGE = 800;
export const SCORE_TOWER_BULLET_SPEED = 10;
export const SCORE_TOWER_DMG = 2;
export const SCORE_TOWER_SCORE = 5;

export const ROCKET_TOWER_RELOAD = 3 * 1000;
export const ROCKET_TOWER_RANGE = 500;
export const ROCKET_TOWER_BULLET_SPEED = 1;
export const ROCKET_TOWER_DMG = 10;

export const GENERATOR_TICK_TIME = 0.1 * 1000;
export const GENERATOR_TICK_VALUE = 1;
export const MAX_ENERGY = 100;

export const SHIELD_HP = 5;
export const SHIELD_RANGE = 65;
export const SHIELD_TICK = 2*1000;
export const SHIELD_TICK_VALUE = 2;

export const RANGES = { 1: TOWER_RANGE, 'gun': TOWER_RANGE, 4: ROCKET_TOWER_RANGE, 'rocket': ROCKET_TOWER_RANGE, 5: SHIELD_RANGE, 6: SCORE_TOWER_RANGE, 'sgun': SCORE_TOWER_RANGE };
export const DMGS = { 'gun': TOWER_DMG, 'rocket': ROCKET_TOWER_DMG, 'sgun': SCORE_TOWER_RANGE };
export const RELOAD = { 'gun': TOWER_RELOAD, 'rocket': ROCKET_TOWER_RELOAD, 'sgun': SCORE_TOWER_RELOAD };
export const BULLET_SPEED = { 'gun': TOWER_BULLET_SPEED, 'rocket': ROCKET_TOWER_BULLET_SPEED, 'sgun': SCORE_TOWER_BULLET_SPEED };

export const BULLETS_WH = {
  sgun: { w: 2, h: 4 },
  gun: { w: 1, h: 3 },
  rocket: { w: 4, h: 5 },
};


// points
export const ALWAYS_AVALIBLE_IF_BROKEN = {
"0.0": 1,
"1.0": 1,
"6.0": 1,
"7.0": 1,
"8.0": 1,
"13.0": 1,
"14.0": 1,
};

export const BLACKLIST_POINTS = {
"2.0": 1,
"3.0": 1,
"4.0": 1,
"5.0": 1,
"9.0": 1,
"10.0": 1,
"11.0": 1,
"12.0": 1,
"2.1": 1,
"3.1": 1,
"4.1": 1,
"5.1": 1,
"9.1": 1,
"10.1": 1,
"11.1": 1,
"12.1": 1,
"2.2": 1,
"3.2": 1,
"4.2": 1,
"5.2": 1,
"9.2": 1,
"10.2": 1,
"11.2": 1,
"12.2": 1,
};