/* This is responsible for managing the invontory of the player. It will contain all the items that the player
has in their inventory. It will account for using items and collecting new ones. The inventory should also tell
how many items the player has. */
class Inventory extends Sprite {
    constructor(game, screenWidth, screenHeight) {
        super(true);
        // Dimensions based on screen size
        this.game = game;
        this.width = screenWidth * 0.5;
        this.height = screenHeight * 0.06;
        this.x = (screenWidth - this.width) / 2; // Centered horizontally
        this.y = screenHeight * 0.97 - this.height; // Positioned 3% above the bottom

        // Hotbar configuration
        this.slots = 10;
        this.slotWidth = this.width / this.slots;
        this.slotHeight = this.height;

        // Initialize the items array with null (empty slots) and add pickaxe and sword
        this.items = new Array(this.slots).fill(null);
        this.items[0] = new Item('pickaxe', 'images/pickaxe.png', 1, false);
        this.items[1] = new Item('sword', 'images/sword.png', 1, false); 
        // this.items[2] = new Item('diamond', 'images/diamond.png', 20, true); 
        // this.items[3] = new Item('iron', 'images/iron.png', 40, true);
        // this.items[4] = new Item('mob-meat', 'images/mob-meat.png', 20, false);
        // this.items[5] = new Item('stone', 'images/stone.png', 40, true);
        // this.items[6] = new Item('boss-meat', 'images/boss-meat.png', 20, false);

        // A property to track the selected slot
        this.selectedSlot = 0; // 0 the fist index, which is pickaxe
    }

    // A method to remove a specific item from the inventory
    removeItem(itemName) {
        const itemIndex = this.items.findIndex(item => item && item.name === itemName);
        if (itemIndex !== -1) {
            this.reduceItemCount(itemIndex);
        }
    }

    reduceItemCount(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.slots && this.items[slotIndex] && this.items[slotIndex].count > 0) {
            this.items[slotIndex].count--;

            // If the count reaches zero, shift items to the left
            if (this.items[slotIndex].count === 0) {
                // Shift all items after the current slot to the left
                for (let i = slotIndex; i < this.slots - 1; i++) {
                    this.items[i] = this.items[i + 1];
                }
                // Set the last slot to null as it's now empty or duplicated
                this.items[this.slots - 1] = null;
            }
        }
    }

    reduceItemCountByName(itemName) {
        const slotIndex = this.items.findIndex(slot => slot && slot.name === itemName);
        if (slotIndex !== -1) {
            this.reduceItemCount(slotIndex);
        }
    }


    addItem(itemName) {

        // Find the first empty slot or a slot with the same item
        const slotIndex = this.items.findIndex(slot => slot === null || (slot.name === itemName && slot.count < 999));

        let placeable = false;

        if (itemName == "dirt" || itemName == "stone" ||
         itemName == "iron" || itemName == "diamond") placeable = true;

        if (slotIndex >= 0 && slotIndex < this.slots) {
            if (this.items[slotIndex] === null) {

                // If the slot is empty, add a new item with count 1
                this.items[slotIndex] = new Item(itemName, `images/${itemName}.png`, 1, placeable);
            } else {
                // If the slot already has the same item, increase the count
                this.items[slotIndex].count++;
            }
        }
    }

    // A method to update the selected slot
    selectSlot(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.slots) {
            this.selectedSlot = slotIndex;
        }
    }

    draw(ctx) {
        ctx.save(); // Save current state
        // Draw the hotbar background
        ctx.fillStyle = 'rgba(51, 51, 51, 0.7)'; // Dark gray color with 50% opacity
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw the slots
        for (let i = 0; i < this.slots; i++) {
            ctx.strokeStyle = '#FFF'; // White color for the slot borders
            ctx.strokeRect(this.x + i * this.slotWidth, this.y, this.slotWidth, this.slotHeight);

            // Highlight the selected slot
            if (this.selectedSlot !== -1) {
                ctx.fillStyle = 'rgba(50, 50, 170, 0.2)'; // Semi-transparent white for highlight
                ctx.fillRect(this.x + this.selectedSlot * this.slotWidth, this.y, this.slotWidth, this.slotHeight);
            }

            // Draw slot numbers
            ctx.fillStyle = '#FFF'; // White color for the text
            ctx.font = 'bold 16px Arial'; // Adjust font size and style as needed
            ctx.textAlign = 'start';
            ctx.textBaseline = 'top';
            const number = i === 9 ? '0' : (i + 1).toString();
            ctx.fillText(number, this.x + i * this.slotWidth + 5, this.y + 5);
        }

        // Draw the items in their slots
        for (let i = 0; i < this.slots; i++) {
            if (this.items[i]) {
                const slotX = this.x + i * this.slotWidth;
                const slotY = this.y;
                this.items[i].draw(ctx, slotX, slotY, this.slotWidth, this.slotHeight);

                // Draw the count of the item
                if (this.items[i].count > 1) {
                    ctx.fillStyle = 'yellow'; // Color for the count text
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'end';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(this.items[i].count, slotX + this.slotWidth - 5, slotY + this.slotHeight - 5);
                }
            }
        }

        ctx.restore(); // Restore to the saved state
    }

    update() {
        this.selectedSlot = this.game.selectedSlot;
    }

}
