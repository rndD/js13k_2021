export function testAABBCollision(
  entity1pos,
  entity1wh,
  entity2pos,
  entity2wh
) {
  const test = {
    entity1MaxX: entity1pos.x + entity1wh.w,
    entity1MaxY: entity1pos.y + entity1wh.h,
    entity2MaxX: entity2pos.x + entity2wh.w,
    entity2MaxY: entity2pos.y + entity2wh.h,
  };

  test.collide =
    entity1pos.x < test.entity2MaxX &&
    test.entity1MaxX > entity2pos.x &&
    entity1pos.y < test.entity2MaxY &&
    test.entity1MaxY > entity2pos.y;

  return test;
}

// entity1 collided into entity2
// TODO
export function correctAABBCollision(entity1, entity2, test) {
  const { entity1MaxX, entity1MaxY, entity2MaxX, entity2MaxY } = test;

  const deltaMaxX = entity1MaxX - entity2.position.x;
  const deltaMaxY = entity1MaxY - entity2.position.y;
  const deltaMinX = entity2MaxX - entity1.position.x;
  const deltaMinY = entity2MaxY - entity1.position.y;

  // AABB collision response (homegrown wall sliding, not physically correct
  // because just pushing along one axis by the distance overlapped)

  // entity1 moving down/right
  if (entity1.moveable.dx > 0 && entity1.moveable.dy > 0) {
    if (deltaMaxX < deltaMaxY) {
      // collided right side first
      entity1.position.x -= deltaMaxX;
    } else {
      // collided top side first
      entity1.position.y -= deltaMaxY;
    }
  }
  // entity1 moving up/right
  else if (entity1.moveable.dx > 0 && entity1.moveable.dy < 0) {
    if (deltaMaxX < deltaMinY) {
      // collided right side first
      entity1.position.x -= deltaMaxX;
    } else {
      // collided bottom side first
      entity1.position.y += deltaMinY;
    }
  }
  // entity1 moving right
  else if (entity1.moveable.dx > 0) {
    entity1.position.x -= deltaMaxX;
  }
  // entity1 moving down/left
  else if (entity1.moveable.dx < 0 && entity1.moveable.dy > 0) {
    if (deltaMinX < deltaMaxY) {
      // collided left side first
      entity1.position.x += deltaMinX;
    } else {
      // collided top side first
      entity1.position.y -= deltaMaxY;
    }
  }
  // entity1 moving up/left
  else if (entity1.moveable.dx < 0 && entity1.moveable.dy < 0) {
    if (deltaMinX < deltaMinY) {
      // collided left side first
      entity1.position.x += deltaMinX;
    } else {
      // collided bottom side first
      entity1.position.y += deltaMinY;
    }
  }
  // entity1 moving left
  else if (entity1.moveable.dx < 0) {
    entity1.position.x += deltaMinX;
  }
  // entity1 moving down
  else if (entity1.moveable.dy > 0) {
    entity1.position.y -= deltaMaxY;
  }
  // entity1 moving up
  else if (entity1.moveable.dy < 0) {
    entity1.position.y += deltaMinY;
  }
}

export function isPointerIn(pointer, { x, y, w, h }) {
  return (
    pointer.x > x && pointer.x < x + w && pointer.y > y && pointer.y < y + h
  );
}
