const BIRD_SCREEN_X = 120;
const BIRD_RADIUS = 10;
const BIRD_START_HEIGHT = 0.45;
const BASE_SPEED = 230;
const NECTAR_MAX = 100;
const FIRST_SPAWN_X = 650;
const PIXELS_PER_METER = 10;

const VIEW_MIN_HEIGHT = 400;
const VIEW_MIN_WIDTH = 440;
const GROUND_MIN_HEIGHT = 54;
const GROUND_HEIGHT_RATIO = 0.14;
const MAX_PIXEL_RATIO = 2;

const $ = id => document.getElementById(id);
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');

let pixelRatio, viewScale, viewWidth, viewHeight, groundY;

function resizeCanvas() {
  pixelRatio = Math.min(devicePixelRatio || 1, MAX_PIXEL_RATIO);
  canvas.width = innerWidth * pixelRatio | 0;
  canvas.height = innerHeight * pixelRatio | 0;
  viewScale = Math.min(innerHeight / VIEW_MIN_HEIGHT, innerWidth / VIEW_MIN_WIDTH);
  viewWidth = innerWidth / viewScale;
  viewHeight = innerHeight / viewScale;
  groundY = viewHeight - Math.max(GROUND_MIN_HEIGHT, viewHeight * GROUND_HEIGHT_RATIO);
}

const loadSaved = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value == null ? fallback : JSON.parse(value);
  } catch (e) {
    return fallback;
  }
};
const saveValue = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

let bestMeters = loadSaved('tz-best', 0);
let albumStops = loadSaved('tz-alb', [0]);

let gameState = 'menu';
let gameTime = 0;
let deathTime = 0;
let deathReason;
let holding = false;
let tripStops = [];
let sippingFlower = null;
let sipSoundTimer = 0;
let scrollSpeed = 0;
let cameraX, targetSpeed, obstacles, flowers, particles, animals, nextSpawnX, currentStop, banner, bird, nectar, fogTimer, weakSoundTimer;

function resetGame() {
  cameraX = 0;
  targetSpeed = BASE_SPEED;
  scrollSpeed = BASE_SPEED;
  sippingFlower = null;
  obstacles = [];
  flowers = [];
  particles = [];
  animals = [];
  nextSpawnX = FIRST_SPAWN_X;
  currentStop = 0;
  banner = { stopIndex: 0, startTime: 0 };
  nectar = NECTAR_MAX;
  fogTimer = 0;
  weakSoundTimer = 0;
  bird = { y: groundY * BIRD_START_HEIGHT, vy: 0, wingPhase: 0 };
}

const metersFlown = () => Math.round(cameraX / PIXELS_PER_METER);
const formatNumber = n => n.toLocaleString('es-GT');
