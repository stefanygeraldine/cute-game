import { Application, Assets, Graphics } from 'pixi.js';
import {assetsLoad, checkChildCollision, drawGraphic} from "./utils.ts";
import {IColisionsJSON, ILayer} from "./interfaces.ts";

(async () => {
    const app = new Application();
    await app.init({ background: '#000000', resizeTo: window });
    document.body.appendChild(app.canvas);

    const treesBg = await assetsLoad('src/assets/project-1.png');
    treesBg.scale.set(4.5);
    app.stage.addChild(treesBg);

    const bg1 = await assetsLoad('src/assets/tilemap01.1.png');
    app.stage.addChild(bg1);

    const player = await assetsLoad('https://pixijs.com/assets/bunny.png');
    player.x = 100;
    player.width = 50;
    player.height = 50;
    app.stage.addChild(player);

    const collidersGraphics = new Graphics();
    const colliderJson: IColisionsJSON = await Assets.load('src/assets/tilemap01.json');
    const collidersLayer: ILayer | undefined = colliderJson.layers.find((layer: ILayer) => layer.name === 'colliders')
    if (collidersLayer) {
        collidersLayer.objects.forEach((object) => {
            const childGraphics = drawGraphic(object)
            childGraphics.scale.set(4.5);
            collidersGraphics.addChild(childGraphics);
        });
        app.stage.addChild(collidersGraphics);
    }

    const steps = 10; // Horizontal movement speed

    app.ticker.add(() => {

    });
    window.addEventListener('keydown', (e) => {
        const collisionSide = checkChildCollision(player, collidersGraphics);
        if (e.key === 'ArrowRight' && collisionSide !== 'right') player.x += steps;
        if (e.key === 'ArrowLeft' && collisionSide !== 'left') player.x -= steps;
        if (e.key === 'ArrowUp' && collisionSide !== 'up') player.y -= steps;
        if (e.key === 'ArrowDown' && collisionSide !== 'down') player.y += steps;

    });
})();
