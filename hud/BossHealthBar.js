class BossHealthBar extends Sprite {
    constructor(boss, canvasWidth, canvasHeight) {
        super(true);
        this.boss = boss;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.width = canvasWidth * 0.2; // 20% of the screen width
        this.height = canvasHeight * 0.05; // 5% of the screen height
        this.x = (canvasWidth - this.width) / 2; // Centered horizontally
        this.y = 15; // 15 pixels from the top
    }

    draw(ctx) {
        // Draw the background of the health bar
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Calculate the width of the current health
        const currentHealthWidth = (this.boss.health / this.boss.maxHealth) * this.width;

        // Draw the current health
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x, this.y, currentHealthWidth, this.height);

        // Draw the border of the health bar
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // Nothing here
    }
}
