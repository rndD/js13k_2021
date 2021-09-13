// import { loadImg } from './utils';

// // available alphabet (must match characters in the alphabet sprite exactly)
// // U = up arrow
// // D = down arrow
// // L = left arrow
// // R = right arrow
// // T = teapot icon
// export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789.:!-%,/';

// export const ALIGN_LEFT = 0;
// export const ALIGN_CENTER = 1;
// export const ALIGN_RIGHT = 2;

// // alphabet sprite, embedded as a base64 encoded dataurl by build script
// import CHARSET from '../../img/charset.webp';
// export const CHARSET_SIZE = 8; // in px
// let charset;
// let ctx;

// export const initCharset = async (canvasContext) => {
//   ctx = canvasContext;
//   charset = await loadImg(CHARSET);
// }

// /**
//  * Render a message on the canvas context using a pixelart alphabet sprite
//  * @param {*} msg 
//  * @param {*} ctx 
//  * @param {*} x 
//  * @param {*} y 
//  * @param {*} align 
//  * @param {*} scale 
//  */
// export function renderText(msg, x, y, align = ALIGN_LEFT, scale = 1) {
//   const SCALED_SIZE = scale * CHARSET_SIZE;
//   const MSG_WIDTH = msg.length * SCALED_SIZE + (msg.length - 1) * scale;
//   const ALIGN_OFFSET = align === ALIGN_RIGHT ? MSG_WIDTH :
//                        align === ALIGN_CENTER ? MSG_WIDTH / 2 :
//                        0;
//   [...msg].forEach((c, i) => {
//     ctx.drawImage(
//       charset,
//       // TODO could memoize the characters index or hardcode a lookup table
//       ALPHABET.indexOf(c) * CHARSET_SIZE, 0, CHARSET_SIZE, CHARSET_SIZE,
//       x + i * scale * (CHARSET_SIZE + 1) - ALIGN_OFFSET, y, SCALED_SIZE, SCALED_SIZE
//     );
//   });
// };




  const letters = {
      'A': [
          [, 1],
          [1, , 1],
          [1, , 1],
          [1, 1, 1],
          [1, , 1]
      ],
      'B': [
          [1, 1],
          [1, , 1],
          [1, 1, 1],
          [1, , 1],
          [1, 1]
      ],
      'C': [
          [1, 1, 1],
          [1],
          [1],
          [1],
          [1, 1, 1]
      ],
      'D': [
          [1, 1],
          [1, , 1],
          [1, , 1],
          [1, , 1],
          [1, 1]
      ],
      'E': [
          [1, 1, 1],
          [1],
          [1, 1, 1],
          [1],
          [1, 1, 1]
      ],
      'F': [
          [1, 1, 1],
          [1],
          [1, 1],
          [1],
          [1]
      ],
      'G': [
          [, 1, 1],
          [1],
          [1, , 1, 1],
          [1, , , 1],
          [, 1, 1]
      ],
      'H': [
          [1, , 1],
          [1, , 1],
          [1, 1, 1],
          [1, , 1],
          [1, , 1]
      ],
      'I': [
          [1, 1, 1],
          [, 1],
          [, 1],
          [, 1],
          [1, 1, 1]
      ],
      'J': [
          [1, 1, 1],
          [, , 1],
          [, , 1],
          [1, , 1],
          [1, 1, 1]
      ],
      'K': [
          [1, , , 1],
          [1, , 1],
          [1, 1],
          [1, , 1],
          [1, , , 1]
      ],
      'L': [
          [1],
          [1],
          [1],
          [1],
          [1, 1, 1]
      ],
      'M': [
          [1, 1, 1, 1, 1],
          [1, , 1, , 1],
          [1, , 1, , 1],
          [1, , , , 1],
          [1, , , , 1]
      ],
      'N': [
          [1, , , 1],
          [1, 1, , 1],
          [1, , 1, 1],
          [1, , , 1],
          [1, , , 1]
      ],
      'O': [
          [1, 1, 1],
          [1, , 1],
          [1, , 1],
          [1, , 1],
          [1, 1, 1]
      ],
      'P': [
          [1, 1, 1],
          [1, , 1],
          [1, 1, 1],
          [1],
          [1]
      ],
      'Q': [
          [0, 1, 1],
          [1, , , 1],
          [1, , , 1],
          [1, , 1, 1],
          [1, 1, 1, 1]
      ],
      'R': [
          [1, 1],
          [1, , 1],
          [1, , 1],
          [1, 1],
          [1, , 1]
      ],
      'S': [
          [1, 1, 1],
          [1],
          [1, 1, 1],
          [, , 1],
          [1, 1, 1]
      ],
      'T': [
          [1, 1, 1],
          [, 1],
          [, 1],
          [, 1],
          [, 1]
      ],
      'U': [
          [1, , 1],
          [1, , 1],
          [1, , 1],
          [1, , 1],
          [1, 1, 1]
      ],
      'V': [
          [1, , , , 1],
          [1, , , , 1],
          [, 1, , 1],
          [, 1, , 1],
          [, , 1]
      ],
      'W': [
          [1, , , , 1],
          [1, , , , 1],
          [1, , , , 1],
          [1, , 1, , 1],
          [1, 1, 1, 1, 1]
      ],
      'X': [
          [1, , , , 1],
          [, 1, , 1],
          [, , 1],
          [, 1, , 1],
          [1, , , , 1]
      ],
      'Y': [
          [1, , 1],
          [1, , 1],
          [, 1],
          [, 1],
          [, 1]
      ],
      'Z': [
          [1, 1, 1, 1, 1],
          [, , , 1],
          [, , 1],
          [, 1],
          [1, 1, 1, 1, 1]
      ],
      '0': [
          [1, 1, 1],
          [1, , 1],
          [1, , 1],
          [1, , 1],
          [1, 1, 1]
      ],
      '1': [
          [, 1],
          [, 1],
          [, 1],
          [, 1],
          [, 1]
      ],
      '2': [
          [1,1,1],
          [0,0,1],
          [1,1,1],
          [1,0,0],
          [1,1,1]
      ],
      '3':[
          [1,1,1],
          [0,0,1],
          [1,1,1],
          [0,0,1],
          [1,1,1]
      ],
      '4':[
          [1,0,1],
          [1,0,1],
          [1,1,1],
          [0,0,1],
          [0,0,1]
      ],
      '5':[
          [1,1,1],
          [1,0,0],
          [1,1,1],
          [0,0,1],
          [1,1,1]
      ],
      '6':[
          [1,1,1],
          [1,0,0],
          [1,1,1],
          [1,0,1],
          [1,1,1]
      ],
      '7':[
          [1,1,1],
          [0,0,1],
          [0,0,1],
          [0,0,1],
          [0,0,1]
      ],
      '8':[
          [1,1,1],
          [1,0,1],
          [1,1,1],
          [1,0,1],
          [1,1,1]
      ],
      '9':[
          [1,1,1],
          [1,0,1],
          [1,1,1],
          [0,0,1],
          [1,1,1]
      ],
      ' ': [
          [, ,],
          [, ,],
          [, ,],
          [, ,],
          [, ,]
      ],
      '/': [
        [, ,],
        [, ,1],
        [, 1,],
        [,1 ,],
        [1, ,]
    ],
      '>': [
        [, 1,],
        [1, ,],
        [,1 ,],
        [, ,1],
        [,1 ,]
    ]
  };

  
export function renderText(ctx, string, xx, yy, size, color) {
  var needed = [];
  string = string.toUpperCase(); // because I only did uppercase letters
  for (var i = 0; i < string.length; i++) {
    var letter = letters[string.charAt(i)];
    if (letter) {
      // because there's letters I didn't do
      needed.push(letter);
    }
  }

  ctx.fillStyle = color;
  var currX = xx;
  for (i = 0; i < needed.length; i++) {
    letter = needed[i];
    var currY = yy;
    var addX = 0;
    for (var y = 0; y < letter.length; y++) {
      var row = letter[y];
      for (var x = 0; x < row.length; x++) {
        if (row[x]) {
          ctx.fillRect(currX + x * size, currY, size, size);
        }
      }
      addX = Math.max(addX, row.length * size);
      currY += size;
    }
    currX += size + addX;
  }
}
