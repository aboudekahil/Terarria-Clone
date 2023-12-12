/* The boss is the final event in the game. After the player has crafted stronger weapons. And possibly built
an arena they can craft the boss summon item. This will summon the final boss which will be the most difficult
part of the game. Killing the boss will inform the player that they won. */
class Boss extends Sprite {
    constructor(player, game) {
        super(false);
        this.player = player;
        this.game = game;
        this.world = game.world;
        this.size = 16 * 5; // 5 blocks, each 16 pixels
        this.x = player.x; // Initial x position
        this.y = player.y - 10 * world.getBlockSize(); // 10 blocks above the player
        this.maxHealth = 500;

        // Health and immunity properties
        this.health = this.maxHealth;
        this.damage = 50; // Damage dealt to the player

        this.immunityDuration = 15; // 0.25 seconds at 60 FPS
        this.immunityTimer = 0; // Timer to track immunity

        // Orbit properties
        this.orbitSpeed = 180; // Speed of the boss
        this.orbitDistance = 20 * world.getBlockSize();

        // Dash properties
        this.dashSpeed = 10; // Speed during dash
        this.dashCooldown = 5 * 60; // 5 seconds cooldown for dash, 60 FPS
        this.isDashing = false;
        this.initialX = 0;
        this.initialY = 0;
        this.dashDirectionX = 0;
        this.dashDirectionY = 0;
        this.dashTimer = 0;
        this.isDead = false;

        // Shooting properties
        this.shootCooldown = 60; // 1 second cooldown at 60 FPS
        this.shootTimer = 0; // Timer to track shooting

        // Load boss images
        this.bossImage = new Image();
        this.bossImage.src = 'images/boss.png'; // Regular boss image
        this.bossDashingImage = new Image();
        this.bossDashingImage.src = 'images/boss2.png'; // Dashing boss image

        // Initialize the BossHealthBar
        this.bossHealthBar = new BossHealthBar(this, game.getWidth(), game.getHeight());
        game.add(this.bossHealthBar); // Add the BossHealthBar to the game

        changeSoundtrack("boss-music");

    }

    update() {

        // Check for boss health
        if (this.isDead) {
            this.dropLoot();
            return; // Stop updating if the boss is dead
        }

        // Update logic for the boss
        if (this.isDashing) {
            this.dashTowardsPlayer();
        } else {
            this.orbitPlayer();
            this.dashTimer++;
            if (this.dashTimer >= this.dashCooldown) {
                this.initiateDash();
            }
        }

        // Check for collision with the player
        if (this.collidesWithPlayer()) {
            this.player.takeDamage(this.damage);
        }

        // Shooting logic
        this.shootTimer++;
        if (!this.dashing && this.shootTimer >= this.shootCooldown) {
            this.shootAtPlayer();
            this.shootTimer = 0; // Reset the shooting timer
        }

        // Decrease immunity timer if it's active
        if (this.immunityTimer > 0) {
            this.immunityTimer--;
        }

    }

    orbitPlayer() {
        // Time-based angle increment to ensure smooth orbiting
        const angleIncrement = (2 * Math.PI) / this.orbitSpeed;

        // Calculate the current angle based on the frame count
        this.orbitAngle = (this.orbitAngle || 0) + angleIncrement;

        // Calculate the new x and y position of the boss
        // Subtract half the size of the boss and player from the orbit distance
        const effectiveOrbitDistance = this.orbitDistance - this.size / 2 - this.player.size / 2;
        this.x = this.player.x + effectiveOrbitDistance * Math.cos(this.orbitAngle) - this.size / 2;
        this.y = this.player.y + effectiveOrbitDistance * Math.sin(this.orbitAngle) - this.size / 2;

        // Reset the angle to avoid overflow
        if (this.orbitAngle > 2 * Math.PI) {
            this.orbitAngle -= 2 * Math.PI;
        }
    }

    initiateDash() {
        // Set up dash parameters
        this.isDashing = true;

        // Save the boss's initial position
        this.initialX = this.x;
        this.initialY = this.y;

        // Calculate and save the dash direction
        let dx = this.player.x - this.x;
        let dy = this.player.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.dashDirectionX = dx / distance;
        this.dashDirectionY = dy / distance;

        this.dashTimer = 0;
    }

    dashTowardsPlayer() {
        // Dash in the saved direction
        this.x += this.dashDirectionX * this.dashSpeed;
        this.y += this.dashDirectionY * this.dashSpeed;

        // Check if the boss has covered enough distance to stop dashing
        let dx = this.x - this.initialX;
        let dy = this.y - this.initialY;
        let distanceTravelled = Math.sqrt(dx * dx + dy * dy);
        if (distanceTravelled > 30 * this.world.getBlockSize()) {
            this.isDashing = false;
            this.orbitAngle += Math.PI;
        }
    }

    collidesWithPlayer() {
        // Check for collision with the player
        return Math.abs(this.x - this.player.x) < this.size &&
            Math.abs(this.y - this.player.y) < this.size;
    }

    shootAtPlayer() {
        // Calculate the centers of the player and the boss
        const bossCenterX = this.x + this.size / 2;
        const bossCenterY = this.y + this.size / 2;
        const playerCenterX = this.player.x + this.player.size / 2;
        const playerCenterY = this.player.y + this.player.size;

        // Calculate the angle between the centers of the boss and the player
        const dx = playerCenterX - bossCenterX;
        const dy = playerCenterY - bossCenterY;
        const angle = Math.atan2(dy, dx);


        // Create a new pellet object at the boss's center and add it to the game
        const pellet = new Pellet(this.game, bossCenterX, bossCenterY, angle);
        this.game.add(pellet);
    }

    // Method to take damage with immunity check
    takeDamage(amount) {
        // Only take damage if not currently immune
        if (this.immunityTimer <= 0) {
            this.health -= amount;
            if (this.health <= 0) {
                this.isDead = true;
            }
            // Activate immunity timer after taking damage
            this.immunityTimer = this.immunityDuration;
        }
    }

    deleteBoss() {
        // Remove the BossHealthBar when the boss is deleted
        let index = this.game.sprites.indexOf(this.bossHealthBar);
        if (index > -1) {
            this.game.sprites.splice(index, 1);
        }

        // Remove the boss itself
        index = this.game.sprites.indexOf(this);
        if (index > -1) {
            this.game.sprites.splice(index, 1);
        }

        changeSoundtrack("nature");

    }

    dropLoot() {
        const player = this.game.sprites.find(sprite => sprite instanceof Player);
        if (player) {
            player.addToInventory('boss-meat');
        }
        this.deleteBoss();
    }

    draw(ctx) {
        // Choose the correct image based on whether the boss is dashing
        const currentImage = this.isDashing ? this.bossDashingImage : this.bossImage;

        // Calculate the angle towards the player
        const bossCenterX = this.x + this.size / 2;
        const bossCenterY = this.y + this.size / 2;
        const playerCenterX = this.player.x + this.player.size / 2;
        const playerCenterY = this.player.y + this.player.size / 2;
        const angle = Math.atan2(playerCenterY - bossCenterY, playerCenterX - bossCenterX) - Math.PI / 2;

        // Save the current context state
        ctx.save();

        // Translate to the boss's center
        ctx.translate(bossCenterX, bossCenterY);

        // Rotate the context
        ctx.rotate(angle);

        // Draw the image centered on the boss's position
        ctx.drawImage(currentImage, -this.size / 2, -this.size / 2, this.size, this.size*1.25);

        // Restore the context to its original state
        ctx.restore();
    }
}
