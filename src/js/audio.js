const HUM_FREQUENCY_START = 92;
const HUM_FREQUENCY_SIP = 125;
const HUM_FREQUENCY_HOLD = 110;
const HUM_FREQUENCY_IDLE = 88;
const HUM_VOLUME_ACTIVE = 0.035;
const HUM_VOLUME_IDLE = 0.018;
const HUM_FILTER_FREQUENCY = 320;

let audioCtx, wingHum;

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator(), gainNode = audioCtx.createGain(), filter = audioCtx.createBiquadFilter();
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = HUM_FREQUENCY_START;
      filter.type = 'bandpass';
      filter.frequency.value = HUM_FILTER_FREQUENCY;
      gainNode.gain.value = 0;
      oscillator.connect(filter).connect(gainNode).connect(audioCtx.destination);
      oscillator.start();
      wingHum = { oscillator, gainNode };
    } catch (e) {}
  }
  if (audioCtx && audioCtx.state == 'suspended') audioCtx.resume();
}

function playTone(startFrequency, endFrequency, duration, waveType, volume, delay) {
  if (!audioCtx) return;
  const when = audioCtx.currentTime + (delay || 0), oscillator = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(startFrequency, when);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, when + duration);
  gainNode.gain.setValueAtTime(volume, when);
  gainNode.gain.exponentialRampToValueAtTime(.001, when + duration);
  oscillator.connect(gainNode).connect(audioCtx.destination);
  oscillator.start(when);
  oscillator.stop(when + duration + .03);
}

const sfx = {
  sip() {
    playTone(1400, 2400, .06, 'sine', .08);
    playTone(2000, 3000, .06, 'sine', .06, .06);
  },
  die() {
    playTone(900, 80, .6, 'sawtooth', .1);
    playTone(300, 50, .4, 'square', .07, .05);
  },
  weak() {
    playTone(300, 240, .12, 'triangle', .08);
  },
  stop() {
    [392, 494, 587, 784, 587, 784].forEach((frequency, i) => {
      playTone(frequency, frequency * .98, .22, 'triangle', .13, i * .09);
      playTone(frequency * 4, frequency * 4, .05, 'sine', .03, i * .09);
    });
  },
};

function updateHum() {
  if (!wingHum) return;
  wingHum.gainNode.gain.value = holding || sippingFlower ? HUM_VOLUME_ACTIVE : HUM_VOLUME_IDLE;
  wingHum.oscillator.frequency.value = sippingFlower ? HUM_FREQUENCY_SIP : holding ? HUM_FREQUENCY_HOLD : HUM_FREQUENCY_IDLE;
}
