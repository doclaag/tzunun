const FULL_TURN = 6.3;

const PALETTES = [
  ['#f3b07a', '#fde3b8', '#9d7a8c', '#6c6a7d', '#2f5245'],
  ['#7fb6d9', '#d8ecf2', '#8aa6b5', '#5e8174', '#2b5a43'],
  ['#5f9ccc', '#cfe6ef', '#7d98ad', '#4f7466', '#244f3b'],
  ['#6aa7d6', '#e3f0f2', '#86a2b8', '#55786a', '#27523d'],
  ['#e08a5b', '#f6cf8f', '#8f6a78', '#5b5368', '#2a4038'],
];
const STOPS_PER_PALETTE = 3;

const FOG_CYCLE = 9;
const FOG_CLEAR_UNTIL = 3.5;
const FOG_THICK_FROM = 4.5;
const FOG_FADE_FROM = 8;
const FOG_MAX_OPACITY = .94;
const FOG_OFFSET_X = 120;
const FOG_EDGE_WIDTH = 110;

const LOW_NECTAR_WARNING = 20;
const BANNER_SECONDS = 2.6;
const SIGN_POST_HEIGHT = 58;
const SIGN_OFFSET_X = 380;

function fillCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, FULL_TURN);
  ctx.fill();
}

function fillEllipse(x, y, radiusX, radiusY, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, FULL_TURN);
  ctx.fill();
}

function fillDome(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI, 0);
  ctx.fill();
}

function fillPolygon(...points) {
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
  ctx.fill();
}

function strokeLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

const skyPalette = () => PALETTES[Math.min(PALETTES.length - 1, (currentStop % STOP_COUNT) / STOPS_PER_PALETTE | 0)];

function drawRidge(parallax, base, amplitude, frequency, seed, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let sx = 0; sx <= viewWidth + 10; sx += 10) {
    const w = (cameraX * parallax + sx) * frequency;
    ctx.lineTo(sx, base - amplitude * (.55 * Math.sin(w + seed) + .3 * Math.sin(w * 2.3 + seed * 2) + .15 * Math.sin(w * 5.1 + seed * 3)));
  }
  ctx.lineTo(viewWidth + 10, viewHeight);
  ctx.fill();
}

function fillPine(x, base, height, width) {
  ctx.beginPath();
  ctx.moveTo(x, base - height);
  ctx.lineTo(x + width * .4, base - height * .55);
  ctx.lineTo(x + width * .22, base - height * .55);
  ctx.lineTo(x + width * .5, base - height * .12);
  ctx.lineTo(x - width * .5, base - height * .12);
  ctx.lineTo(x - width * .22, base - height * .55);
  ctx.lineTo(x - width * .4, base - height * .55);
  ctx.closePath();
  ctx.fill();
}

function drawForest(parallax, base, color) {
  ctx.fillStyle = color;
  const step = 40, offset = (cameraX * parallax) % step;
  for (let sx = -offset - step; sx < viewWidth + step; sx += step) {
    const i = Math.floor((cameraX * parallax + sx) / step), r = Math.abs((Math.sin(i * 12.9898) * 43758.5) % 1);
    fillPine(sx + r * 16, base, 30 + r * 36, 30);
  }
  ctx.fillRect(0, base - 4, viewWidth, viewHeight);
}

function drawHat(bandColor) {
  ctx.fillStyle = '#d9b26a';
  fillEllipse(0, -50, 11, 3);
  ctx.fillRect(-6, -58, 12, 8);
  ctx.fillStyle = bandColor;
  ctx.fillRect(-6, -53, 12, 3);
}

function drawHead(y) {
  ctx.fillStyle = '#b98a5f';
  fillCircle(0, y, 5);
}

