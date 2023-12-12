/* This is the main game engine. It's responsible for setting up the game, managing the game loop, handling
user input, and coordinating the other parts of the game. It might also manage the game state, like whether
the player died or won, or if the game is paused, etc. */

class Game {

    // Create the canvas and the array of sprites
    constructor(width, height) {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.sprites = [];
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);

        this.deathScreen = false; // Whether or not to show the death screen.

        this.selectedSlot = 0;

        this.world = new World(this.width, this.height);
        this.keys = new Set();
        this.camera = { x: 0, y: 0 };

        window.addEventListener('keydown', (event) => {

            /*
            The sound track can only be initialized inside of an event listner
            since the browser doesn't allow sounds unless through an event 
            listener.
            */
            if (!soundtrack) {
                initSoundtrack("nature");
            }

            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.keys.add('w');
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.keys.add('a');
                    break;
                case 'd':
                case 'ArrowRight':
                    this.keys.add('d');
                    break;
                case 's':
                case 'ArrowDown':
                    this.keys.add('s');
                    break;
                case 'r':
                    const player = this.sprites.find(sprite => sprite instanceof Player);
                    if (!player.isAlive) {
                        this.deathScreen = false;
                        player.respawn();
                    }
                    break;
            }

            // Handle number keys for selecting inventory slots
            if (event.key >= '1' && event.key <= '9') {
                this.selectedSlot = parseInt(event.key) - 1;
            } else if (event.key === '0') {
                this.selectedSlot = 9;
            }

        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.keys.delete('w');
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.keys.delete('a');
                    break;
                case 'd':
                case 'ArrowRight':
                    this.keys.delete('d');
                    break;
                case 's':
                case 'ArrowDown':
                    this.keys.delete('s');
                    break;
            }
        });

        this.mouseClick = { x: 0, y: 0 };

        window.addEventListener('mousedown', (event) => {
            this.mouseClick = { x: event.clientX, y: event.clientY };
        });

        window.addEventListener('mouseup', () => {
            this.mouseClick = { x: 0, y: 0 };
        });

    }

    getCanvas() {
        return this.canvas;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getWorld() {
        return this.world;
    }

    getKeys() {
        return this.keys;
    }

    getMouse() {
        return this.mouseClick;
    }

    getCamera() {
        return this.camera;
    }


    start() {
        // Start the game loop
        this.loop();
    }

    // Add a sprite to the array of sprites
    add(obj) {
        this.sprites.push(obj);
    }

    loop() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update camera
        const player = this.sprites.find(sprite => sprite instanceof Player);
        if (player) {
            this.camera.x = Math.max(0, Math.min(this.world.width - this.width, player.x - this.width / 2));
            this.camera.y = Math.max(0, Math.min(this.world.height - this.height, player.y - this.height / 2));
        }

        // Draw world with camera offset
        this.ctx.save();
        this.ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));
        this.world.draw(this.ctx);

        // Update all the non-UI sprites
        for (let i = 0; i < this.sprites.length; i++) {
            if (!this.sprites[i].isUI) {
                this.sprites[i].update();
            }
        }

        // Draw all the non-UI sprites
        for (let i = 0; i < this.sprites.length; i++) {
            if (!this.sprites[i].isUI) {
                this.sprites[i].draw(this.ctx);
            }
        }

        this.ctx.restore();

        if (this.deathScreen) {
            displayDeathScreen(this.ctx, this.width, this.height);
            return;
        }

        // Update all the UI sprites
        for (let i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].isUI) {
                this.sprites[i].update();
            }
        }

        // Draw all the UI sprites
        for (let i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].isUI) {
                this.sprites[i].draw(this.ctx);
            }
        }

        // Schedule the next frame
        requestAnimationFrame(() => { this.loop() });
    }

}