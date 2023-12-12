/* This file is not permanant. Depending on the number of items in the game, a file will be created for each
one. A file for dirt, stone, wood.... Each file will be responsible for itself. Each file should handle how 
the Item is to be shown in the inventory. 

Note: Most inventory items will be drawn according to how they look like in the world for simplicity. But some
items aren't found in the world, such as Mob drops. For these items, creating a file is needed. */
class Item {
    constructor(name, iconUrl, count, isPlaceable) {
        this.name = name;
        this.icon = new Image();
        this.count = count;
        this.isPlaceable = isPlaceable;
        this.icon.src = iconUrl;
        this.iconLoaded = false;

        // Set the flag to true once the image is loaded
        this.icon.onload = () => {
            this.iconLoaded = true;
        };
    }

    draw(ctx, x, y, width, height) {
        if (this.iconLoaded) {
            // Center the image in the slot
            const iconSize = 32;
            const centerX = x + (width - iconSize) / 2;
            const centerY = y + (height - iconSize) / 2;

            ctx.drawImage(this.icon, centerX, centerY, iconSize, iconSize);
        } else {
            // Draw a placeholder or the item name if the image hasn't loaded
            ctx.fillStyle = '#FFF';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, x + width / 2, y + height / 2);
        }
    }
}