function drawSolomaMan() {
  ctx.fillStyle = '#f4f1ea';
  ctx.fillRect(-6, -22, 5, 22);
  ctx.fillRect(1, -22, 5, 22);
  ctx.fillRect(-11, -40, 22, 19);
  ctx.fillStyle = '#1d1a19';
  fillPolygon(-12, -41, 12, -41, 14, -19, -14, -19);
  ctx.fillStyle = '#2b8f8a';
  ctx.fillRect(-14, -21, 28, 2);
  ctx.fillStyle = '#c8323c';
  ctx.fillRect(6, -22, 3, 14);
  drawHead(-46);
  ctx.fillStyle = '#c8323c';
  ctx.fillRect(-5, -50, 10, 3);
  drawHat('#c8323c');
}

function drawSolomaWoman() {
  ctx.fillStyle = '#c8323c';
  ctx.fillRect(-8, -20, 16, 20);
  ctx.fillStyle = '#fbf8f2';
  fillPolygon(-5, -42, 5, -42, 15, -18, -15, -18);
  ctx.strokeStyle = '#e8e0d0';
  ctx.lineWidth = 1;
  for (let i = -14; i <= 14; i += 3) strokeLine(i, -18, i, -14);
  ['#c8323c', '#f2b632', '#1f9e7a', '#2b6ca3', '#7b3fa0'].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(-7 + i * .4, -41 + i * 1.6, 14 - i * .8, 1.6);
  });
  ctx.fillStyle = '#e0b23a';
  ctx.fillRect(-4, -33, 8, 1.5);
  drawHead(-47);
  ctx.fillStyle = '#1d1612';
  fillDome(0, -49, 5.2);
  ctx.fillRect(3, -49, 3, 10);
}

function drawTodosSantosMan() {
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 ? '#f4f1ea' : '#c8323c';
    ctx.fillRect(-6 + i * 2.4, -22, 2.4, 22);
  }
  ctx.fillStyle = '#f4f1ea';
  ctx.fillRect(-10, -40, 20, 19);
  ctx.fillStyle = '#e7a6a6';
  for (let i = -9; i < 10; i += 3) ctx.fillRect(i, -38, 1, 16);
  ctx.fillStyle = '#5a3a8c';
  fillPolygon(-10, -41, 10, -41, 7, -32, -7, -32);
  ctx.fillStyle = '#2b6ca3';
  ctx.fillRect(-7, -35, 14, 2);
  drawHead(-46);
  drawHat('#2b6ca3');
}

function drawPerson(x, base, drawOutfit) {
  ctx.save();
  ctx.translate(x, base);
  ctx.scale(.62, .62);
  drawOutfit();
  ctx.restore();
}

function drawSheep(x, base, phase) {
  const bob = Math.sin(gameTime * 8 + phase);
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(x + 6, base - 8, 3, 8);
  ctx.fillRect(x + 22, base - 8, 3, 8);
  ctx.fillStyle = '#f3efe6';
  for (const [dx, dy, radius] of [[8, 14, 8], [17, 17, 9], [26, 14, 8], [13, 9, 6], [22, 9, 6]]) fillCircle(x + dx, base - dy + bob, radius);
  ctx.fillStyle = '#2a2420';
  fillEllipse(x, base - 17 + bob, 5, 4);
}

function drawLlama(x, base, phase) {
  const sway = Math.sin(gameTime * 6 + phase) * 1.5;
  ctx.fillStyle = '#d8c3a5';
  ctx.fillRect(x + 4, base - 12, 3, 12);
  ctx.fillRect(x + 20, base - 12, 3, 12);
  fillEllipse(x + 14, base - 17, 13, 7);
  ctx.fillRect(x + 1, base - 40 + sway, 6, 24);
  fillEllipse(x + 1, base - 41 + sway, 7, 4);
  ctx.fillRect(x + 2, base - 48 + sway, 2, 6);
  ctx.fillRect(x + 6, base - 48 + sway, 2, 6);
  ctx.fillStyle = '#c8323c';
  ctx.fillRect(x + 1, base - 30 + sway, 6, 2);
  ctx.fillStyle = '#1d1612';
  ctx.fillRect(x - 2, base - 42 + sway, 1.5, 1.5);
}

