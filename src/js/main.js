const MAX_FRAME_SECONDS = .033;
const MENU_SCROLL_SPEED = 110;
const MENU_WING_SPEED = 60;
const MENU_BOB_HEIGHT = 10;

function startGame() {
  initAudio();
  resetGame();
  tripStops = [0];
  holding = false;
  gameState = 'play';
  ['menu', 'over', 'album'].forEach(id => $(id).hidden = true);
  $('hud').hidden = false;
  banner = { stopIndex: 0, startTime: gameTime };
  sfx.stop();
}

let lastFrameTime = performance.now();

function gameLoop(now) {
  const dt = Math.min(MAX_FRAME_SECONDS, (now - lastFrameTime) / 1000);
  lastFrameTime = now;
  gameTime += dt;
  if (gameState == 'menu') {
    cameraX += MENU_SCROLL_SPEED * dt;
    bird.wingPhase += dt * MENU_WING_SPEED;
    bird.y = groundY * BIRD_START_HEIGHT + Math.sin(gameTime * 2) * MENU_BOB_HEIGHT;
  }
  updateGame(dt);
  drawGame();
  requestAnimationFrame(gameLoop);
}

addEventListener('resize', resizeCanvas);
resizeCanvas();
resetGame();
setupScreens();
requestAnimationFrame(gameLoop);
