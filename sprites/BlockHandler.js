class BlockHandler {
    constructor(player) {
        this.player = player;
        this.world = player.world;
    }

    placeBlock(blockX, blockY, blockType) {
        // Check if the block can be placed at the specified location
        if (this.isPlaceable(blockX, blockY)) {
            const placedSuccessfully = this.world.placeBlock(blockX, blockY, blockType);
            if (placedSuccessfully) {
                // Reduce the item count in the inventory
                this.player.inventory.reduceItemCountByName(blockType);
            }
        }
    }

    isPlaceable(blockX, blockY) {
        // Check if the block is within range and the position is 'sky'
        const withinRange = this.isWithinRange(blockX, blockY);
        const isSky = this.world.getBlock(blockX, blockY).getType() === 'sky';
        const overlapsPlayer = this.checkOverlapWithPlayer(blockX, blockY);
        return withinRange && isSky && !overlapsPlayer;
    }

    // Helper method to check if a block position is within 3 blocks range of the player
    isWithinRange(blockX, blockY) {

        // Determine the direction of the block relative to the player
        const isRight = blockX > this.player.x;
        const isBelow = blockY > this.player.y;

        // Adjust distance calculation based on direction
        const adjustedX = isRight ? this.player.x + this.player.size : this.player.x;
        const adjustedY = isBelow ? this.player.y + this.player.size * 2 : this.player.y;

        // Calculate the distance from the player's position to the block
        const distanceX = Math.abs(blockX - adjustedX);
        const distanceY = Math.abs(blockY - adjustedY);

        return distanceX < 3 * blockSize && distanceY < 3 * blockSize;
    }

    // Helper method to check if a block position overlaps with the player
    checkOverlapWithPlayer(blockX, blockY) {

        let blockClicked = this.world.getBlockPosition(blockX, blockY);

        let playerEdges = [];

        playerEdges.push(this.world.getBlockPosition(this.player.x, this.player.y));
        playerEdges.push(this.world.getBlockPosition(this.player.x + this.player.size - 1, this.player.y));
        playerEdges.push(this.world.getBlockPosition(this.player.x, this.player.y + this.player.size));
        playerEdges.push(this.world.getBlockPosition(this.player.x + this.player.size - 1, this.player.y + this.player.size));


        for (let i = 0; i < playerEdges.length; i++) {
            if (playerEdges[i].x === blockClicked.x && playerEdges[i].y === blockClicked.y) {
                return true;
            }
        }
    }
}