function drawHouses() {
  for (let i = 0; i < 5; i++) {
    const x = -130 + i * 48 + (i % 2) * 6, height = 24 + (i * 7) % 14;
    ctx.fillStyle = '#e9dcc4';
    ctx.fillRect(x, -height, 36, height);
    ctx.fillStyle = '#b5523b';
    fillPolygon(x - 4, -height, x + 18, -height - 13, x + 40, -height);
    ctx.fillStyle = '#6a4b3a';
    ctx.fillRect(x + 14, -12, 8, 12);
  }
}

function drawChurch() {
  ctx.fillStyle = '#f4ead6';
  ctx.fillRect(-22, -80, 44, 80);
  ctx.fillRect(-34, -50, 68, 50);
  ctx.fillStyle = '#c8323c';
  ctx.fillRect(-22, -86, 44, 6);
  ctx.fillStyle = '#6a4b3a';
  ctx.beginPath();
  ctx.arc(0, -22, 10, Math.PI, 0);
  ctx.lineTo(10, 0);
  ctx.lineTo(-10, 0);
  ctx.fill();
  ctx.fillRect(-1.5, -104, 3, 18);
  ctx.fillRect(-7, -98, 14, 3);
  ctx.fillStyle = '#c9a227';
  for (let i = -1; i <= 1; i++) fillDome(i * 12, -66, 4.5);
}

function drawMirador() {
  ctx.fillStyle = '#4a3a2e';
  ctx.fillRect(-70, -40, 140, 8);
  for (let i = -66; i <= 66; i += 12) ctx.fillRect(i, -62, 3, 22);
  ctx.fillRect(-70, -62, 140, 3);
  ctx.fillRect(-60, -32, 6, 32);
  ctx.fillRect(54, -32, 6, 32);
}

function drawLlamaPen() {
  ctx.strokeStyle = '#6a4b3a';
  ctx.lineWidth = 2;
  for (let i = -150; i <= 150; i += 30) strokeLine(i, 0, i, -22);
  ctx.beginPath();
  ctx.moveTo(-150, -16);
  ctx.lineTo(150, -16);
  ctx.moveTo(-150, -8);
  ctx.lineTo(150, -8);
  ctx.stroke();
  drawLlama(-110, 0, 0);
  drawLlama(-60, 0, 2);
  drawLlama(30, 0, 4);
  drawPerson(-10, 0, drawTodosSantosMan);
  drawPerson(90, 0, drawTodosSantosMan);
}

function drawFarm() {
  ctx.fillStyle = '#6b4a32';
  ctx.fillRect(-170, -14, 200, 14);
  ctx.fillStyle = '#4f8a3c';
  for (let i = -165; i < 25; i += 14) fillDome(i, -14, 6);
  ctx.fillStyle = '#c9a27a';
  ctx.fillRect(50, -40, 70, 40);
  ctx.fillStyle = '#8a5a3a';
  fillPolygon(44, -40, 85, -58, 126, -40);
  ctx.fillStyle = '#f3e3a6';
  fillCircle(68, -14, 7);
  fillCircle(84, -14, 7);
  ctx.fillStyle = '#4a3020';
  ctx.fillRect(98, -24, 12, 24);
  drawSheep(-60, -2, 0);
  drawSheep(-20, -2, 3);
  drawSheep(140, 0, 5);
}

function drawRocks() {
  ctx.scale(1.3, 1.3);
  ctx.fillStyle = '#4f5960';
  ctx.beginPath();
  ctx.moveTo(-70, 0);
  ctx.lineTo(-66, -150);
  ctx.quadraticCurveTo(-45, -178, -24, -150);
  ctx.lineTo(-20, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(6, -120);
  ctx.quadraticCurveTo(28, -140, 46, -118);
  ctx.lineTo(50, 0);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.15)';
  ctx.fillRect(-58, -140, 7, 110);
  ctx.fillRect(14, -110, 6, 80);
  ctx.fillStyle = '#5d7d4a';
  ctx.fillRect(-72, -6, 128, 6);
}

