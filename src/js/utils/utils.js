// PSEUDO RANDOM NUMBER GENERATOR

// current Pseudo Random Number Generator (PRNG)
// NOTE: default to non-deterministic Math.random() in case initRand() doesn't get called
let prng = Math.random;

// initialize a new deterninistic PRNG from the provided seed and store the seed in the URL
export function setRandSeed(seed) {
  prng = seedRand(seed);

  // save seed in URL
  const url = new URL(location);
  url.searchParams.set("seed", seed);
  history.pushState({}, "", url);
}

// return a seed value retrieved from the URL (if present) or generated (if missing or asked to change)
export function getRandSeed(changeSeed = false) {
  // attempt to read seed from URL
  let seed = new URLSearchParams(location.search).get("seed");

  return !seed || changeSeed ? createRandSeed() : seed;
}

/**
 * Create a seeded random number generator.
 * Copied from Kontra.js by Steven Lambert
 *
 * ```
 * let rand = seedRand('kontra');
 * console.log(rand());  // => always 0.33761959057301283
 * ```
 * @see https://github.com/straker/kontra/blob/main/src/helpers.js
 * @see https://stackoverflow.com/a/47593316/2124254
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 *
 * @function seedRand
 * @param {String} str - String to seed the random number generator.
 * @returns {() => Number} Seeded random number generator function.
 */
function seedRand(str) {
  // based on the above references, this was the smallest code yet decent
  // quality seed random function

  // first create a suitable hash of the seed string using xfnv1a
  // @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
  for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  h += h << 13;
  h ^= h >>> 7;
  h += h << 3;
  h ^= h >>> 17;
  let seed = (h += h << 5) >>> 0;

  // then return the seed function and discard the first result
  // @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#lcg-lehmer-rng
  let rand = () => ((2 ** 31 - 1) & (seed = Math.imul(48271, seed))) / 2 ** 31;
  rand();
  return rand;
}

// return a new seed made of a combination of 6 letters or numbers
function createRandSeed() {
  // base64-encoding a random number between 0 and 1, discarding the first 3 characters (always MC4) and keeping the next 6
  return btoa(prng()).slice(3, 9);
}

export function rand(min = 0, max = 1) {
  return prng() * (max + 1 - min) + min;
}

export function randInt(min = 0, max = 1) {
  return Math.floor(rand(min, max));
}

export function choice(values) {
  return values[randInt(0, values.length - 1)];
}

// LERP

/**
 * Return a value between min and max based on current time in range [0...1]
 * @param {*} min min value
 * @param {*} max max value
 * @param {*} t current time in range [0...1]
 */
export function lerp(min, max, t) {
  if (t < 0) return min;
  if (t > 1) return max;
  return min * (1 - t) + max * t;
}

/**
 * Return a value from an array of values based on current time in range [0...1]
 * @param {*} values array of values to pick from
 * @param {*} t current time in range [0...1], mapped to an index in values
 */
export function lerpArray(values, t) {
  if (t < 0) return values[0];
  if (t > 1) return values[values.length - 1];

  return values[Math.floor((values.length - 1) * t)];
}

/**
 * Return a value between the values of an array based on current time in range [0...1]
 * @param {*} values array of values to pick from
 * @param {*} t current time in range [0...1], mapped to an index in values
 */
export function smoothLerpArray(values, t) {
  if (t <= 0) return values[0];
  if (t >= 1) return values[values.length - 1];

  const start = Math.floor((values.length - 1) * t);
  const min = values[start];
  const max = values[Math.ceil((values.length - 1) * t)];
  // t * number of intervals - interval start index
  const delta = t * (values.length - 1) - start;
  return lerp(min, max, delta);
}

// IMAGE LOADING

export function loadImg(dataUri) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = dataUri;
  });
}

export function dist(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

export function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha != undefined) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export function addToText(str, n, char) {
  str = String(str);
  let x =  n -str.length;
  return new Array(x + 1).join(char) + str;
} 

export function id() {
  return Math.random().toString(36).substr(2, 9);
};

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}