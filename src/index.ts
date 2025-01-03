import { Application, Sprite, Assets, Graphics } from 'pixi.js';

// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const app = new Application();

    // Initialize the application.
    await app.init({ background: '#000000', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);


    const tileMap01 = await Assets.load('src/assets/tilemap01.1.png');

    const bg1 = new Sprite(tileMap01);
    //bg1.width = window.innerWidth;
    //bg1.height = window.innerHeight;
    app.stage.addChild(bg1);



    const playerSprite = await Assets.load('https://pixijs.com/assets/bunny.png');
    const player = new Sprite(playerSprite);
    player.x = 100; // Posición inicial en X
    player.y = 400; // Posición inicial en Y
    app.stage.addChild(player);

//collider
    const colliderJson = await Assets.load('src/assets/tilemap01.json');
    const collider = new Sprite(colliderJson);
    const collidersLayer = collider.layers.find((layer: any) => layer.name === 'colliders');

    function processCollisionLayer() {
        // Find the colliders layer

        if (!collidersLayer) {
            console.error('No colliders layer found');
            return;
        }

        const graphics = new Graphics();

        collidersLayer.objects.forEach((object: any) => {
            if (object.polygon) {
                // Draw the collision polygon (optional, for visualization)
                graphics.beginFill(0xff0000, 0.5); // Red with 50% opacity
                graphics.lineStyle(1, 0xff0000);

                graphics.moveTo(object.x + object.polygon[0].x, object.y + object.polygon[0].y);
                object.polygon.forEach((point: any, index: number) => {
                    if (index > 0) {
                        graphics.lineTo(object.x + point.x, object.y + point.y);
                    }
                });
                graphics.closePath();
                graphics.endFill();
            }
        });
        graphics.scale.set(4.5);
        app.stage.addChild(graphics);
    }




    processCollisionLayer()




    const steps = 10
    console.log('app', app.stage)

    app.ticker.add((time) => {
        //console.log('Colisión detectada!');
    });
    console.log('>>>', player.getBounds())



    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') player.x += steps;
        if (e.key === 'ArrowLeft') player.x -= steps;
        if (e.key === 'ArrowUp') player.y -= steps;
        if (e.key === 'ArrowDown') player.y += steps;

    });



})();
