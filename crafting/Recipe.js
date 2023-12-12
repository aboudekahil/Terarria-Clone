class Recipe {
    constructor(name, ingredients) {
        this.name = name;
        this.ingredients = ingredients; // Object where keys are item names and values are {count, iconUrl}
        this.craftedItemImage = new Image();
        this.craftedItemImage.src = `images/${name}.png`; // Path to the image of the crafted item
        this.width = 48;
        this.height = 48;
        this.ingredientImages = {};

        this.hasBeenCrafted = false; // track if the recipe has been crafted

        // Preload ingredient images
        for (const [name, count] of Object.entries(this.ingredients)) {
            const img = new Image();
            img.src = `images/${name}.png`;
            this.ingredientImages[name] = img;
        }
    }

    // Check if the player has enough ingredients to craft the item
    canCraft(inventory) {
        return Object.entries(this.ingredients).every(([name, count]) => {
            const itemInInventory = inventory.items.find(item => item && item.name === name);
            return itemInInventory && itemInInventory.count >= count;
        });
    }

    // Craft the item, removing the ingredients from the player's inventory
    craft(inventory) {

        if (this.hasBeenCrafted) {
            return false;
        }


        if (this.canCraft(inventory)) {
            Object.entries(this.ingredients).forEach(([name, count]) => {
                for (let i = 0; i < count; i++) {
                    inventory.removeItem(name);
                }
            });
            inventory.addItem(this.name); // Add the crafted item
            this.hasBeenCrafted = true; // Set the flag to true once crafted
            return true;
        }
        return false;

    }

    draw(ctx, x, y) {
        x += 10; // Offset x for padding

        // Draw the recipe background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(x, y, this.width, this.height);

        // Draw the image of the crafted item
        ctx.drawImage(this.craftedItemImage, x, y, this.width, this.height);

        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(this.name, x + this.width / 2 - ctx.measureText(this.name).width / 2, y + this.height + 15); // Draw the count below the image

        // Draw the images of the ingredients
        let ingredientX = x + this.width + 10; // Start drawing ingredients to the right of the crafted item, add some spacing
        for (const [name, count] of Object.entries(this.ingredients)) {
            
            const ingredientImage = this.ingredientImages[name];
            if (ingredientImage.complete) { // Check if the image is loaded
                ctx.drawImage(ingredientImage, ingredientX, y, this.width, this.height); // Draw the ingredient image
                ctx.fillStyle = 'black';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(`x${count}`, ingredientX + this.width / 2 - ctx.measureText(`x${count}`).width / 2, y + this.height + 15); // Draw the count below the image
                ingredientX += this.width + 10; // Move to the next ingredient position, add some spacing
            }
        }
    }
}
