import './style.css';
import { createDrivingControls } from './driving-controls';
import { createRace, startRace, stepRace } from './simulation';
import { createWorld } from './world';
import { createUI } from './ui';
import { createAudio } from './audio';
import type { Input } from './types';
import { fitPresentationFrame } from './presentation';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const state = createRace();
const input: Input = { throttle: false, brake: false, left: false, right: false };
const audio = createAudio();
let ready = false;
const clearInput = () => controls.clear();
const begin = () => {
  if (!ready) return;
  clearInput();
  void audio.unlock().then(() => audio.update(state, ['start'], 0));
  startRace(state);
};
const ui = createUI(document.querySelector<HTMLElement>('#ui')!, {
  onStart: begin, onRetry: begin, onMute: (muted) => audio.setMuted(muted),
});
const gameShell = document.querySelector<HTMLElement>('.game-shell')!;
const fullscreenButton = document.querySelector<HTMLButtonElement>('.fullscreen-button')!;
const syncPresentation = () => {
  const fullscreen = Boolean(document.fullscreenElement);
  if (fullscreen) {
    const frame = fitPresentationFrame(window.innerWidth, window.innerHeight);
    gameShell.style.width = `${frame.width}px`;
    gameShell.style.height = `${frame.height}px`;
  } else {
    gameShell.style.removeProperty('width');
    gameShell.style.removeProperty('height');
  }
  fullscreenButton.textContent = fullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN';
  fullscreenButton.setAttribute('aria-label', fullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
};
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen().catch(() => undefined);
});
document.addEventListener('fullscreenchange', syncPresentation);
window.addEventListener('resize', syncPresentation);
syncPresentation();
ui.update(state);
const controls = createDrivingControls(document.querySelector<HTMLElement>('#ui')!, input);

async function boot() {
  try {
    const world = await createWorld(canvas);
    ready = true;
    window.addEventListener('resize', () => world.resize());
    let last = performance.now();
    let accumulated = 0;
    const frame = (now: number) => {
      const dt = document.hidden ? 0 : Math.min((now - last) / 1000, .1);
      last = now;
      accumulated += dt;
      const events: ReturnType<typeof stepRace> = [];
      while (accumulated >= 1 / 120) {
        events.push(...stepRace(state, input, 1 / 120));
        accumulated -= 1 / 120;
      }
      world.update(state, dt);
      audio.update(state, events, dt);
      ui.update(state);
      controls.setEnabled(state.phase === 'racing' || state.phase === 'countdown');
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    // Development-only inspection supports reproducible local gameplay verification.
    if (import.meta.env.DEV) Object.assign(window, { __rally: { state, input } });
  } catch (error) {
    console.error(error);
    ui.showError(`The racer could not start. Use a browser with WebGPU enabled. ${error instanceof Error ? error.message : String(error)}`);
  }
}
void boot();
