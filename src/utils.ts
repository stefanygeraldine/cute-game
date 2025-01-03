import { Assets, Graphics, Sprite } from "pixi.js";
import { IObjectPolygon } from "./interfaces.ts";

export async function assetsLoad (src: string): Promise < Sprite >{
    const asset = await Assets.load(src);
    return new Sprite(asset);
}

export function drawGraphic (object: IObjectPolygon){
    const childGraphics = new Graphics();
    childGraphics.beginFill(0xff0000, 0.5);
    childGraphics.lineStyle(1, 0xff0000);
    childGraphics.moveTo(object.x + object.polygon[0].x, object.y + object.polygon[0].y);
    object.polygon.forEach((point, index) => {
        if (index > 0) {
            childGraphics.lineTo(object.x + point.x, object.y + point.y);
        }
    });
    childGraphics.closePath();
    childGraphics.endFill();

    return childGraphics
}

export  function checkChildCollision(player: Sprite, parentGraphics: Graphics): string | null {
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
                childBounds.x + childBounds.width - playerBounds.x
            );
            const overlapY = Math.min(
                playerBounds.y + playerBounds.height - childBounds.y,
                childBounds.y + childBounds.height - playerBounds.y
            );

            if (overlapX < overlapY) {
                return playerBounds.x < childBounds.x ? 'right' : 'left';
            } else {
                return playerBounds.y < childBounds.y ? 'down' : 'up';
            }
        }
    }
    return null;
}