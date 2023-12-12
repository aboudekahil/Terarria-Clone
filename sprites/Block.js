class Block extends Sprite {
    constructor(x, y, type, blockSize, spritesheet) {
        super(false);
        this.type = type;
        this.spritesheet = spritesheet;
        this.sprite = getSpriteForType(type);
        this.x = x;
        this.y = y;
        this.blockSize = blockSize;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
        this.sprite = getSpriteForType(type);
    }

    draw(ctx) {
        // Draw the sprite at the given x and y coordinates.
        ctx.drawImage(this.spritesheet, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.x, this.y, this.blockSize, this.blockSize);
    }

    update() {

    }
}