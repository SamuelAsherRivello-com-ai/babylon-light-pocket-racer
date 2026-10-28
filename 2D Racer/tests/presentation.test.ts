import { test } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';
import { fitPresentationFrame } from '../src/presentation';

test('fullscreen presentation fills a 16:9 or 16:10 monitor', () => {
  for (const aspect of [16 / 9, 16 / 10]) {
    const frame = fitPresentationFrame(aspect * 800, 800);
    strictEqual(frame.width, aspect * 800);
    strictEqual(frame.height, 800);
  }
});

test('fullscreen presentation stays in the 16:9–16:10 range', () => {
  deepStrictEqual(fitPresentationFrame(2400, 900), { width: 1600, height: 900, aspect: 16 / 9 });
  deepStrictEqual(fitPresentationFrame(1200, 1200), { width: 1200, height: 750, aspect: 16 / 10 });
});
