/**
 * Web Worker for running the optimizer in a separate thread
 * This prevents blocking the main UI thread for large datasets
 */

import { optimize, type PartIn, type Sheet, type OptimizeResult } from '../lib/optimizer';

self.onmessage = function(e: MessageEvent<{ parts: PartIn[]; sheet: Sheet; kerf: number }>) {
  const { parts, sheet, kerf } = e.data;
  
  try {
    const result: OptimizeResult = optimize(parts, sheet, kerf);
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

export {};