function drawFalls() {
  ctx.fillStyle = '#3d4f45';
  ctx.fillRect(-60, -150, 120, 150);
  ctx.fillStyle = '#dff3f7';
  ctx.fillRect(-14, -150, 28, 150);
  ctx.fillStyle = 'rgba(120,180,200,.6)';
  for (let i = 0; i < 6; i++) ctx.fillRect(-10 + (i * 7) % 20, -150 + ((gameTime * 160 + i * 26) % 150), 3, 16);
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  for (let i = 0; i < 5; i++) fillCircle((i - 2) * 12, -2, 8 + Math.sin(gameTime * 6 + i) * 2);
}

function drawRiver() {
  ctx.fillStyle = '#4f8fa6';
  fillEllipse(0, -4, 160, 10);
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const x = -110 + ((gameTime * 40 + i * 60) % 220);
    strokeLine(x, -5, x + 18, -5);
  }
}

function drawLake() {
  ctx.fillStyle = '#3f7c8f';
  fillEllipse(0, -6, 150, 16);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  fillEllipse(-30, -9, 40, 3);
  ctx.fillStyle = '#5a3d2a';
  ctx.fillRect(96, -58, 10, 52);
  ctx.fillStyle = '#2f6a46';
  ctx.beginPath();
  ctx.arc(101, -66, 26, 0, FULL_TURN);
  ctx.arc(84, -56, 16, 0, FULL_TURN);
  ctx.arc(118, -56, 16, 0, FULL_TURN);
  ctx.fill();
}

const LANDMARK_DRAWERS = {
  town: drawHouses,
  church() {
    drawHouses();
    drawChurch();
  },
  soloma() {
    drawHouses();
    drawChurch();
    drawPerson(-150, 0, drawSolomaMan);
    drawPerson(-128, 0, drawSolomaWoman);
    drawPerson(60, 0, drawSolomaWoman);
    drawPerson(84, 0, drawSolomaMan);
  },
  mirador: drawMirador,
  llamas: drawLlamaPen,
  farm: drawFarm,
  rocks: drawRocks,
  falls: drawFalls,
  river: drawRiver,
  lake: drawLake,
};

function drawLandmark(k, sx, base) {
  ctx.save();
  ctx.translate(sx, base);
  ctx.scale(1.2, 1.2);
  LANDMARK_DRAWERS[stopAt(k).landmark]();
  ctx.restore();
}

function drawBird(x, y, vy, wingPhase) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.max(-.4, Math.min(.45, vy / 900)));
  const flap = Math.sin(wingPhase) * .9;
  ctx.fillStyle = 'rgba(200,236,224,.55)';
  fillEllipse(-2, -4, 15, 5, -1.2 + flap);
  fillEllipse(-2, -4, 15, 5, -1.9 - flap);
  ctx.fillStyle = '#145c48';
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-22, -4);
  ctx.lineTo(-21, 5);
  ctx.closePath();
  ctx.fill();
  const bodyGradient = ctx.createLinearGradient(0, -8, 0, 8);
  bodyGradient.addColorStop(0, '#2bd09a');
  bodyGradient.addColorStop(1, '#137a5e');
  ctx.fillStyle = bodyGradient;
  fillEllipse(0, 0, 12, 7);
  ctx.fillStyle = '#e9f2e6';
  fillEllipse(2, 4, 7, 3);
  ctx.fillStyle = '#1fae84';
  fillCircle(10, -3, 6);
  ctx.fillStyle = '#e0263f';
  fillEllipse(11, 1.5, 4.2, 3, .3);
  ctx.fillStyle = '#111';
  fillCircle(12, -4.5, 1.4);
  ctx.fillStyle = '#fff';
  ctx.fillRect(12.3, -5.3, .8, .8);
  ctx.strokeStyle = '#1d1612';
  ctx.lineWidth = 1.6;
  strokeLine(15, -2.5, 28, -1);
  ctx.restore();
}

