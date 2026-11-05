const GRAVITY = 1150;
const LIFT = 1650;
const MAX_RISE_SPEED = 330;
const MAX_FALL_SPEED = 400;
const NO_NECTAR_LIFT = .25;
const WIND_FORCE = 1250;
const CEILING_MARGIN = 4;

const MAX_SPEED = 540;
const SPEED_PER_DISTANCE = .0058;
const SPEED_EASE = 3;
const SIP_BRAKE_EASE = 12;

const NECTAR_DRAIN = 7.5;
const NECTAR_DRAIN_HOLDING = 3.5;
const NECTAR_DRAIN_DISTANCE_MAX = 3;
const NECTAR_DRAIN_DISTANCE = 20000;
const STOP_NECTAR_BONUS = 20;
const WEAK_SOUND_INTERVAL = .5;

const SIP_MIN_DISTANCE = 4;
const SIP_MAX_DISTANCE = 38;
const SIP_MAX_HEIGHT_GAP = 18;
const SIP_RATE = 60;
const SIP_NECTAR_GAIN = 1.4;
const SIP_DRAG = 9;
const SIP_LIFT = 900;
const SIP_GRAVITY = 160;
const SIP_SOUND_INTERVAL = .18;

const HAWK_SPEED = 150;
const HAWK_CHASE_RANGE = 380;
const HAWK_CHASE_SPEED = 60;
const HAWK_HIT_RADIUS = 15;

const WING_SPEED_ACTIVE = 75;
const WING_SPEED_IDLE = 45;
const PARTICLE_GRAVITY = 420;
const DEATH_SCREEN_DELAY = 850;

const addParticle = (x, y, vx, vy, life, color, size) => particles.push({ x, y, vx, vy, life, color, size });

function updateParticles(dt) {
  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += PARTICLE_GRAVITY * dt;
    p.life -= dt;
  }
  particles = particles.filter(p => p.life > 0);
}

function killBird(reason) {
  if (gameState != 'play') return;
  gameState = 'dead';
  deathTime = gameTime;
  deathReason = reason;
  sfx.die();
  if (wingHum) wingHum.gainNode.gain.value = 0;
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * 6.28, speed = randomBetween(80, 300);
    addParticle(BIRD_SCREEN_X, bird.y, Math.cos(angle) * speed, Math.sin(angle) * speed - 80, 1.1, i % 3 ? '#1f9e7a' : '#c8323c', 4);
  }
  const meters = metersFlown();
  if (meters > bestMeters) {
    bestMeters = meters;
    saveValue('tz-best', bestMeters);
  }
  setTimeout(() => {
    gameState = 'over';
    showOverScreen(meters);
  }, DEATH_SCREEN_DELAY);
}

function hitPine(o, x, y) {
  if (y + BIRD_RADIUS < o.top) return false;
  const centerX = o.x + o.width / 2, halfWidth = 8 + (o.width / 2) * Math.min(1, (y - o.top) / (groundY - o.top) * 1.15);
  return Math.abs(x - centerX) < halfWidth + BIRD_RADIUS - 3;
}

function hitStone(o, x, y) {
  return x + BIRD_RADIUS > o.x + 3 && x - BIRD_RADIUS < o.x + o.width - 3 && y + BIRD_RADIUS > o.top + 4;
}

function hitCloud(o, x, y) {
  return x + BIRD_RADIUS > o.x + 6 && x - BIRD_RADIUS < o.x + o.width - 6 && y - BIRD_RADIUS < o.bottom - 6;
}

function updateScroll(dt) {
  targetSpeed = Math.min(BASE_SPEED + cameraX * SPEED_PER_DISTANCE, MAX_SPEED);
  scrollSpeed += ((sippingFlower ? 0 : targetSpeed) - scrollSpeed) * Math.min(1, dt * (sippingFlower ? SIP_BRAKE_EASE : SPEED_EASE));
  cameraX += scrollSpeed * dt;
  while (nextSpawnX < cameraX + viewWidth + 300) spawnObstacle();
  obstacles = obstacles.filter(o => o.x + o.width > cameraX - 200);
  flowers = flowers.filter(f => f.x > cameraX - 100);
  animals = animals.filter(a => a.x > cameraX - 100);
}

function checkStopReached() {
  const k = stopIndexAt(cameraX);
  if (k <= currentStop) return;
  currentStop = k;
  const stopNumber = k % STOP_COUNT, isNew = !albumStops.includes(stopNumber);
  banner = { stopIndex: k, startTime: gameTime, isNew };
  sfx.stop();
  nectar = Math.min(NECTAR_MAX, nectar + STOP_NECTAR_BONUS);
  if (isNew) {
    albumStops.push(stopNumber);
    saveValue('tz-alb', albumStops);
  }
  tripStops.push(stopNumber);
}

