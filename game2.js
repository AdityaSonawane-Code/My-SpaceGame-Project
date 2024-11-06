const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game settings
const playerWidth = 50;
const playerHeight = 50;
const bulletWidth = 5;
const bulletHeight = 10;
const enemyWidth = 50;
const enemyHeight = 50;
let playerSpeed = 5;
let bulletSpeed = 7;
let enemySpeed = 2;

// Load player and enemy images
const playerImage = new Image();
playerImage.src = "Player.png"; // Path to player image file

const enemyImage = new Image();
enemyImage.src = "Enemy.png"; // Path to enemy image file

let player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvas.height - playerHeight - 10,
  width: playerWidth,
  height: playerHeight,
  speed: playerSpeed
};

let bullets = [];
let enemies = [];
let gameInterval;
let bulletInterval;
let enemyInterval;

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

// Event listeners for on-screen control buttons
document.getElementById("leftButton").addEventListener("mousedown", () => {
  leftPressed = true;
});

document.getElementById("leftButton").addEventListener("mouseup", () => {
  leftPressed = false;
});

document.getElementById("rightButton").addEventListener("mousedown", () => {
  rightPressed = true;
});

document.getElementById("rightButton").addEventListener("mouseup", () => {
  rightPressed = false;
});

// Event listener for shoot button
document.getElementById("shootButton").addEventListener("click", () => {
  createBullet();  // Shoot a bullet when the shoot button is clicked
});

// Event listener for space button (to shoot)
document.addEventListener("keydown", (e) => {
  if (e.key === " ") spacePressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === " ") spacePressed = false;
});

// Bullet constructor
function createBullet() {
  bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y,
    width: bulletWidth,
    height: bulletHeight,
    speed: bulletSpeed
  });
}

// Enemy constructor
function createEnemy() {
  const enemyX = Math.random() * (canvas.width - enemyWidth);
  enemies.push({
    x: enemyX,
    y: -enemyHeight,
    width: enemyWidth,
    height: enemyHeight,
    speed: enemySpeed
  });
}

// Update player position
function updatePlayer() {
  if (rightPressed && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
  if (leftPressed && player.x > 0) {
    player.x -= player.speed;
  }
}

// Update bullets position
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Update enemies position
function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      i--;
    }
  }
}

// Check for collisions between bullets and enemies
function checkCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (
        bullets[i].x < enemies[j].x + enemies[j].width &&
        bullets[i].x + bullets[i].width > enemies[j].x &&
        bullets[i].y < enemies[j].y + enemies[j].height &&
        bullets[i].y + bullets[i].height > enemies[j].y
      ) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        i--;
        break;
      }
    }
  }
}

// Check if player collides with any enemy
function checkPlayerCollisions() {
  for (let i = 0; i < enemies.length; i++) {
    if (
      player.x < enemies[i].x + enemies[i].width &&
      player.x + player.width > enemies[i].x &&
      player.y < enemies[i].y + enemies[i].height &&
      player.y + player.height > enemies[i].y
    ) {
      return true; // Collision detected
    }
  }
  return false; // No collision
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player image
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

  // Draw bullets
  ctx.fillStyle = "#f00"; // Red color for bullets
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
  }

  // Draw enemy image
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
  }

  // Update game objects
  updatePlayer();
  updateBullets();
  updateEnemies();
  checkCollisions();

  // Check if player collided with an enemy
  if (checkPlayerCollisions()) {
    gameOver();
  }
}

// Handle game over scenario
function gameOver() {
  clearInterval(gameInterval);
  clearInterval(bulletInterval);
  clearInterval(enemyInterval);

  // Display game over message
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);

  // Ask the player if they want to restart or close the window
  const restart = confirm("Game Over! Do you want to play again?");
  if (restart) {
    resetGame(); // Restart the game
  } else {
    window.close(); // Close the window
  }
}

// Reset the game
function resetGame() {
  player.x = canvas.width / 2 - playerWidth / 2;
  player.y = canvas.height - playerHeight - 10;
  bullets = [];
  enemies = [];
  startGame();
}

// Start the game
function startGame() {
  gameInterval = setInterval(draw, 1000 / 60); // 60 FPS
  bulletInterval = setInterval(() => {
    if (spacePressed) createBullet();
  }, 100);

  enemyInterval = setInterval(createEnemy, 2000); // Spawn enemy every 2 seconds
}

startGame();
