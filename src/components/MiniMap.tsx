"use client";

import { useRef, useCallback } from "react";

const MAP_W = 200;
const MAP_H = 112;
// World pixels visible in the minimap (fixed scale — independent of main zoom)
const WORLD_WINDOW_W = 3200;
const MINI_SCALE = MAP_W / WORLD_WINDOW_W;

export interface MiniMapNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface MiniMapProps {
  nodes: MiniMapNode[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  canvasWidth: number;
  canvasHeight: number;
  onPanTo: (pan: { x: number; y: number }) => void;
}

export default function MiniMap({
  nodes,
  viewport,
  canvasWidth,
  canvasHeight,
  onPanTo,
}: MiniMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { zoom, pan } = viewport;

  // Center of what the user is currently seeing, in world space
  const centerX = -pan.x / zoom + canvasWidth / (2 * zoom);
  const centerY = -pan.y / zoom + canvasHeight / (2 * zoom);

  // World → minimap coords (centered on current viewport)
  const toMX = (wx: number) => (wx - centerX) * MINI_SCALE + MAP_W / 2;
  const toMY = (wy: number) => (wy - centerY) * MINI_SCALE + MAP_H / 2;

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const wx = (mx - MAP_W / 2) / MINI_SCALE + centerX;
      const wy = (my - MAP_H / 2) / MINI_SCALE + centerY;
      onPanTo({
        x: -(wx * zoom - canvasWidth / 2),
        y: -(wy * zoom - canvasHeight / 2),
      });
    },
    [centerX, centerY, zoom, canvasWidth, canvasHeight, onPanTo]
  );

  return (
    <div
      className="absolute bottom-[24px] right-[24px] z-10 rounded-[10px] bg-white shadow-[0px_4px_12px_rgba(16,24,40,0.08)] overflow-hidden"
      style={{ width: MAP_W, height: MAP_H, border: "3px solid white", outline: "1px solid #e8eaec" }}
    >
      <svg
        ref={svgRef}
        width={MAP_W}
        height={MAP_H}
        className="cursor-pointer block"
        onClick={handleClick}
      >
        <rect width={MAP_W} height={MAP_H} fill="#f0f2f4" />
        <pattern id="mm-dot" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="#c8cdd3" />
        </pattern>
        <rect width={MAP_W} height={MAP_H} fill="url(#mm-dot)" />

        {nodes.map((n) => {
          const mx = toMX(n.x);
          const my = toMY(n.y);
          const mw = Math.max(3, n.width * MINI_SCALE);
          const mh = Math.max(3, n.height * MINI_SCALE);
          // Skip nodes fully outside the minimap
          if (mx + mw < 0 || mx > MAP_W || my + mh < 0 || my > MAP_H) return null;
          return (
            <rect
              key={n.id}
              x={mx}
              y={my - mh / 2}
              width={mw}
              height={mh}
              rx={2}
              fill={n.color}
              opacity={0.9}
            />
          );
        })}
      </svg>
    </div>
  );
}
