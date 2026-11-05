const LIFT_KEYS = ['Space', 'ArrowUp', 'KeyW'];
const RESTART_DELAY = .6;

function pressLift() {
  initAudio();
  holding = true;
}

function releaseLift() {
  holding = false;
}

addEventListener('keydown', e => {
  if (!LIFT_KEYS.includes(e.code)) return;
  e.preventDefault();
  if (e.repeat) return;
  if (gameState == 'play') pressLift();
  else if (gameState == 'over' && gameTime - deathTime > RESTART_DELAY) startGame();
});
addEventListener('keyup', e => {
  if (LIFT_KEYS.includes(e.code)) releaseLift();
});
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  pressLift();
});
addEventListener('pointerup', releaseLift);
addEventListener('pointercancel', releaseLift);
addEventListener('blur', releaseLift);