function drawFlower(f) {
  const sx = f.x - cameraX, y = f.y, zoom = f.amount > BIG_FLOWER_ABOVE ? 1.35 : 1;
  ctx.strokeStyle = '#3f7a45';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx, y + 6);
  ctx.quadraticCurveTo(sx - 6, y + 20, sx - 2, y + 34);
  ctx.stroke();
  ctx.fillStyle = f.color;
  for (let i = 0; i < 5; i++) {
    const angle = i / 5 * 6.28 + gameTime * .6;
    fillEllipse(sx + Math.cos(angle) * 6 * zoom, y + Math.sin(angle) * 6 * zoom, 5 * zoom, 3 * zoom, angle);
  }
  ctx.fillStyle = '#fff3b0';
  fillCircle(sx, y, 3 * zoom);
  if (f.remaining < f.amount) {
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sx, y, 15 * zoom, -1.57, -1.57 + 6.283 * f.remaining / f.amount);
    ctx.stroke();
  }
}

function drawStoneObstacle(o, sx) {
  const height = groundY - o.top;
  ctx.fillStyle = '#8b7f72';
  ctx.beginPath();
  ctx.moveTo(sx, groundY);
  ctx.lineTo(sx + 3, o.top + 14);
  ctx.quadraticCurveTo(sx + o.width / 2, o.top - 6, sx + o.width - 3, o.top + 10);
  ctx.lineTo(sx + o.width, groundY);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  ctx.fillRect(sx + 10, o.top + 16, 6, height * .6);
  ctx.fillStyle = '#5d7d4a';
  ctx.fillRect(sx + 2, o.top + 10, 10, 4);
}

function drawPineObstacle(o, sx) {
  const height = groundY - o.top;
  ctx.fillStyle = '#4a2f20';
  ctx.fillRect(sx + o.width / 2 - 4, groundY - height * .15, 8, height * .15);
  ctx.fillStyle = '#173d2c';
  fillPine(sx + o.width / 2, groundY, height, o.width);
  ctx.fillStyle = '#1d4d38';
  fillPine(sx + o.width / 2, groundY - height * .25, height * .75, o.width * .8);
}

function drawCloudObstacle(o, sx) {
  ctx.fillStyle = '#7f8a92';
  ctx.fillRect(sx, 0, o.width, o.bottom - 18);
  for (let i = 0; i < 4; i++) fillCircle(sx + 12 + i * 22, o.bottom - 18, 16 + (i % 2) * 4);
  ctx.fillStyle = 'rgba(170,205,230,.8)';
  for (let i = 0; i < 7; i++) {
    const rainY = o.bottom + ((gameTime * 220 + i * 37) % 70);
    ctx.fillRect(sx + 8 + i * 12, rainY - 6, 2, 9);
  }
}

function drawHawkObstacle(o, sx) {
  const y = o.y, wing = Math.sin(gameTime * 12 + o.phase) * 10;
  ctx.fillStyle = '#3b2c22';
  fillPolygon(sx, y, sx + 18, y - wing - 8, sx + 24, y, sx + 38, y - wing - 6, sx + 34, y + 6, sx + 6, y + 6);
  ctx.fillStyle = '#f2b632';
  ctx.fillRect(sx - 5, y + 1, 6, 3);
}

function drawObstacles() {
  for (const o of obstacles) {
    const sx = o.x - cameraX;
    if (sx > viewWidth + 120 || sx < -140) continue;
    if (o.type == 'stone') drawStoneObstacle(o, sx);
    else if (o.type == 'pine') drawPineObstacle(o, sx);
    else if (o.type == 'cloud') drawCloudObstacle(o, sx);
    else drawHawkObstacle(o, sx);
  }
}

function drawWind() {
  for (const o of obstacles) {
    if (o.type != 'wind') continue;
    const sx = o.x - cameraX;
    if (sx >= viewWidth || sx <= -o.width) continue;
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const y = 30 + ((i * 53 + (o.direction > 0 ? 1 : -1) * gameTime * 260) % (groundY - 60) + (groundY - 60)) % (groundY - 60), x = sx + (i * 37) % o.width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 12, y + o.direction * 6, x + 26, y + o.direction * 14);
      ctx.stroke();
    }
  }
}