function updateFlight(dt, birdX) {
  if (sippingFlower) {
    bird.vy *= 1 - Math.min(1, dt * SIP_DRAG);
    if (holding) bird.vy -= SIP_LIFT * dt;
    else bird.vy += SIP_GRAVITY * dt;
  } else if (holding) {
    bird.vy -= LIFT * (nectar > 0 ? 1 : NO_NECTAR_LIFT) * dt;
    if (bird.vy < -MAX_RISE_SPEED) bird.vy = -MAX_RISE_SPEED;
  } else {
    bird.vy += GRAVITY * dt;
    if (bird.vy > MAX_FALL_SPEED) bird.vy = MAX_FALL_SPEED;
  }
  for (const o of obstacles) {
    if (o.type == 'wind' && birdX > o.x && birdX < o.x + o.width) bird.vy += o.direction * WIND_FORCE * dt;
  }
  bird.y += bird.vy * dt;
  if (bird.y < BIRD_RADIUS + CEILING_MARGIN) {
    bird.y = BIRD_RADIUS + CEILING_MARGIN;
    bird.vy = Math.max(0, bird.vy);
  }
  bird.wingPhase += dt * (holding || sippingFlower ? WING_SPEED_ACTIVE : WING_SPEED_IDLE);
}

function updateNectar(dt) {
  if (!sippingFlower) nectar -= dt * (NECTAR_DRAIN + (holding ? NECTAR_DRAIN_HOLDING : 0) + Math.min(NECTAR_DRAIN_DISTANCE_MAX, cameraX / NECTAR_DRAIN_DISTANCE));
  if (nectar <= 0) {
    nectar = 0;
    weakSoundTimer -= dt;
    if (weakSoundTimer <= 0) {
      weakSoundTimer = WEAK_SOUND_INTERVAL;
      sfx.weak();
    }
  }
}

function moveHawk(hawk, dt, birdX) {
  hawk.x -= HAWK_SPEED * dt;
  hawk.phase += dt;
  if (hawk.x - birdX < HAWK_CHASE_RANGE && hawk.x > birdX - 40) {
    hawk.y += Math.sign(bird.y - hawk.y) * Math.min(Math.abs(bird.y - hawk.y), HAWK_CHASE_SPEED * dt);
  }
}

function checkCollisions(dt, birdX) {
  for (const o of obstacles) {
    if (o.type == 'wind') continue;
    if (o.type == 'hawk') {
      moveHawk(o, dt, birdX);
      if (Math.hypot(o.x + 20 - birdX, o.y - bird.y) < BIRD_RADIUS + HAWK_HIT_RADIUS) {
        killBird(DEATH_TEXT.hawk);
        return true;
      }
    } else if (o.type == 'pine' ? hitPine(o, birdX, bird.y) : o.type == 'stone' ? hitStone(o, birdX, bird.y) : hitCloud(o, birdX, bird.y)) {
      killBird(DEATH_TEXT[o.type]);
      return true;
    }
  }
  return false;
}

function updateSipping(dt, birdX) {
  sippingFlower = null;
  for (const f of flowers) {
    if (f.drained) continue;
    const distance = f.x - birdX;
    if (distance > SIP_MIN_DISTANCE && distance < SIP_MAX_DISTANCE && Math.abs(f.y - bird.y) < SIP_MAX_HEIGHT_GAP) {
      sippingFlower = f;
      break;
    }
  }
  if (!sippingFlower) return;

  const f = sippingFlower, sip = Math.min(f.remaining, SIP_RATE * dt);
  f.remaining -= sip;
  nectar = Math.min(NECTAR_MAX, nectar + sip * SIP_NECTAR_GAIN);
  sipSoundTimer -= dt;
  if (sipSoundTimer <= 0) {
    sipSoundTimer = SIP_SOUND_INTERVAL;
    sfx.sip();
  }
  if (f.remaining <= 0) {
    f.drained = 1;
    sippingFlower = null;
    for (let i = 0; i < 8; i++) addParticle(f.x - cameraX, f.y, randomBetween(-90, 90), randomBetween(-150, 0), .6, f.color, 3);
  }
}

function updateGame(dt) {
  updateParticles(dt);
  if (gameState != 'play') return;
  updateScroll(dt);
  checkStopReached();
  const birdX = cameraX + BIRD_SCREEN_X;
  updateFlight(dt, birdX);
  updateNectar(dt);
  updateHum();
  if (bird.y + BIRD_RADIUS > groundY) {
    killBird(nectar <= 0 ? DEATH_TEXT.noNectar : DEATH_TEXT.ground);
    return;
  }
  if (checkCollisions(dt, birdX)) return;
  updateSipping(dt, birdX);
  fogTimer += dt;
  updateHud();
}
