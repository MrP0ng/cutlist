"use client";
import { cn } from "@/lib/utils";

export type Part = {
  id: string;
  x: number; // mm
  y: number; // mm
  w: number; // mm
  h: number; // mm
  label: string;
};

interface SheetSvgProps {
  sheetW: number;      // mm
  sheetH: number;      // mm
  kerf: number;        // mm
  parts: Part[];
  className?: string;
}

export default function SheetSvg({
  sheetW,
  sheetH,
  kerf,
  parts,
  className,
}: SheetSvgProps) {
  /* ---------- visual scale factors ---------- */
  const PX_PER_MM = 3;                        // viewBox scale
  const VIEW_W = sheetW * PX_PER_MM;
  const VIEW_H = sheetH * PX_PER_MM;

  /** ~1/50 of the viewBox width ≈ 12 px on a 600 px-wide screen */
  const BASE_FONT = Math.max(VIEW_W / 50, 12);
  const PART_TITLE_FONT = BASE_FONT * 0.9;
  const PART_DIM_FONT = BASE_FONT * 0.8;

  /* ---------- colour palette ---------- */
  const PALETTE = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={cn("w-full h-auto border rounded bg-muted", className)}
      fontFamily="Inter, sans-serif"
    >
      {/* Sheet outline */}
      <rect
        width={VIEW_W}
        height={VIEW_H}
        className="fill-transparent stroke-border"
        strokeWidth={1}
      />

      {/* Overall sheet dimensions */}
      {/* Horizontal length (top-right) */}
      <text
        x={VIEW_W - BASE_FONT * 0.4}
        y={BASE_FONT * 1.2}
        fontSize={BASE_FONT}
        textAnchor="end"
      >
        {`${sheetW} mm`}
      </text>

      {/* Vertical width (right edge, rotated) */}
      <text
        x={VIEW_W - BASE_FONT * 0.4}
        y={VIEW_H - BASE_FONT * 0.4}
        fontSize={BASE_FONT}
        textAnchor="end"
        transform={`rotate(-90 ${VIEW_W - BASE_FONT * 0.4} ${
          VIEW_H - BASE_FONT * 0.4
        })`}
      >
        {`${sheetH} mm`}
      </text>

      {/* Parts */}
      {parts.map((p, i) => {
        const color = PALETTE[i % PALETTE.length];
        const x = p.x * PX_PER_MM;
        const y = p.y * PX_PER_MM;
        const w = p.w * PX_PER_MM - kerf * PX_PER_MM;
        const h = p.h * PX_PER_MM - kerf * PX_PER_MM;
        const cx = x + w / 2;
        const cy = y + h / 2;

        return (
          <g key={p.id}>
            {/* coloured rectangle */}
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="2"
              fill={color}
              fillOpacity={0.25}
              stroke={color}
              strokeWidth={1}
            />

            {/* centred two-line label */}
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
            >
              <tspan
                x={cx}
                dy={-PART_TITLE_FONT * 0.4}
                fontSize={PART_TITLE_FONT}
                fontWeight="600"
              >
                {p.label}
              </tspan>
              <tspan
                x={cx}
                dy={PART_TITLE_FONT * 0.9}
                fontSize={PART_DIM_FONT}
              >
                {`${p.w}×${p.h} mm`}
              </tspan>
            </text>

            <title>{`${p.label} – ${p.w} × ${p.h} mm`}</title>
          </g>
        );
      })}
    </svg>
  );
}
