import { Assets, Graphics, Sprite } from "pixi.js";
import { IObjectPolygon } from "./interfaces.ts";

export async function assetsLoad(src: string): Promise<Sprite> {
  const asset = await Assets.load(src);
  return new Sprite(asset);
}

export function drawGraphic(object: IObjectPolygon) {
  const childGraphics = new Graphics();
  childGraphics.fill(0x650a5a, 0);
  childGraphics.stroke({ width: 1, color: 0xff00ff, alpha: 0 });
  childGraphics.moveTo(
    object.x + object.polygon[0].x,
    object.y + object.polygon[0].y,
  );
  object.polygon.forEach((point, index) => {
    if (index > 0) {
      childGraphics.lineTo(object.x + point.x, object.y + point.y);
    }
  });
  childGraphics.closePath();
  childGraphics.endFill();
  return childGraphics;
}

export function checkChildCollision(
  player: Sprite,
  parentGraphics: Graphics,
): string[] {
  const collisionSides: string[] = [];
  for (const child of parentGraphics.children) {
    const playerBounds = player.getBounds();
    const childBounds = child.getBounds();
    if (
      playerBounds.x < childBounds.x + childBounds.width &&
      playerBounds.x + playerBounds.width > childBounds.x &&
      playerBounds.y < childBounds.y + childBounds.height &&
      playerBounds.y + playerBounds.height > childBounds.y
    ) {
      const overlapX = Math.min(
        playerBounds.x + playerBounds.width - childBounds.x,
        childBounds.x + childBounds.width - playerBounds.x,
      );
      const overlapY = Math.min(
        playerBounds.y + playerBounds.height - childBounds.y,
        childBounds.y + childBounds.height - playerBounds.y,
      );

      if (child.type === "stairs") {
        collisionSides.push("stairs");
      } else {
        if (overlapX < overlapY) {
          collisionSides.push(
            playerBounds.x < childBounds.x ? "right" : "left",
          );
        } else {
          collisionSides.push(playerBounds.y < childBounds.y ? "down" : "up");
        }
      }
    }
  }
  return collisionSides;
}

export function isPlayerOnTopOfStairs(
  player: Sprite,
  stairsGraphics: Graphics,
): boolean {
  for (const child of stairsGraphics.children) {
    const playerBounds = player.getBounds();
    const childBounds = child.getBounds();
    if (
      playerBounds.x < childBounds.x + childBounds.width &&
      playerBounds.x + playerBounds.width > childBounds.x &&
      playerBounds.y < childBounds.y + childBounds.height &&
      playerBounds.y + playerBounds.height > childBounds.y
    ) {
      // Check if the player is on top of the stairs
      if (playerBounds.y + playerBounds.height <= childBounds.y + 10) {
        return true;
      }
    }
  }
  return false;
}

/*
 // Gravity and movement
const gravity = 1; // Strength of gravity
let velocityY = 0; // Player's vertical velocity
let isOnGround = false; // Tracks if the player is on the ground


 // Gravity effect
        if (!isOnGround) {
            velocityY += gravity;
        } else {
            velocityY = 0; // Reset vertical velocity if on ground
        }

        player.y += velocityY; // Apply gravity


        // Collision detection
        const collisionSide = checkChildCollision(player, collidersGraphics);

        if (collisionSide) {
            console.log('...', collisionSide)
            if (collisionSide === 'down') {
                isOnGround = true; // Stop falling if on ground
                player.y -= velocityY; // Adjust position to avoid overlap
            } else {
                isOnGround = false;
            }
        } else {
            isOnGround = false;
        }*/
