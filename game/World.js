class World {
    constructor(width, height) {
        this.width = width * 6;
        this.height = height * 3;
        this.blockSize = 16;
        this.spritesheet = new Image();
        this.spritesheet.src = 'images/blocks-sheet.png';
        this.noise = 7;

        this.columns = Math.floor(this.width / this.blockSize);
        this.rows = Math.floor(this.height / this.blockSize);
        this.worldArray = this.generateWorld();
        this.generateOres();
    }

    getBlockSize() {
        return this.blockSize;
    }

    getBlock(x, y) {
        // Convert from pixels to blocks
        let blockX = Math.floor(x / this.blockSize);
        let blockY = Math.floor(y / this.blockSize);
    
        // Check if the block coordinates are within the world boundaries
        if (blockX >= 0 && blockX < this.columns && blockY >= 0 && blockY < this.rows) {
            return this.worldArray[blockX][blockY];
        }
    
        // If the coordinates are outside the world, return null
        return null;
    }
    

    getBlockPosition(x, y) {
        // Convert from pixels to blocks
        let blockX = Math.floor(x / this.blockSize);
        let blockY = Math.floor(y / this.blockSize);
        return { x: blockX, y: blockY };
    }

    placeBlock(x, y, type) {
        let blockX = Math.floor(x / this.blockSize);
        let blockY = Math.floor(y / this.blockSize);

        if (x >= 0 && x < this.width && y >= 0 && y < this.height && this.worldArray[blockX][blockY].getType() === 'sky') {
            // Check for neighboring blocks
            if (this.hasNeighboringSolidBlock(blockX, blockY)) {
                this.worldArray[blockX][blockY].setType(type);
                return true;
            }
        }
        return false;
    }

    // Check for solid (non-sky) blocks around the given coordinates
    hasNeighboringSolidBlock(x, y) {
        // Check above, below, left, and right for non-sky blocks
        return (this.isSolidBlock(x, y - 1) || // Above
            this.isSolidBlock(x, y + 1) || // Below
            this.isSolidBlock(x - 1, y) || // Left
            this.isSolidBlock(x + 1, y));   // Right
    }

    // Helper function to check if a block is solid (not 'sky' and within bounds)
    isSolidBlock(x, y) {
        if (x >= 0 && x < this.columns && y >= 0 && y < this.rows) {
            return this.worldArray[x][y].getType() !== 'sky';
        }
        return false;
    }

    removeBlock(x, y) {
        let blockX = Math.floor(x / this.blockSize);
        let blockY = Math.floor(y / this.blockSize);
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const removedBlockType = this.worldArray[blockX][blockY].getType();
            this.worldArray[blockX][blockY].setType("sky");
            if (removedBlockType === "grass") {
                return "dirt";
            }
            return removedBlockType;
        }
        return null;
    }

    getWidth() {
        return this.width;
    }

    generateWorld() {
        let worldArray = new Array(this.columns);
        let skyHeight = 45; // Set this to the desired sky height
        let terrainHeight = skyHeight
        let previousStep = 0;

        for (let x = 0; x < this.columns; x++) {
            worldArray[x] = new Array(this.rows);

            // Random walk: the next height is a small step from the previous height
            let nextStep;
            if (previousStep !== 0) {
                // If the previous step was non-zero, make zero more likely for smoothness
                nextStep = Math.random() < 0.8 ? 0 : (Math.random() < 0.5 ? -1 : 1);
            } else {
                nextStep = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            }
            previousStep = nextStep;

            // Check if the randomness has taken us too high or too low from the sky
            if (terrainHeight + nextStep > skyHeight + this.noise) {
                nextStep = -1;
            } else if (terrainHeight + nextStep < skyHeight - this.noise) {
                nextStep = 1;
            }

            terrainHeight += nextStep;

            for (let y = 0; y < this.rows; y++) {
                if (y < terrainHeight) {
                    worldArray[x][y] = this.setBlock(x, y, 'sky');
                } else if (y === terrainHeight) {
                    worldArray[x][y] = this.setBlock(x, y, 'grass');
                } else if (y < terrainHeight + 10 + Math.random() * 5) {
                    worldArray[x][y] = this.setBlock(x, y, 'dirt');
                } else {
                    worldArray[x][y] = this.setBlock(x, y, 'stone');
                }
            }
        }

        return worldArray;
    }

    generateOres() {
        // Add ore generation after the world structure is generated
        this.generateOreVeins('iron', 8, 15); // Iron ore veins, 8-15 blocks
        this.generateOreVeins('diamond', 4, 6); // Diamond ore veins, 4-6 blocks
    }

    generateOreVeins(oreType, minVeinSize, maxVeinSize) {
        let veinCount = this.getVeinCount(oreType);
        for (let i = 0; i < veinCount; i++) {
            let veinSize = Math.floor(Math.random() * (maxVeinSize - minVeinSize + 1)) + minVeinSize;
            let startX = Math.floor(Math.random() * this.columns);
            let startY = this.getStartingDepth(oreType);

            for (let j = 0; j < veinSize; j++) {
                let direction = Math.floor(Math.random() * 4); // 0: up, 1: right, 2: down, 3: left
                switch (direction) {
                    case 0: startY = Math.max(0, startY - 1); break;
                    case 1: startX = Math.min(this.columns - 1, startX + 1); break;
                    case 2: startY = Math.min(this.rows - 1, startY + 1); break;
                    case 3: startX = Math.max(0, startX - 1); break;
                }

                if (this.worldArray[startX][startY].getType() === 'stone') {
                    this.worldArray[startX][startY] = this.setBlock(startX, startY, oreType);
                }
            }
        }
    }


    getVeinCount(oreType) {
        // Define how many veins of each ore type should be generated
        if (oreType === 'iron') return 20;
        if (oreType === 'diamond') return 10;
        return 0;
    }

    getStartingDepth(oreType) {
        // Define the starting depth for each ore type
        if (oreType === 'iron') return Math.floor(this.rows / 2); // Mid-depth for iron
        if (oreType === 'diamond') return Math.floor(this.rows * 0.75); // Deeper for diamond
        return 0;
    }

    setBlock(x, y, type) {
        return new Block(x * this.blockSize, y * this.blockSize, type, this.blockSize, this.spritesheet);
    }

    draw(ctx) {
        for (let x = 0; x < this.columns; x++) {
            for (let y = 0; y < this.rows; y++) {
                let block = this.worldArray[x][y];
                if (block) {
                    block.draw(ctx);
                }
            }
        }
    }
}