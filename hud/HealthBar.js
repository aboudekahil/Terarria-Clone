class HealthBar extends Sprite {
    constructor(player, canvasWidth) {
        super(true);
        this.player = player;
        this.canvasWidth = canvasWidth;
        this.width = 200; // Health bar width
        this.height = 20; // Health bar height

        this.shieldIcon = new Image();
        this.shieldIcon.src = 'images/shield.png';

        this.cooldownSpriteSheet = new Image();
        this.cooldownSpriteSheet.src = 'images/health-timer.png';
    }

    draw(ctx) {
        const healthBarX = this.canvasWidth - this.width - 10; // 10 pixels from the right edge
        const healthBarY = 15; // 15 pixels from the top
        const currentHealthWidth = (this.player.health / this.player.maxHealth) * this.width;

        // Draw the background of the health bar
        ctx.fillStyle = 'gray';
        ctx.fillRect(healthBarX, healthBarY, this.width, this.height);

        // Draw the current health
        ctx.fillStyle = 'red';
        ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, this.height);

        // Draw the border of the health bar
        ctx.strokeStyle = 'black';
        ctx.strokeRect(healthBarX, healthBarY, this.width, this.height);

        // Draw the shield icon if armor is equipped
        if (this.player.isArmorEquipped) {
            const iconX = this.canvasWidth - this.width - 50; // Positioned to the left of the health bar
            const iconY = 10;
            ctx.drawImage(this.shieldIcon, iconX, iconY, 32, 32);
        }

        // Draw the cooldown timer
        if (this.player.mobMeatCooldown > 0) {
            this.drawCooldownTimer(ctx, healthBarX + this.width / 2, healthBarY + this.height + 10);
        }

    }

    drawCooldownTimer(ctx, x, y) {
        const frameSize = 32; // Size of each frame in the sprite sheet
        let frameIndex = Math.ceil(this.player.mobMeatCooldown / 30);
        frameIndex = Math.min(frameIndex, 9); // Clamp to max frame index

        // Calculate the sprite sheet coordinates
        const sx = (frameIndex - 1) % 3 * frameSize;
        const sy = Math.floor((frameIndex - 1) / 3) * frameSize;

        ctx.drawImage(this.cooldownSpriteSheet, sx, sy, frameSize, frameSize, x - frameSize / 2, y, frameSize, frameSize);
    }

    update() {

    }
}
