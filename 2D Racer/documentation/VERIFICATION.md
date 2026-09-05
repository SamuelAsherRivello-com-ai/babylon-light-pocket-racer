# 2D Racer verification

## Version 1.0.0

- Clean dependency installation: `npm ci` in `2D Racer/` passed.
- `npm test`: 13 tests passed, covering driving, grass, opponents, jumps, collisions, lap validation, timeout, retry, and audio.
- `npm run build`: TypeScript checks and static production build passed.
- Browser gameplay checks: a valid lap finished in 23.17 seconds with two jumps and two landings; natural timeout, retry from both result screens, braking, grass slowdown, mute, and portrait resize were verified in Edge with WebGPU.
- `screenshot01.png` shows the actual current game during a race.

The release workflow installs, tests and builds the project before deploying `2D Racer/dist` to GitHub Pages. Publishing a new GitHub Release or manually running the workflow deploys that ref. To recover from a future bad deployment, manually run the workflow against a known-good release tag without changing or deleting tags.

Babylon Lite requires WebGPU and provides no WebGL fallback. Unsupported devices receive an explanatory startup message. All game artwork and audio are generated locally.

## Portrait and redundant controls

- Centered 9:16 framing checked at 390x844, 320x568, 1280x720, and 844x390 browser viewports.
- Real browser touch events verified simultaneous gas and steering, partial release, and mixed keyboard/touch holds.
- Both games use independent input sources and clear held controls on cancellation, focus loss, and race completion.
- Touch checks use Edge browser emulation; physical Android/iOS hardware has not been tested.
