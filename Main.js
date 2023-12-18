let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game = new Game(canvas.width, canvas.height);

let world = game.getWorld();

let center = Math.floor(world.getWidth() / 2);
let blockSize = world.getBlockSize();
let startHeight = 20*blockSize;

let inventory = new Inventory(game, canvas.width, canvas.height);
game.add(inventory);

let player = new Player(game, center, startHeight, inventory);
game.add(player);

let healthBar = new HealthBar(player, canvas.width);
game.add(healthBar);

let mobSpawner = new MobSpawner(game, player);
game.add(mobSpawner);

let craftingSpriteSheet = new Image();
craftingSpriteSheet.src = "images/crafting.png"

let crafting = new Crafting(game, inventory, canvas.width, canvas.height, craftingSpriteSheet);
game.add(crafting);

game.start();