function drawRoadSign(sx, text, color, subtext) {
  ctx.font = '700 11px system-ui,sans-serif';
  const width = Math.max(ctx.measureText(text).width, subtext ? ctx.measureText(subtext).width : 0) + 18, height = subtext ? 36 : 22;
  ctx.fillStyle = '#5b5b5b';
  ctx.fillRect(sx + 6, groundY - SIGN_POST_HEIGHT, 3, SIGN_POST_HEIGHT);
  ctx.fillRect(sx + width - 9, groundY - SIGN_POST_HEIGHT, 3, SIGN_POST_HEIGHT);
  ctx.fillStyle = color;
  ctx.fillRect(sx, groundY - SIGN_POST_HEIGHT - height, width, height);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sx + 2.5, groundY - 55.5 - height, width - 5, height - 5);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, sx + 9, groundY - SIGN_POST_HEIGHT - height + 15);
  if (subtext) {
    ctx.font = '10px system-ui,sans-serif';
    ctx.fillText(subtext, sx + 9, groundY - SIGN_POST_HEIGHT - height + 29);
  }
}

function drawFogSign(sx) {
  ctx.fillStyle = '#5b5b5b';
  ctx.fillRect(sx + 18, groundY - 46, 3, 46);
  ctx.save();
  ctx.translate(sx + 19.5, groundY - 62);
  ctx.rotate(.785);
  ctx.fillStyle = '#f2b632';
  ctx.fillRect(-14, -14, 28, 28);
  ctx.strokeStyle = '#1d1612';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-11, -11, 22, 22);
  ctx.restore();
  ctx.fillStyle = '#1d1612';
  ctx.font = '700 7px system-ui,sans-serif';
  ctx.fillText('NEBLINA', sx + 4, groundY - 60);
}

function drawSigns() {
  for (let k = Math.max(0, currentStop - 1); k <= currentStop + 1; k++) {
    const stop = stopAt(k), sx = stopStartX[k] + SIGN_OFFSET_X - cameraX;
    if (sx < -200 || sx > viewWidth + 40) continue;
    const isTown = ['town', 'soloma', 'church'].includes(stop.landmark);
    drawRoadSign(sx, isTown ? 'Bienvenidos a ' + stop.name : stop.name, isTown ? '#1f6b4a' : '#7a4a2a', KM_SIGNS[k % STOP_COUNT]);
    if (stop.fog) drawFogSign(sx + (ctx.measureText(stop.name).width + 80));
  }
}

function drawSky(palette) {
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, palette[0]);
  sky.addColorStop(1, palette[1]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, viewWidth, viewHeight);
  ctx.fillStyle = 'rgba(255,246,220,.75)';
  fillCircle(viewWidth * .78, groundY * .22, 24);
}

function drawGround() {
  ctx.fillStyle = '#5b3a29';
  ctx.fillRect(0, groundY, viewWidth, viewHeight - groundY);
  const tile = 26, offset = cameraX % tile;
  for (let sx = -offset; sx < viewWidth + tile; sx += tile) {
    const i = Math.floor((cameraX + sx) / tile);
    ctx.fillStyle = '#c8323c';
    ctx.fillRect(sx, groundY + 8, tile, 10);
    ctx.fillStyle = ['#f2b632', '#1f9e7a', '#2b6ca3'][((i % 3) + 3) % 3];
    fillPolygon(sx + 4, groundY + 18, sx + 13, groundY + 9, sx + 22, groundY + 18);
  }
  ctx.fillStyle = '#3f6b3a';
  ctx.fillRect(0, groundY, viewWidth, 4);
}

