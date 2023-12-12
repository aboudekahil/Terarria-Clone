/* The file will contain all the functionality of a Mob. The health, speed, AI.... Depending on the time for the
project, more than one Mob could be added, which means a file for each one.  */
class Mob extends Sprite {
    constructor(game, x, y) {
        super(false);
        this.game = game;
        this.world = game.getWorld();
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.size = this.world.getBlockSize(); // Assuming the mob is 1x2 blocks in size
        this.gravity = 3;
        this.velocityY = 5;
        this.jumpForce = 45; // Strong enough to jump over two blocks
        this.grounded = false;

        this.health = 100; // Mob health
        this.damage = 35; // Mob damage
        this.isDead = false;
        this.hitCooldown = 0; // Cooldown frames for being hit
        this.hasDroppedLoot = false;

        this.despawnDistance = 80; // Distance between player and mob to trigger despawn
        this.timeBeyondDistance = 0; // Counter to monitor how long the despawn distance was triggered for
        this.despawnTime = 10 * 60; // 10 seconds for despawn, for 60 FPS. 

        // Sprite sheet related initialization
        this.spriteSheet = new Image();
        this.spriteSheet.src = "images/mob.png";
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameDuration = 5; // Display each frame for 5 game frames
    }

    deleteMob() {
        let index = this.game.sprites.indexOf(this);
        this.game.sprites.splice(index, 1);
    }

    dropLoot() {
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (player) {
            player.addToInventory('mob-meat');
        }
        this.deleteMob()
    }

    // Method to take damage
    takeDamage(amount) {
        if (this.hitCooldown === 0) {
            this.health -= amount;
            if (this.health <= 0) {
                this.isDead = true;
            }
            this.hitCooldown = 15; // Set cooldown frames
        }

    }

    update() {
        this.applyGravity();
        this.moveTowardsPlayer();
        this.checkCollisionWithPlayer();

        // Reduce hit cooldown
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
        }

        if (this.isDead && !this.hasDroppedLoot) {
            this.dropLoot();
            this.hasDroppedLoot = true; // Ensure loot is dropped only once
        }

        // Check distance to player
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (player) {
            const distance = this.calculateDistanceToPlayer(player);
            if (distance > this.despawnDistance * this.world.getBlockSize()) {
                this.timeBeyondDistance++;
                if (this.timeBeyondDistance >= this.despawnTime) {
                    this.deleteMob();
                    return; // Stop further execution after despawning
                }
            } else {
                this.timeBeyondDistance = 0; // Reset timer if within range
            }
        }

        // Update frame timer and frame index
        this.frameTimer++;
        if (this.frameTimer >= this.frameDuration) {
            this.frameIndex = (this.frameIndex + 1) % 3; // Loop through 3 frames
            this.frameTimer = 0;
        }

    }

    calculateDistanceToPlayer(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    checkCollisionWithPlayer() {
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (this.touchesPlayer(player)) {
            player.takeDamage(this.damage);
        }
    }

    touchesPlayer(player) {
        return this.x < player.x + player.size &&
            this.x + this.size > player.x &&
            this.y < player.y + player.size * 2 &&
            this.y + this.size * 2 > player.y;
    }

    applyGravity() {
        // Apply gravity and handle vertical movement
        for (let i = 0; i < this.velocityY; i++) {
            if (!this.canMoveTo(this.x, this.y + this.size + 1)) {
                this.grounded = true;
                break;
            }
            this.y += 1;
        }

    }

    moveTowardsPlayer() {
        // Determine direction towards player and move
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (player) {
            const direction = player.x > this.x ? this.speed : -this.speed;
            if (this.canMoveTo(this.x + direction, this.y)) {
                if (this.canMoveTo(this.x + direction, this.y + this.size)) {
                    this.x += direction;
                } else {
                    this.jump();
                }
            } else {
                this.jump()
            }
        }
    }

    jump() {
        // Jump if on the ground
        if (this.grounded) {
            this.y -= this.jumpForce;
            this.grounded = false;
        }

    }

    canMoveTo(x, y) {
        let newX = x;
        let newY = y;
    
        let checkSizeX = false;
    
        // Moving to the right or down
        if (newX > this.x) {
            checkSizeX = true;
        }
    
        // Check the block in front of the mob at feet level
        let pixelX = checkSizeX ? newX + this.size : newX;
        let pixelY = newY + this.size; // Feet level
        if (this.isBlockSolid(pixelX, pixelY)) {
            return false;
        }
    
        // Check the block in front of the mob at head level
        pixelY = newY; // Head level
        if (checkSizeX && this.isBlockSolid(pixelX, pixelY)) {
            return false;
        }
    
        // Check for blocks above the mob's head only if moving upwards
        if (newY < this.y && !checkSizeX) {
            pixelY = newY - 1; // Block above the head
            if (this.isBlockSolid(pixelX, pixelY)) {
                return false;
            }
        }
    
        return true;
    }
    
    isBlockSolid(x, y) {
        return this.world.getBlock(x, y) && this.world.getBlock(x, y).getType() !== 'sky';
    }

    draw(ctx) {
        const frameWidth = 32; // Original frame width
        const frameHeight = 46; // Original frame height
        const sx = this.frameIndex * frameWidth;
        const scaledWidth = 16; // Scaled width
        const scaledHeight = 32; // Scaled height

        ctx.save(); // Save the current context state

        // Flip the image if the mob is to the left of the player
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (player && this.x < player.x) {
            ctx.scale(-1, 1); // Flip horizontally
            ctx.translate(-this.x * 2 - scaledWidth, 0); // Translate to correct position
        }

        ctx.drawImage(this.spriteSheet, sx, 0, frameWidth, frameHeight, this.x, this.y, scaledWidth, scaledHeight);

        ctx.restore(); // Restore the context to its original state

        // Draw the health bar
        this.drawHealthBar(ctx);
    }

    drawHealthBar(ctx) {
        const healthBarWidth = 16; // Width of the health bar
        const healthBarHeight = 5; // Height of the health bar
        const healthBarX = this.x + this.size / 2 - healthBarWidth / 2; // Centered above the mob
        const healthBarY = this.y - 10; // Positioned above the mob

        // Background of the health bar
        ctx.fillStyle = 'gray';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // Current health
        const currentHealthWidth = (this.health / 100) * healthBarWidth; // Assuming max health is 100
        ctx.fillStyle = 'green';
        ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    }


}
