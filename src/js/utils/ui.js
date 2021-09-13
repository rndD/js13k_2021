import { COLOR_BLACK, COLOR_GRAY, COLOR_RED, COLOR_WHITE, COLOR_YELLOW } from "../constans";
import { renderText } from "./text";

export function drawButton(
  ctx,
  x,
  y,
  w,
  h,
  { isSelectable, isSelected, topText, bottomText, bottomTextColor, color}
) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  if (isSelectable) {
    
    if (isSelected) {
	ctx.strokeStyle = COLOR_YELLOW;
    }else {
	ctx.strokeStyle = COLOR_WHITE;
    }
    // ctx.fillStyle();
  } else {
    ctx.strokeStyle = COLOR_RED;
    ;
  }

  ctx.lineJoin = "round";
  ctx.rect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fill()
  ctx.stroke();

  if (topText) {
    renderText(
      ctx,
      topText,
      x -5,
      y - 15,
      1.5,
      isSelectable ? COLOR_WHITE : COLOR_GRAY
    );
  }

  if (bottomText) {
    renderText(ctx, bottomText, x, y + h + 5, 3, bottomTextColor);
  }
}
