import { Application, Assets, Graphics } from "pixi.js";
import { assetsLoad, checkChildCollision, drawGraphic } from "./utils.ts";
import { IColisionsJSON, ILayer } from "./interfaces.ts";
import { steps, height } from "./constants.ts";

(async () => {
  const app = new Application();
  await app.init({ background: "#000000", resizeTo: window });
  document.body.appendChild(app.canvas);

  const treesBg = await assetsLoad("src/assets/project-1.png");
  treesBg.scale.set(4.5);
  app.stage.addChild(treesBg);

  const bg1 = await assetsLoad("src/assets/tilemap01.1.png");
  app.stage.addChild(bg1);

  const player = await assetsLoad("https://pixijs.com/assets/bunny.png");
  player.x = 530;
  player.y = 670;
  player.width = 50;
  player.height = 50;
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
      const childGraphics = drawGraphic(object);
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
      const childGraphics = drawGraphic(object);
      childGraphics.scale.set(4.5);
      childGraphics.type = "stairs";
      collidersGraphics.addChild(childGraphics);
    });
    app.stage.addChild(collidersGraphics);
  }

  let isOnGround = false;
  let isJumping = false;

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
  });

  window.addEventListener("keydown", (e) => {
    const collisionSides = checkChildCollision(player, collidersGraphics);
    console.log("...", e.key);
    if (e.key === "ArrowDown" && !collisionSides.includes("down"))
      player.y += steps;
    if (e.key === "ArrowRight" && !collisionSides.includes("right"))
      player.x += steps;
    if (e.key === "ArrowLeft" && !collisionSides.includes("left"))
      player.x -= steps;
    if (e.key === "ArrowUp" && collisionSides.includes("stairs"))
      player.y -= steps;

    if (e.key === " ") {
      if (collisionSides.includes("down")) {
        isJumping = true;
      }
    }
  });
})();
