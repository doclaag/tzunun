const CALM_ZONE_BEFORE = .4;
const CALM_ZONE_AFTER = 1.6;
const CALM_FLOWER_AT = .9;
const CALM_FLOWER_HEIGHT = .45;
const CALM_FLOWER_NECTAR = 40;

const DIFFICULTY_DISTANCE = 40000;
const WIND_FROM_STOP = 1;
const HAWK_FROM_STOP = 2;
const EXTRA_DANGER_FROM_STOP = 4;

const FLOWER_CHANCE = .75;
const BIG_FLOWER_CHANCE = .2;
const SMALL_FLOWER_NECTAR = 30;
const BIG_FLOWER_NECTAR = 55;
const BIG_FLOWER_ABOVE = 50;
const FLOWER_MARGIN = 36;
const ANIMAL_CHANCE = .8;

const randomBetween = (min, max) => min + Math.random() * (max - min);

function addFlower(x, y, amount) {
  flowers.push({ x, y, amount, remaining: amount, drained: 0, color: amount > BIG_FLOWER_ABOVE ? '#f2b632' : Math.random() < .5 ? '#e2365b' : '#f08ab0' });
}

function applyCalmZone() {
  const k = stopIndexAt(nextSpawnX), calmEnd = stopStartX[k] + targetSpeed * CALM_ZONE_AFTER;
  if (k > 0 && nextSpawnX < calmEnd && nextSpawnX > stopStartX[k] - targetSpeed * CALM_ZONE_BEFORE) {
    nextSpawnX = calmEnd;
    addFlower(stopStartX[k] + targetSpeed * CALM_FLOWER_AT, groundY * CALM_FLOWER_HEIGHT, CALM_FLOWER_NECTAR);
  }
}

function spawnObstacle() {
  applyCalmZone();
  const difficulty = Math.min(1, cameraX / DIFFICULTY_DISTANCE), k = stopIndexAt(nextSpawnX), landmark = stopAt(k).landmark;

  const pool = ['pine', 'pine', 'cloud'];
  if (k >= WIND_FROM_STOP) pool.push('wind');
  if (k >= HAWK_FROM_STOP) pool.push('hawk');
  if (k >= EXTRA_DANGER_FROM_STOP) pool.push('hawk', 'cloud', 'pine');
  const type = pool[Math.random() * pool.length | 0];

  let width = 50, flowerY = null;
  if (type == 'pine') {
    const height = randomBetween(groundY * .32, groundY * .7);
    obstacles.push({ type: landmark == 'rocks' ? 'stone' : type, x: nextSpawnX, width, top: groundY - height });
    flowerY = groundY - height - randomBetween(45, 95);
  } else if (type == 'cloud') {
    const bottom = randomBetween(groundY * .3, groundY * .6);
    width = 100;
    obstacles.push({ type, x: nextSpawnX, width, bottom });
    flowerY = bottom + randomBetween(45, 95);
  } else if (type == 'wind') {
    width = 170;
    obstacles.push({ type, x: nextSpawnX, width, direction: Math.random() < .5 ? -1 : 1 });
    flowerY = randomBetween(60, groundY - 60);
  } else {
    obstacles.push({ type, x: nextSpawnX + targetSpeed * .4, width: 40, y: randomBetween(60, groundY - 90), phase: Math.random() * 6 });
    width = 0;
  }

  if (flowerY !== null && Math.random() < FLOWER_CHANCE) {
    addFlower(nextSpawnX + width / 2, Math.max(FLOWER_MARGIN, Math.min(groundY - FLOWER_MARGIN, flowerY)), Math.random() < BIG_FLOWER_CHANCE ? BIG_FLOWER_NECTAR : SMALL_FLOWER_NECTAR);
  }
  if ((landmark == 'farm' || landmark == 'llamas') && Math.random() < ANIMAL_CHANCE) {
    animals.push({ type: landmark == 'farm' ? 'sheep' : 'llama', x: nextSpawnX + randomBetween(-60, 60), phase: Math.random() * 6 });
  }
  nextSpawnX += width + targetSpeed * randomBetween(.9 - .2 * difficulty, 1.45 - .35 * difficulty);
}
