/**
 * Client-side optimizer engine using FFD + Skyline algorithm
 * Handles optimal sheet layout for cutting optimization with kerf support
 */

export interface PartIn {
  id: string;
  w: number;
  h: number;
  label?: string;
  allowRotate?: boolean;
}

export interface PlacedPart extends PartIn {
  x: number;
  y: number;
  rotated: boolean;
}

export interface SheetOut {
  id: string;
  parts: PlacedPart[];
  wastePct: number;
}

export interface OptimizeResult {
  sheets: SheetOut[];
  timeMs: number;
  partial: boolean;
}

export interface Sheet {
  W: number;
  H: number;
}

interface SkylineNode {
  x: number;
  y: number;
  width: number;
}

class SkylineOptimizer {
  private sheet: Sheet;
  private kerf: number;
  private skyline: SkylineNode[];
  private usedRectangles: PlacedPart[];
  
  constructor(sheet: Sheet, kerf: number) {
    this.sheet = sheet;
    this.kerf = kerf;
    this.skyline = [{ x: 0, y: 0, width: sheet.W }];
    this.usedRectangles = [];
  }

  /**
   * Try to place a part on the current sheet
   */
  insert(part: PartIn): PlacedPart | null {
    const bestScore = { bestNode: { x: -1, y: -1 }, bestShortSideFit: Infinity, bestLongSideFit: Infinity, rotated: false };
    
    // Try both orientations if rotation is allowed
    const orientations = part.allowRotate ? 
      [{ w: part.w, h: part.h, rotated: false }, { w: part.h, h: part.w, rotated: true }] :
      [{ w: part.w, h: part.h, rotated: false }];

    for (const orientation of orientations) {
      // Add kerf to dimensions for placement calculation
      const w = orientation.w + this.kerf;
      const h = orientation.h + this.kerf;
      
      const position = this.findPositionForNewNodeBestShortSideFit(w, h);
      
      if (position.x !== -1) {
        const leftoverHoriz = this.sheet.W - (position.x + w);
        const leftoverVert = this.sheet.H - (position.y + h);
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert);
        const longSideFit = Math.max(leftoverHoriz, leftoverVert);

        if (shortSideFit < bestScore.bestShortSideFit || 
            (shortSideFit === bestScore.bestShortSideFit && longSideFit < bestScore.bestLongSideFit)) {
          bestScore.bestNode = position;
          bestScore.bestShortSideFit = shortSideFit;
          bestScore.bestLongSideFit = longSideFit;
          bestScore.rotated = orientation.rotated;
        }
      }
    }

    if (bestScore.bestNode.x === -1) {
      return null; // Couldn't fit
    }

    const finalW = bestScore.rotated ? part.h : part.w;
    const finalH = bestScore.rotated ? part.w : part.h;
    const finalWWithKerf = finalW + this.kerf;
    const finalHWithKerf = finalH + this.kerf;

    const placedPart: PlacedPart = {
      ...part,
      x: bestScore.bestNode.x,
      y: bestScore.bestNode.y,
      rotated: bestScore.rotated
    };

    this.addSkylineNode(bestScore.bestNode.x, bestScore.bestNode.y + finalHWithKerf, finalWWithKerf);
    this.usedRectangles.push(placedPart);

