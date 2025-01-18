// Balloon Animation with Sound
const canvas = document.getElementById('balloonCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = 250;

const balloons = [];
let fishImages = []; // Array to hold image paths
let musicStarted = false; // Track if music has started

// List of fish balloon image paths
fishImages = [
  'image/ikan/balloon-fish1.png',
  'image/ikan/balloon-fish2.png',
  'image/ikan/balloon-fish3.png',
];

// Background Music
const backgroundMusic = new Audio('music/background-music.mp3');
backgroundMusic.loop = true; // Loop the background music

// Explosion Image
const explosionImage = new Image();
explosionImage.src = 'image/ikan/explosion.png';

// Class to handle Balloon with Image
class ImageBalloon {
  constructor(x, y, width, height, imagePath) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = Math.random() * 1.5 + 0.5;
    this.randomXSpeed = Math.random() * 0.5 - 0.25;
    this.isPopped = false; // To track if a balloon is touched and popped
    this.imagePath = imagePath;
    this.image = new Image();
    this.image.src = this.imagePath;
  }

  draw() {
    if (this.isPopped) {
      ctx.drawImage(explosionImage, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      return; // Don't draw balloon if popped
    }
    ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }

  update() {
    if (this.isPopped) return; // Don't update if the balloon is popped
    this.y -= this.speed;
    this.x += this.randomXSpeed;
    if (this.y < -this.height) this.y = canvas.height + this.height;
    if (this.x < -this.width) this.x = canvas.width + this.width;
    if (this.x > canvas.width + this.width) this.x = -this.width;
  }

  handleTouch(x, y) {
    if (this.isPopped) return false;
    const dx = this.x - x;
    const dy = this.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < Math.max(this.width, this.height)) {
      this.isPopped = true; // Mark the balloon as popped
      return true;
    }
    return false;
  }
}

function createFishBalloons() {
  for (let i = 0; i < 20; i++) {
    const width = Math.random() * 50 + 30;
    const height = Math.random() * 25 + 15;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    // Select a random fish image from the list
    const randomImagePath = fishImages[Math.floor(Math.random() * fishImages.length)];
    balloons.push(new ImageBalloon(x, y, width, height, randomImagePath));
  }
}

function animateBalloons() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balloons.forEach((balloon) => {
    if (!balloon.isPopped) {
      balloon.update();
      balloon.draw();
    }
  });
  requestAnimationFrame(animateBalloons);
}

createFishBalloons();
animateBalloons();

// Handle Touch Event
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  balloons.forEach((balloon) => {
    if (balloon.handleTouch(x, y)) {
      // Start music when the first balloon is popped
      if (!musicStarted) {
        backgroundMusic.play().catch((error) => {
          console.error('Music play failed:', error);
        });
        musicStarted = true;
      }
    }
  });
});