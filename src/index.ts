import { Application, Assets, Graphics, Sprite, Texture } from "pixi.js";
import { assetsLoad, checkChildCollision, drawGraphic } from "./utils.ts";
import {
  IColisionsJSON,
  IGraphics,
  ILayer,
  IParentGraphics,
  IPlayer,
} from "./interfaces.ts";
import {
  steps,
  maxHeightJump,
  maxSpeed,
  incrementSpeed,
  floorPosition,
} from "./constants.ts";

(async () => {
  const app = new Application();
  await app.init({ background: "#000000", resizeTo: window });
  document.body.appendChild(app.canvas);

  const treesBg = await assetsLoad("src/assets/project-1.png");
  treesBg.scale.set(4.5);
  app.stage.addChild(treesBg);

  const bg1 = await assetsLoad("src/assets/tilemap01.1.png");
  app.stage.addChild(bg1);

  class Player extends Sprite implements IPlayer {
    speedX = 0;
    speedY = 0;
    positionX = 0;
    positionY = 0;

    constructor(texture: Texture) {
      super(texture);
    }
  }

  const sprite = await assetsLoad("src/assets/character1.png");
  const texture = sprite.texture;
  const player = new Player(texture);

  player.x = 0;
  player.y = floorPosition;
  player.width = 75;
  player.height = 80;
  player.positionX = 0;
  player.positionY = floorPosition;
  player.speedY = 0;
  player.speedX = 0;

  app.stage.addChild(player);

  // const collidersGraphics: IParentGraphics = new Graphics();

  const collidersGraphics = new Graphics() as IParentGraphics;
  collidersGraphics.children = collidersGraphics.children as IGraphics[];

  const colliderJson: IColisionsJSON = await Assets.load(
    "src/assets/tilemap01.json",
  );
  const collidersLayer: ILayer | undefined = colliderJson.layers.find(
    (layer: ILayer) => layer.name === "colliders",
  );
  if (collidersLayer) {
    collidersLayer.objects.forEach((object) => {
      if (!object.polygon) return;
      const childGraphics: IGraphics = drawGraphic(object);
      childGraphics.scale.set(4.5);
      childGraphics.type = "collision";
      collidersGraphics.addChild(childGraphics);
    });
    app.stage.addChild(collidersGraphics);
  }

  const stairsLayer: ILayer | undefined = colliderJson.layers.find(
    (layer: ILayer) => layer.name === "stairs",
  );
  if (stairsLayer) {
    stairsLayer.objects.forEach((object) => {
      if (!object.polygon) return;
      const childGraphics: IGraphics = drawGraphic(object);
      childGraphics.scale.set(4.5);
      childGraphics.type = "stairs";
      collidersGraphics.addChild(childGraphics);
    });
    app.stage.addChild(collidersGraphics);
  }

  let isOnGround = false;
  let isJumping = false;
  let movingRight = false;
  let movingLeft = false;
  let isGoingUp = false;
  let floorHeight = 0;

  function updatePlayerPosition() {
    const collisionSides = checkChildCollision(player, collidersGraphics);
    isOnGround = collisionSides.includes("down");

    // apply physics
    if (!isJumping && !isOnGround && !collisionSides.includes("stairs")) {
      player.positionY += steps;
    }

    if (isOnGround) {
      floorHeight = player.y; // - 10; // set a different value
    }

    if (movingRight && !collisionSides.includes("right")) {
      player.positionX += player.speedX;
    } else if (movingLeft && !collisionSides.includes("left")) {
      player.positionX -= player.speedX;
    } else {
      player.speedX = 0;
    }

    //jumping
    if (isJumping) {
      if (player.positionY >= floorHeight - maxHeightJump && isGoingUp) {
        player.positionY -= 3;
      } else {
        isGoingUp = false;
        player.positionY += 3;
        if (collisionSides.includes("down")) {
          isJumping = false;
        }
      }
    }

    player.x = player.positionX ?? 0;
    player.y = player.positionY ?? 0;
  }

  app.ticker.add(() => {
    updatePlayerPosition();
  });

  window.addEventListener("keydown", (e) => {
    const collisionSides = checkChildCollision(player, collidersGraphics);

    if (e.key === "ArrowDown" && !collisionSides.includes("down")) {
      player.positionY += steps;
    }

    if (e.key === "ArrowUp" && collisionSides.includes("stairs")) {
      player.positionY -= steps;
    }

    if (e.key === " ") {
      isJumping = true;
      if (collisionSides.includes("down")) isGoingUp = true;
    }

    if (e.key === "ArrowRight" && !collisionSides.includes("right")) {
      if (player.speedX !== maxSpeed) player.speedX += incrementSpeed;
      movingRight = true;
    }

    if (e.key === "ArrowLeft" && !collisionSides.includes("left")) {
      if (player.speedX !== maxSpeed) player.speedX += incrementSpeed;
      movingLeft = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") movingRight = false;
    if (e.key === "ArrowLeft") movingLeft = false;
  });
})();
