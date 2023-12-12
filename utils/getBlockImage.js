function getSpriteForType(type) {
    let spriteX;
    let spriteY;
    switch (type) {
        case 'grass':
            spriteX = 0;
            spriteY = 0;
            break;
        case 'dirt':
            spriteX = 16;
            spriteY = 0;
            break;
        case 'stone':
            spriteX = 0;
            spriteY = 16;
            break;
        case 'sky':
            spriteX = 16;
            spriteY = 16;
            break;
        case 'iron':
            spriteX = 0;
            spriteY = 32;
            break;
        case 'diamond':
            spriteX = 16;
            spriteY = 32;
            break;
        default:
            throw new Error(`Unknown block type: ${type}`);
    }
    return { x: spriteX, y: spriteY, width: 16, height: 16 };
}