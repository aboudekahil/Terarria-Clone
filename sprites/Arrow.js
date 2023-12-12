class Arrow extends Sprite {
    constructor(game, world, playerCenterX, playerCenterY, angle) {
        super(false);
        this.game = game;
        this.world = world;
        this.x = playerCenterX;
        this.y = playerCenterY;
        this.angle = angle;
        this.speed = 15; // Adjust speed as needed
        this.damage = 25; // Adjust damage as needed
        this.alive = true;
    }

    update() {
        // Move the arrow in the direction of the angle
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Get the camera position
        const camera = this.game.getCamera();

        // Check if the arrow goes off the visible screen area
        if (this.x < camera.x || this.x > camera.x + this.game.getWidth() || 
            this.y < camera.y || this.y > camera.y + this.game.getHeight()) {
            this.alive = false;
            return;
        }

        // Check for collision with blocks and mobs
        this.checkCollisionWithBlocks();
        this.checkCollisionWithMobs();
        this.checkCollisionWithBoss();
    }

    checkCollisionWithBlocks() {
        const currentBlock = this.world.getBlock(this.x, this.y);
        if (currentBlock && currentBlock.getType() !== 'sky') {
            this.alive = false; // Arrow disappears after hitting a block
        }
    }

    checkCollisionWithBoss() {
        // Check if there is a Boss in the game
        const boss = this.game.sprites.find(sprite => sprite instanceof Boss);
        if (boss && this.intersects(boss, boss.size, boss.size)) {
            boss.takeDamage(this.damage); // The boss takes damage
            this.alive = false; // Arrow disappears after hitting the boss
        }
    }

    checkCollisionWithMobs() {
        // Iterate through all game sprites to find mobs
        const mobs = this.game.sprites.filter(sprite => sprite instanceof Mob);
        for (const mob of mobs) {
            // Check if the arrow intersects with the mob
            if (this.intersects(mob, mob.size, mob.size * 2)) {
                mob.takeDamage(this.damage); // The mob takes damage
                this.alive = false; // Arrow disappears after hitting the mob
                break; // No need to check other mobs since the arrow is destroyed
            }
        }
    }

    intersects(sprite, xSize, ySize) {
        // Simple rectangle-based collision detection for both mobs and boss
        return this.x < sprite.x + xSize &&
            this.x + this.world.blockSize > sprite.x &&
            this.y < sprite.y + ySize &&
            this.y + this.world.blockSize > sprite.y;
    }

    draw(ctx) {
        if (!this.alive) return;

        // Drawing the arrow
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.lineTo(0, -10); // Arrowhead
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();
    }

    isAlive() {
        return this.alive;
    }

    getDamage() {
        return this.damage;
    }
}
