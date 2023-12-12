function displayDeathScreen(ctx, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';

    // Measure the text width
    const text = "You Died! Press 'R' to Respawn";
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    // Calculate the X position to center the text
    const x = (width - textWidth) / 2;

    // Calculate the Y position to center the text vertically
    // For simplicity, we approximate the text height as 1.2 times the font size (30px)
    const approximateTextHeight = 30 * 1.2;
    const y = (height + approximateTextHeight) / 2;

    ctx.fillText(text, x, y);
}
