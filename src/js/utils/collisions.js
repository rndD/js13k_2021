export function testAABBCollision(entity1, entity2) {
  const test = {
    entity1MaxX: entity1.x + entity1.w,
    entity1MaxY: entity1.y + entity1.h,
    entity2MaxX: entity2.x + entity2.w,
    entity2MaxY: entity2.y + entity2.h,
  };

  test.collide =
    entity1.x < test.entity2MaxX &&
    test.entity1MaxX > entity2.x &&
    entity1.y < test.entity2MaxY &&
    test.entity1MaxY > entity2.y;

  return test;
}

// entity1 collided into entity2
export function correctAABBCollision(entity1, entity2, test) {
  const { entity1MaxX, entity1MaxY, entity2MaxX, entity2MaxY } = test;

  const deltaMaxX = entity1MaxX - entity2.x;
  const deltaMaxY = entity1MaxY - entity2.y;
  const deltaMinX = entity2MaxX - entity1.x;
  const deltaMinY = entity2MaxY - entity1.y;

  // AABB collision response (homegrown wall sliding, not physically correct
  // because just pushing along one axis by the distance overlapped)

  // entity1 moving down/right
  if (entity1.moveX > 0 && entity1.moveY > 0) {
    if (deltaMaxX < deltaMaxY) {
      // collided right side first
      entity1.x -= deltaMaxX;
    } else {
      // collided top side first
      entity1.y -= deltaMaxY;
    }
  }
  // entity1 moving up/right
  else if (entity1.moveX > 0 && entity1.moveY < 0) {
    if (deltaMaxX < deltaMinY) {
      // collided right side first
      entity1.x -= deltaMaxX;
    } else {
      // collided bottom side first
      entity1.y += deltaMinY;
    }
  }
  // entity1 moving right
  else if (entity1.moveX > 0) {
    entity1.x -= deltaMaxX;
  }
  // entity1 moving down/left
  else if (entity1.moveX < 0 && entity1.moveY > 0) {
    if (deltaMinX < deltaMaxY) {
      // collided left side first
      entity1.x += deltaMinX;
    } else {
      // collided top side first
      entity1.y -= deltaMaxY;
    }
  }
  // entity1 moving up/left
  else if (entity1.moveX < 0 && entity1.moveY < 0) {
    if (deltaMinX < deltaMinY) {
      // collided left side first
      entity1.x += deltaMinX;
    } else {
      // collided bottom side first
      entity1.y += deltaMinY;
    }
  }
  // entity1 moving left
  else if (entity1.moveX < 0) {
    entity1.x += deltaMinX;
  }
  // entity1 moving down
  else if (entity1.moveY > 0) {
    entity1.y -= deltaMaxY;
  }
  // entity1 moving up
  else if (entity1.moveY < 0) {
    entity1.y += deltaMinY;
  }
}

export function constrainToViewport(entity, MAP) {
  if (entity.x < 0) {
    entity.x = 0;
  } else if (entity.x > MAP.width - entity.w) {
    entity.x = MAP.width - entity.w;
  }
  if (entity.y < 0) {
    entity.y = 0;
  } else if (entity.y > MAP.height - entity.h) {
    entity.y = MAP.height - entity.h;
  }
}