function drawFog() {
  if (gameState == 'menu' || !stopAt(currentStop).fog) return;
  const phase = fogTimer % FOG_CYCLE;
  const opacity = phase < FOG_CLEAR_UNTIL ? 0 : phase < FOG_THICK_FROM ? phase - FOG_CLEAR_UNTIL : phase < FOG_FADE_FROM ? 1 : FOG_CYCLE - phase;
  if (opacity <= 0) return;
  const startX = BIRD_SCREEN_X + FOG_OFFSET_X, gradient = ctx.createLinearGradient(startX, 0, startX + FOG_EDGE_WIDTH, 0);
  gradient.addColorStop(0, 'rgba(226,232,228,0)');
  gradient.addColorStop(1, 'rgba(226,232,228,' + (FOG_MAX_OPACITY * opacity) + ')');
  ctx.fillStyle = gradient;
  ctx.fillRect(startX, 0, viewWidth - startX, viewHeight);
}

function drawStopBanner(stopIndex, elapsed) {
  const stop = stopAt(stopIndex), alpha = Math.max(0, Math.min(1, elapsed * 5, (BANNER_SECONDS - elapsed) * 3)), isNew = banner.isNew;
  ctx.font = '700 17px "Rockwell","Roboto Slab",Georgia,serif';
  const textWidth = ctx.measureText(stop.name).width, width = Math.min(viewWidth - 32, textWidth + (isNew ? 130 : 40)), x = (viewWidth - width) / 2, y = 64 - (1 - alpha) * 10;
  ctx.globalAlpha = alpha * .9;
  ctx.fillStyle = '#f6ecd8';
  ctx.fillRect(x, y, width, 34);
  ctx.fillStyle = '#c8323c';
  ctx.fillRect(x, y, 4, 34);
  ctx.fillStyle = '#2a1d14';
  ctx.fillText(stop.name, x + 16, y + 23);
  if (isNew) {
    ctx.fillStyle = '#1f9e7a';
    ctx.fillRect(x + width - 104, y + 8, 94, 18);
    ctx.fillStyle = '#fff';
    ctx.font = '700 10px system-ui,sans-serif';
    ctx.fillText('POSTAL NUEVA', x + width - 96, y + 21);
  }
  ctx.globalAlpha = 1;
}

function drawGame() {
  ctx.setTransform(pixelRatio * viewScale, 0, 0, pixelRatio * viewScale, 0, 0);
  const palette = skyPalette();
  drawSky(palette);
  drawRidge(.08, groundY * .62, groundY * .2, .004, 1, palette[2]);
  drawRidge(.2, groundY * .78, groundY * .17, .006, 4, palette[3]);
  drawForest(.45, groundY * .98, palette[4]);
  for (let k = Math.max(0, currentStop - 1); k <= currentStop + 1; k++) {
    const sx = (stopStartX[k] - cameraX) * .5 + viewWidth * .62;
    if (sx > -320 && sx < viewWidth + 320) drawLandmark(k, sx, groundY);
  }
  drawGround();
  drawObstacles();
  drawSigns();
  drawWind();
  for (const a of animals) {
    const sx = a.x - cameraX;
    if (sx > -60 && sx < viewWidth + 60) a.type == 'sheep' ? drawSheep(sx, groundY, a.phase) : drawLlama(sx, groundY, a.phase);
  }
  for (const f of flowers) {
    if (!f.drained && f.x - cameraX > -20 && f.x - cameraX < viewWidth + 20) drawFlower(f);
  }
  if (gameState == 'play' || gameState == 'menu') drawBird(BIRD_SCREEN_X, bird.y, bird.vy, bird.wingPhase);
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  drawFog();
  if (gameState == 'play' && nectar < LOW_NECTAR_WARNING) {
    ctx.strokeStyle = 'rgba(224,38,63,' + ((LOW_NECTAR_WARNING - nectar) / LOW_NECTAR_WARNING * (.4 + .3 * Math.sin(gameTime * 10))) + ')';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, viewWidth, viewHeight);
  }
  if (gameState == 'play' && gameTime - banner.startTime < BANNER_SECONDS) drawStopBanner(banner.stopIndex, gameTime - banner.startTime);
}
