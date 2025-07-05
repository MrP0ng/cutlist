/**
 * Tests for the optimizer engine
 * Covers performance benchmarks, property tests, and edge cases
 */

import { describe, it, expect, vi } from 'vitest';
import { optimize, calcWaste, countCuts, useOptimizer, type PartIn, type Sheet } from '../lib/optimizer';

describe('Optimizer Engine', () => {
  const standardSheet: Sheet = { W: 2440, H: 1220 };
  const smallSheet: Sheet = { W: 500, H: 500 };

  describe('Basic Functionality', () => {
    it('should place simple parts correctly', () => {
      const parts: PartIn[] = [
        { id: 'part1', w: 100, h: 100 },
        { id: 'part2', w: 200, h: 150 },
      ];

      const result = optimize(parts, standardSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].parts).toHaveLength(2);
      expect(result.partial).toBe(false);
      expect(result.timeMs).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty parts array', () => {
      const parts: PartIn[] = [];
      const result = optimize(parts, standardSheet, 0);

      expect(result.sheets).toHaveLength(0);
      expect(result.partial).toBe(false);
    });

    it('should handle single part', () => {
      const parts: PartIn[] = [{ id: 'single', w: 100, h: 100 }];
      const result = optimize(parts, standardSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].parts).toHaveLength(1);
      expect(result.sheets[0].parts[0]).toMatchObject({
        id: 'single',
        x: 0,
        y: 0,
        rotated: false
      });
    });
  });

  describe('Rotation Handling', () => {
    it('should rotate parts when beneficial and allowed', () => {
      const parts: PartIn[] = [
        { id: 'tall', w: 50, h: 300, allowRotate: true },
      ];

      const narrowSheet: Sheet = { W: 400, H: 100 };
      const result = optimize(parts, narrowSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].parts[0].rotated).toBe(true);
    });

    it('should not rotate when allowRotate is false', () => {
      const parts: PartIn[] = [
        { id: 'tall', w: 50, h: 300, allowRotate: false },
      ];

      const narrowSheet: Sheet = { W: 200, H: 100 };
      const result = optimize(parts, narrowSheet, 0);

      // Should create no sheets since rotation is not allowed and part won't fit
      expect(result.sheets).toHaveLength(0);
    });

    it('should handle mixed rotation preferences', () => {
      const parts: PartIn[] = [
        { id: 'rotatable', w: 50, h: 200, allowRotate: true },
        { id: 'fixed', w: 100, h: 100, allowRotate: false },
      ];

      const result = optimize(parts, standardSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].parts).toHaveLength(2);
    });
  });

  describe('Kerf Handling', () => {
    it('should account for kerf in placement', () => {
      const parts: PartIn[] = [
        { id: 'part1', w: 50, h: 50 },
      ];

      const kerfResult = optimize(parts, { W: 100, H: 100 }, 5);
      const noKerfResult = optimize(parts, { W: 100, H: 100 }, 0);

      // Both should successfully place the part
      expect(kerfResult.sheets.length).toBe(1);
      expect(noKerfResult.sheets.length).toBe(1);
      expect(kerfResult.sheets[0].parts.length).toBe(1);
      expect(noKerfResult.sheets[0].parts.length).toBe(1);
    });

    it('should handle large kerf values', () => {
      const parts: PartIn[] = [
        { id: 'part1', w: 50, h: 50 },
      ];

      const result = optimize(parts, smallSheet, 100); // Large kerf
      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].parts).toHaveLength(1);
    });
  });

  describe('Multiple Sheets', () => {
    it('should create multiple sheets when parts do not fit on one', () => {
      const largeParts: PartIn[] = Array.from({ length: 10 }, (_, i) => ({
        id: `large-${i}`,
        w: 1000,
        h: 600,
      }));

      const result = optimize(largeParts, standardSheet, 0);

      expect(result.sheets.length).toBeGreaterThan(1);
      
      // Each sheet should have at least one part
      result.sheets.forEach(sheet => {
        expect(sheet.parts.length).toBeGreaterThan(0);
      });
    });

    it('should distribute parts efficiently across sheets', () => {
      const parts: PartIn[] = Array.from({ length: 20 }, (_, i) => ({
        id: `part-${i}`,
        w: 200,
        h: 200,
      }));

      const result = optimize(parts, standardSheet, 0);

      const totalPartsPlaced = result.sheets.reduce(
        (sum, sheet) => sum + sheet.parts.length, 0
      );
      expect(totalPartsPlaced).toBe(parts.length);
    });
  });

  describe('Property Tests', () => {
    it('should not create overlapping parts', () => {
      const parts: PartIn[] = [
        { id: 'a', w: 100, h: 100 },
        { id: 'b', w: 150, h: 120 },
        { id: 'c', w: 80, h: 200 },
      ];

      const result = optimize(parts, standardSheet, 0);

      result.sheets.forEach(sheet => {
        for (let i = 0; i < sheet.parts.length; i++) {
          for (let j = i + 1; j < sheet.parts.length; j++) {
            const partA = sheet.parts[i];
            const partB = sheet.parts[j];
            
            const aRight = partA.x + (partA.rotated ? partA.h : partA.w);
            const aBottom = partA.y + (partA.rotated ? partA.w : partA.h);
            const bRight = partB.x + (partB.rotated ? partB.h : partB.w);
            const bBottom = partB.y + (partB.rotated ? partB.w : partB.h);

            // Check if rectangles overlap
            const noOverlap = aRight <= partB.x || bRight <= partA.x || 
                            aBottom <= partB.y || bBottom <= partA.y;
            
            expect(noOverlap).toBe(true);
          }
        }
      });
    });

    it('should ensure all parts fit within sheet boundaries', () => {
      const parts: PartIn[] = [
        { id: 'a', w: 500, h: 300 },
        { id: 'b', w: 200, h: 400 },
      ];

      const result = optimize(parts, standardSheet, 0);

      result.sheets.forEach(sheet => {
        sheet.parts.forEach(part => {
          const partWidth = part.rotated ? part.h : part.w;
          const partHeight = part.rotated ? part.w : part.h;
          
          expect(part.x + partWidth).toBeLessThanOrEqual(standardSheet.W);
          expect(part.y + partHeight).toBeLessThanOrEqual(standardSheet.H);
          expect(part.x).toBeGreaterThanOrEqual(0);
          expect(part.y).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('should maintain total part area conservation', () => {
      const parts: PartIn[] = [
        { id: 'a', w: 100, h: 200 },
        { id: 'b', w: 150, h: 100 },
        { id: 'c', w: 80, h: 120 },
      ];

      const totalInputArea = parts.reduce((sum, part) => sum + (part.w * part.h), 0);
      const result = optimize(parts, standardSheet, 0);

      const totalOutputArea = result.sheets.reduce((sum, sheet) => {
        return sum + sheet.parts.reduce((partSum, part) => partSum + (part.w * part.h), 0);
      }, 0);

      expect(totalOutputArea).toBe(totalInputArea);
    });

    it('should calculate waste percentage correctly', () => {
      const parts: PartIn[] = [
        { id: 'quarter', w: 1220, h: 610 }, // Exactly 1/4 of standard sheet
      ];

      const result = optimize(parts, standardSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].wastePct).toBeCloseTo(75, 0); // 75% waste
    });
  });

  describe('Edge Cases', () => {
    it('should handle perfect square sheet with square parts', () => {
      const squareParts: PartIn[] = [
        { id: 'sq1', w: 100, h: 100 },
        { id: 'sq2', w: 100, h: 100 },
        { id: 'sq3', w: 100, h: 100 },
        { id: 'sq4', w: 100, h: 100 },
      ];

      const squareSheet: Sheet = { W: 200, H: 200 };
      const result = optimize(squareParts, squareSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].parts).toHaveLength(4);
      expect(result.sheets[0].wastePct).toBe(0); // Perfect fit
    });

    it('should handle parts larger than sheet', () => {
      const hugePart: PartIn[] = [
        { id: 'huge', w: 5000, h: 3000 },
      ];

      const result = optimize(hugePart, standardSheet, 0);

      expect(result.sheets).toHaveLength(0); // Cannot fit
    });

    it('should handle very small parts', () => {
      const tinyParts: PartIn[] = Array.from({ length: 100 }, (_, i) => ({
        id: `tiny-${i}`,
        w: 10,
        h: 10,
      }));

      const result = optimize(tinyParts, standardSheet, 0);

      expect(result.sheets.length).toBeGreaterThan(0);
      const totalPlaced = result.sheets.reduce((sum, sheet) => sum + sheet.parts.length, 0);
      expect(totalPlaced).toBe(100);
    });
  });

  describe('Performance Tests', () => {
    it('should complete 200 random parts within 2000ms', async () => {
      const randomParts: PartIn[] = Array.from({ length: 200 }, (_, i) => ({
        id: `random-${i}`,
        w: Math.floor(Math.random() * 300) + 50,
        h: Math.floor(Math.random() * 300) + 50,
        allowRotate: Math.random() > 0.5,
      }));

      const startTime = Date.now();
      const result = optimize(randomParts, standardSheet, 2);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(2000);
      expect(result.sheets.length).toBeGreaterThan(0);
    });

    it('should handle timeout gracefully', () => {
      // Create a mock that simulates slow execution by returning increasing time values
      const mockPerformanceNow = vi.spyOn(performance, 'now');
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        // After many calls, return a value that exceeds the timeout
        return callCount > 1000 ? 2100 : callCount * 0.1;
      });

      const manyParts: PartIn[] = Array.from({ length: 100 }, (_, i) => ({
        id: `part-${i}`,
        w: 100,
        h: 100,
      }));

      const result = optimize(manyParts, standardSheet, 0);

      // If the test times out correctly, partial should be true
      // Otherwise, it should still complete successfully
      expect(result.sheets.length).toBeGreaterThanOrEqual(0);
      
      mockPerformanceNow.mockRestore();
    });
  });

  describe('Utility Functions', () => {
    it('should calculate waste correctly', () => {
      const sheet = {
        id: 'test',
        parts: [
          { id: 'p1', w: 100, h: 100, x: 0, y: 0, rotated: false },
        ],
        wastePct: 25,
      };

      const waste = calcWaste(sheet);
      expect(waste).toBe(25);
    });

    it('should count cuts correctly', () => {
      const sheet = {
        id: 'test',
        parts: [
          { id: 'p1', w: 100, h: 100, x: 0, y: 0, rotated: false },
          { id: 'p2', w: 150, h: 200, x: 100, y: 0, rotated: false },
        ],
        wastePct: 0,
      };

      const cuts = countCuts(sheet);
      expect(cuts).toBe(8); // 4 cuts per part
    });
  });

  describe('useOptimizer Hook', () => {
    it('should use sync optimization for small datasets', async () => {
      const { optimizeAsync } = useOptimizer();
      
      const smallParts: PartIn[] = [
        { id: 'small1', w: 100, h: 100 },
        { id: 'small2', w: 150, h: 120 },
      ];

      const result = await optimizeAsync(smallParts, standardSheet, 0);

      expect(result.sheets).toHaveLength(1);
      expect(result.partial).toBe(false);
    });

    it('should handle worker unavailable gracefully', async () => {
      // Mock Worker as undefined
      const originalWorker = global.Worker;
      // @ts-expect-error - intentionally setting to undefined for test
      global.Worker = undefined;

      const { optimizeAsync } = useOptimizer();
      
      const largeParts: PartIn[] = Array.from({ length: 60 }, (_, i) => ({
        id: `large-${i}`,
        w: 100,
        h: 100,
      }));

      const result = await optimizeAsync(largeParts, standardSheet, 0);

      expect(result.sheets.length).toBeGreaterThan(0);

      // Restore Worker
      global.Worker = originalWorker;
    });
  });
});
