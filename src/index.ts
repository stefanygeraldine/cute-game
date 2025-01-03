import { Application, Sprite, Assets, Graphics } from 'pixi.js';

// Asynchronous IIFE
(async () => {
    // Create a PixiJS application.
    const app = new Application();

    // Initialize the application.
    await app.init({ background: '#000000', resizeTo: window });

    // Adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    // Load the tilemap and player assets
    const tileMap01 = await Assets.load('src/assets/tilemap01.1.png');
    const bg1 = new Sprite(tileMap01);
    app.stage.addChild(bg1);

    const playerSprite = await Assets.load('https://pixijs.com/assets/bunny.png');
    const player = new Sprite(playerSprite);
    player.x = 100; // Initial X position
    player.y = 400; // Initial Y position
    player.width = 50; // Adjust as needed for scaling
    player.height = 50; // Adjust as needed for scaling
    app.stage.addChild(player);

    // Load the collider JSON and process the colliders
    const colliderJson = await Assets.load('src/assets/tilemap01.json');
    const collidersLayer = colliderJson.layers.find((layer: any) => layer.name === 'colliders');

    const collidersGraphics = new Graphics();

    function processCollisionLayer() {
        if (!collidersLayer) {
            console.error('No colliders layer found');
            return;
        }

        collidersLayer.objects.forEach((object: any) => {
            const childGraphics = new Graphics();

            if (object.polygon) {
                // Draw the collision polygon
                childGraphics.beginFill(0xff0000, 0.5); // Red with 50% opacity
                childGraphics.lineStyle(1, 0xff0000);
                childGraphics.moveTo(object.x + object.polygon[0].x, object.y + object.polygon[0].y);
                object.polygon.forEach((point: any, index: number) => {
                    if (index > 0) {
                        childGraphics.lineTo(object.x + point.x, object.y + point.y);
                    }
                });
                childGraphics.closePath();
                childGraphics.endFill();
            } else {
                // For rectangular colliders
                childGraphics.beginFill(0xff0000, 0.5);
                childGraphics.drawRect(object.x, object.y, object.width, object.height);
                childGraphics.endFill();
            }

            childGraphics.scale.set(4.5);
            collidersGraphics.addChild(childGraphics);
        });

        app.stage.addChild(collidersGraphics);
    }

    processCollisionLayer();

    // Collision Detection Function
    function checkChildCollision(player: Sprite, parentGraphics: Graphics): string | null {
        for (const child of parentGraphics.children) {
            if (child instanceof Graphics) {
                const playerBounds = player.getBounds();
                const childBounds = child.getBounds();

                if (
                    playerBounds.x < childBounds.x + childBounds.width &&
                    playerBounds.x + playerBounds.width > childBounds.x &&
                    playerBounds.y < childBounds.y + childBounds.height &&
                    playerBounds.y + playerBounds.height > childBounds.y
                ) {
                    // Determine collision side
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
        }
        return null;
    }

    const steps = 15;
    let isMoving = { x: 0, y: 0 }; // Track movement intent

    // Game loop
    app.ticker.add(() => {
        const collisionSide = checkChildCollision(player, collidersGraphics);

        if (collisionSide) {
            // Stop movement only in the direction of the collision
            if (collisionSide === 'right' && isMoving.x > 0) isMoving.x = 0;
            if (collisionSide === 'left' && isMoving.x < 0) isMoving.x = 0;
            if (collisionSide === 'down' && isMoving.y > 0) isMoving.y = 0;
            if (collisionSide === 'up' && isMoving.y < 0) isMoving.y = 0;
        }

        // Apply movement
        player.x += isMoving.x;
        player.y += isMoving.y;
    });

    // Player movement
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') isMoving.x = steps;
        if (e.key === 'ArrowLeft') isMoving.x = -steps;
        if (e.key === 'ArrowUp') isMoving.y = -steps;
        if (e.key === 'ArrowDown') isMoving.y = steps;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') isMoving.x = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') isMoving.y = 0;
    });
})();
