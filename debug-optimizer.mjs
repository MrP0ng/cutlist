/**
 * Debug script to test the optimizer directly
 */

import { optimize } from './lib/optimizer.js';

const parts = [
  { id: 'part1', w: 100, h: 100 },
  { id: 'part2', w: 200, h: 150 },
];

const sheet = { W: 2440, H: 1220 };

console.log('Testing optimizer...');
const result = optimize(parts, sheet, 0);
console.log('Result:', JSON.stringify(result, null, 2));
