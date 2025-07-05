/**
 * Simple test for the optimizer
 */

import { describe, it, expect } from 'vitest';
import { optimize, type PartIn, type Sheet } from '../lib/optimizer';

describe('Simple Optimizer Test', () => {
  it('should work with basic input', () => {
    const parts: PartIn[] = [
      { id: 'part1', w: 100, h: 100 },
    ];

    const sheet: Sheet = { W: 2440, H: 1220 };
    
    console.log('Testing with parts:', parts);
    console.log('Testing with sheet:', sheet);
    
    const result = optimize(parts, sheet, 0);
    
    console.log('Result:', result);
    
    expect(result.sheets.length).toBeGreaterThan(0);
    if (result.sheets.length > 0) {
      expect(result.sheets[0].parts.length).toBeGreaterThan(0);
    }
  });
});
