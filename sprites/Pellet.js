class Pellet extends Sprite {
    constructor(game, x, y, angle) {
        super(false); // Assuming Pellet is not a UI element
        this.game = game;
        this.x = x; // Initial x position
        this.y = y; // Initial y position
        this.angle = angle; // Angle for movement
        this.speed = 5; // Speed of the pellet
        this.damage = 15; // Damage dealt to the player
        this.radius = 5; // Radius of the pellet

        // Dimensions of the game world for boundary checks
        this.worldWidth = game.getWidth();
        this.worldHeight = game.getHeight();
    }

    update() {
        // Move the pellet in the direction of the angle
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Get the camera position
        const camera = this.game.getCamera();

        // Check if the pellet is off the visible screen area
        if (this.x < camera.x || this.x > camera.x + this.game.getWidth() || 
            this.y < camera.y || this.y > camera.y + this.game.getHeight()) {
            this.destroy();
            return;
        }

        // Check for collision with the player
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (player && this.collidesWithPlayer(player)) {
            player.takeDamage(this.damage);
            this.destroy();
        }
    }

    collidesWithPlayer(player) {
        // Simple collision detection between pellet and player
        return this.x < player.x + player.size &&
               this.x + this.radius > player.x &&
               this.y < player.y + player.size * 2 &&
               this.y + this.radius > player.y;
    }

    destroy() {
        // Remove the pellet from the game
        const index = this.game.sprites.indexOf(this);
        if (index > -1) {
            this.game.sprites.splice(index, 1);
        }
    }

    draw(ctx) {
        // Drawing the pellet
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
