import { Application, Assets, Graphics } from "pixi.js";
import { assetsLoad, checkChildCollision, drawGraphic } from "./utils.ts";
import { IColisionsJSON, IGraphics, ILayer, IPlayer } from "./interfaces.ts";
import { steps, height, maxSpeed, incrementSpeed } from "./constants.ts";

(async () => {
  const app = new Application();
  await app.init({ background: "#000000", resizeTo: window });
  document.body.appendChild(app.canvas);

  const treesBg = await assetsLoad("src/assets/project-1.png");
  treesBg.scale.set(4.5);
  app.stage.addChild(treesBg);

  const bg1 = await assetsLoad("src/assets/tilemap01.1.png");
  app.stage.addChild(bg1);

  const player: IPlayer = await assetsLoad(
    "https://pixijs.com/assets/bunny.png",
  );
  player.x = 530;
  player.y = 670;
  player.width = 50;
  player.height = 50;
  player.positionX = 0;
  player.positionY = 0;
  player.speedY = 0;
  player.speedX = 0;

  app.stage.addChild(player);

  const collidersGraphics = new Graphics();
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

  app.ticker.add(() => {
    const collisionSides = checkChildCollision(player, collidersGraphics);
    isOnGround = collisionSides.includes("down");

    // apply physics
    if (!isOnGround && !collisionSides.includes("stairs")) {
      player.y += steps;
    }
    //jumping
    if (isJumping) {
      if (collisionSides.includes("down")) {
        player.y -= height;
        isJumping = false;
      }
    }

    if (movingRight) {
      player.positionX += player.speedX;
    }
    if (movingLeft) {
      player.positionX -= player.speedX;
    }

    // Actualizar posición del personaje

    player.x = player.positionX ?? 0;
    //player.y = player.positionY ?? 0;
  });

  window.addEventListener("keydown", (e) => {
    const collisionSides = checkChildCollision(player, collidersGraphics);
    if (e.key === "ArrowDown" && !collisionSides.includes("down"))
      player.y += steps;
    if (e.key === "ArrowUp" && collisionSides.includes("stairs"))
      player.y -= steps;

    if (e.key === " ") {
      if (collisionSides.includes("down")) {
        isJumping = true;
      }
    }

    if (isJumping) {
      /* empty */
    } else {
      if (e.key === "ArrowRight" && !collisionSides.includes("right")) {
        if (player.speedX !== maxSpeed) {
          player.speedX += incrementSpeed;
        }

        movingRight = true;
      }

      if (e.key === "ArrowLeft" && !collisionSides.includes("left")) {
        if (player.speedX !== maxSpeed) {
          player.speedX += incrementSpeed;
        }
        movingLeft = true;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
      movingRight = false;
    } else if (e.key === "ArrowLeft") {
      movingLeft = false;
    }
    player.speedX = 0;
  });
})();
