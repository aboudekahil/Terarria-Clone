class MobSpawner extends Sprite {

    constructor(game, player) {
        super(false);
        this.game = game;
        this.player = player;

        this.frameCount = 1;
        this.spawnRate = 300;

    }

    update() {

        if (this.countAliveMobs() < 2 && this.frameCount % this.spawnRate == 0) {

            // Calculate spawn position (either left or right side, on top of a block)
            let xPosition;
            const yPosition = 150;
            const spawnLeft = Math.random() < 0.5;  // 50% chance to spawn on either side

            if (spawnLeft) {
                xPosition = this.player.x - 500/* Calculate position on the left */;
            } else {
                xPosition = this.player.x + 500/* Calculate position on the right */;
            }

            const newMob = new Mob(this.game, xPosition, yPosition);
            this.game.add(newMob);
        }

        this.frameCount++;

    }

    countAliveMobs() {
        return this.game.sprites.filter(sprite => sprite instanceof Mob && !sprite.isDead).length;
    }

    draw(ctx) {
        // Draw nothing
    }
 
}