    return placedPart;
  }

  private findPositionForNewNodeBestShortSideFit(width: number, height: number): { x: number; y: number } {
    let bestNode = { x: -1, y: -1 };
    let bestShortSideFit = Infinity;
    let bestLongSideFit = Infinity;

    for (let i = 0; i < this.skyline.length; i++) {
      const y = this.fitRectangle(i, width, height);
      if (y !== -1) {
        const x = this.skyline[i].x;
        const leftoverHoriz = this.sheet.W - (x + width);
        const leftoverVert = this.sheet.H - (y + height);
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert);
        const longSideFit = Math.max(leftoverHoriz, leftoverVert);

        if (shortSideFit < bestShortSideFit || 
            (shortSideFit === bestShortSideFit && longSideFit < bestLongSideFit)) {
          bestNode = { x, y };
          bestShortSideFit = shortSideFit;
          bestLongSideFit = longSideFit;
        }
      }
    }

    return bestNode;
  }

  private fitRectangle(skylineNodeIndex: number, width: number, height: number): number {
    const x = this.skyline[skylineNodeIndex].x;
    if (x + width > this.sheet.W) {
      return -1;
    }

    let widthLeft = width;
    let i = skylineNodeIndex;
    let y = this.skyline[skylineNodeIndex].y;

    while (widthLeft > 0 && i < this.skyline.length) {
      y = Math.max(y, this.skyline[i].y);
      if (y + height > this.sheet.H) {
        return -1;
      }
      widthLeft -= this.skyline[i].width;
      i++;
    }

    return y;
  }

  private addSkylineNode(x: number, y: number, width: number): void {
    const newNode: SkylineNode = { x, y, width };
    
    // Find insertion point
    let insertIndex = 0;
    for (let i = 0; i < this.skyline.length; i++) {
      if (this.skyline[i].x < x) {
        insertIndex = i + 1;
      } else {
        break;
      }
    }

    this.skyline.splice(insertIndex, 0, newNode);

    // Merge overlapping nodes
    for (let i = insertIndex + 1; i < this.skyline.length; i++) {
      if (this.skyline[i].x < this.skyline[i - 1].x + this.skyline[i - 1].width) {
        const shrink = this.skyline[i - 1].x + this.skyline[i - 1].width - this.skyline[i].x;
        this.skyline[i].x += shrink;
        this.skyline[i].width -= shrink;
        if (this.skyline[i].width <= 0) {
          this.skyline.splice(i, 1);
          i--;
        }
      } else {
        break;
      }
    }

    // Merge nodes with same height
    for (let i = 0; i < this.skyline.length - 1; i++) {
      if (this.skyline[i].y === this.skyline[i + 1].y) {
        this.skyline[i].width += this.skyline[i + 1].width;
        this.skyline.splice(i + 1, 1);
        i--;
      }
    }
  }

  getUsedRectangles(): PlacedPart[] {
    return this.usedRectangles;
  }

  getOccupancy(): number {
    const totalSheetArea = this.sheet.W * this.sheet.H;
    const usedArea = this.usedRectangles.reduce((sum, rect) => {
      const w = rect.rotated ? rect.h : rect.w;
      const h = rect.rotated ? rect.w : rect.h;
      return sum + (w * h);
    }, 0);
    return (usedArea / totalSheetArea) * 100;
  }
}

/**
 * Main optimization function using FFD + Skyline algorithm
 */
export function optimize(parts: PartIn[], sheet: Sheet, kerf: number = 0): OptimizeResult {
  const startTime = performance.now();
  const maxTime = 1900; // Stop after 1900ms
  const sheets: SheetOut[] = [];
  
  // Step 1: Sort parts by max(side) descending (First Fit Decreasing)
  const sortedParts = [...parts].sort((a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h));
  
  const remainingParts = [...sortedParts];
  let sheetIndex = 0;
  let partial = false;

  while (remainingParts.length > 0) {
    // Check time limit
    if (performance.now() - startTime > maxTime) {
      partial = true;
      break;
    }

    const optimizer = new SkylineOptimizer(sheet, kerf);
    const placedParts: PlacedPart[] = [];
    
    // Try to place as many parts as possible on current sheet
    for (let i = remainingParts.length - 1; i >= 0; i--) {
      const part = remainingParts[i];
      
      // For kerf, we need to account for cutting space but only during placement calculation
      const placedPart = optimizer.insert(part);
      if (placedPart) {
        placedParts.push(placedPart);
        remainingParts.splice(i, 1);
      }
    }

    if (placedParts.length === 0) {
      // Couldn't place any parts, break to avoid infinite loop
      break;
    }

    const wastePct = 100 - optimizer.getOccupancy();
    sheets.push({
      id: `sheet-${sheetIndex + 1}`,
      parts: placedParts,
      wastePct
    });
    
    sheetIndex++;
  }

  const timeMs = performance.now() - startTime;
  
  return {
    sheets,
    timeMs,
    partial
  };
}

/**
 * Calculate waste percentage for a sheet
 */
export function calcWaste(sheet: SheetOut): number {
  return sheet.wastePct;
}

/**
 * Count total cuts needed for a sheet
 */
export function countCuts(sheet: SheetOut): number {
  // Each part requires 4 cuts (assuming rectangular cuts)
  // This is a simplified calculation - real optimization might consider shared cuts
  return sheet.parts.length * 4;
}

/**
 * Hook for using the optimizer with Web Worker for large datasets
 */
export function useOptimizer() {
  const optimizeAsync = async (parts: PartIn[], sheet: Sheet, kerf: number = 0): Promise<OptimizeResult> => {
    // If parts count is small, run synchronously
    if (parts.length <= 50) {
      return optimize(parts, sheet, kerf);
    }

    // For larger datasets, use Web Worker
    if (typeof Worker !== 'undefined') {
      return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('../workers/optimizer.worker.ts', import.meta.url));
        
        const timeout = setTimeout(() => {
          worker.terminate();
          reject(new Error('Optimizer timeout'));
        }, 5000);

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          resolve(e.data);
        };

        worker.onerror = (error) => {
          clearTimeout(timeout);
          worker.terminate();
          reject(error);
        };

        worker.postMessage({ parts, sheet, kerf });
      });
    }

    // Fallback to sync if Worker not available
    return optimize(parts, sheet, kerf);
  };

  return { optimizeAsync };
}
