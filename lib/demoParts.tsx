// /lib/demoParts.ts
import { Part } from "@/components/SheetSvg";

// Part interface for SVG visualization (includes x, y for placement)
export interface SvgPart {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

// Part interface for workbench input (without x, y placement)
export interface WorkbenchPart {
  id: string;
  w: number;
  h: number;
  qty: number;
  label: string;
}

export const demoPartsSet1: SvgPart[] = [
  { id: "A", x: 0,   y: 0,   w: 600, h: 400, label: "Side A" },
  { id: "B", x: 600, y: 0,   w: 600, h: 400, label: "Side B" },
  { id: "C", x: 0,   y: 400, w: 1200,h: 300, label: "Shelf"  },
  { id: "D", x: 0,   y: 700, w: 500, h: 300, label: "Back"   },
];

export const demoPartsSet2: SvgPart[] = [
  { id: "E", x: 0,   y: 0,   w: 800, h: 300, label: "Top Panel" },
  { id: "F", x: 800, y: 0,   w: 800, h: 300, label: "Bottom Panel" },
  { id: "G", x: 1600, y: 0,  w: 800, h: 300, label: "Left Side" },
  { id: "H", x: 0,   y: 300, w: 400, h: 400, label: "Door" },
  { id: "I", x: 400, y: 300, w: 400, h: 400, label: "Drawer Front" },
  { id: "J", x: 800, y: 300, w: 600, h: 200, label: "Divider" },
  { id: "K", x: 1400, y: 300, w: 600, h: 200, label: "Support" },
  { id: "L", x: 2000, y: 300, w: 400, h: 400, label: "Right Side" },
  { id: "M", x: 800, y: 500, w: 300, h: 300, label: "Small Box" },
  { id: "N", x: 1100, y: 500, w: 300, h: 300, label: "Handle Block" },
];

export const demoPartsSet3: SvgPart[] = [
  { id: "P", x: 0,   y: 0,   w: 1200, h: 200, label: "Long Beam" },
  { id: "Q", x: 0,   y: 200, w: 400, h: 500, label: "Main Panel" },
  { id: "R", x: 400, y: 200, w: 400, h: 500, label: "Center Panel" },
  { id: "S", x: 800, y: 200, w: 400, h: 500, label: "End Panel" },
  { id: "T", x: 1200, y: 0,  w: 300, h: 300, label: "Corner A" },
  { id: "U", x: 1500, y: 0,  w: 300, h: 300, label: "Corner B" },
  { id: "V", x: 1800, y: 0,  w: 300, h: 300, label: "Corner C" },
  { id: "W", x: 2100, y: 0,  w: 300, h: 300, label: "Corner D" },
  { id: "X", x: 1200, y: 300, w: 600, h: 200, label: "Cross Brace" },
  { id: "Y", x: 1800, y: 300, w: 600, h: 200, label: "Support Beam" },
  { id: "Z", x: 1200, y: 500, w: 1200, h: 200, label: "Base Strip" },
];

// Workbench demo parts for the input table
export const demoWorkbenchParts: WorkbenchPart[] = [
  { id: "A", w: 600, h: 400, qty: 2, label: "Side Panels" },
  { id: "B", w: 1200, h: 300, qty: 1, label: "Shelf" },
  { id: "C", w: 500, h: 300, qty: 1, label: "Back Panel" },
  { id: "D", w: 400, h: 400, qty: 1, label: "Door" },
];

// Keep the original export for backward compatibility with SVG components
export const demoParts = demoPartsSet1;
