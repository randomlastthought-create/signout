"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Stroke, Tool } from "@/lib/types";

export const BASE_W = 1000;
export const BASE_H = 1150;

type Props = {
  savedStrokes: Stroke[];
  currentStrokes: Stroke[];
  setCurrentStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
  tool: Tool;
  color: string;
  size: number;
};

/* Marker-ink look: multiply blending sinks the ink into the fabric shading,
   a soft same-color shadow gives a slight bleed like a real marker. */
const inkProps = (s: Stroke) => ({
  points: s.points,
  stroke: s.color,
  strokeWidth: s.size,
  lineCap: "round" as const,
  lineJoin: "round" as const,
  tension: 0.35,
  opacity: 0.92,
  globalCompositeOperation: "multiply" as const,
  shadowColor: s.color,
  shadowBlur: s.size * 0.45,
  shadowOpacity: 0.28,
  perfectDrawEnabled: false,
  listening: false,
});

const SavedStrokes = memo(function SavedStrokes({ strokes }: { strokes: Stroke[] }) {
  return (
    <>
      {strokes.map((s, i) => (
        <Line key={i} {...inkProps(s)} />
      ))}
    </>
  );
});

export default function ShirtBoard({
  savedStrokes,
  currentStrokes,
  setCurrentStrokes,
  tool,
  color,
  size,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const savedLayerRef = useRef<Konva.Layer>(null);
  const liveLayerRef = useRef<Konva.Layer>(null);
  const drawingRef = useRef(false);
  const [width, setWidth] = useState(0);
  const [shirtImg, setShirtImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/shirt.svg";
    img.onload = () => setShirtImg(img);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Blend the ink layers' canvases with the shirt layer beneath them,
  // so strokes pick up the fabric's wrinkles and shading in real time.
  useEffect(() => {
    for (const ref of [savedLayerRef, liveLayerRef]) {
      const canvas = ref.current?.getCanvas()._canvas;
      if (canvas) canvas.style.mixBlendMode = "multiply";
    }
  }, [shirtImg, width]);

  const scale = width / BASE_W;

  const getPos = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const p = e.target.getStage()?.getPointerPosition();
    return p ? { x: p.x / scale, y: p.y / scale } : null;
  };

  const eraseAt = (pos: { x: number; y: number }) => {
    setCurrentStrokes((prev) =>
      prev.filter((s) => {
        const r = Math.max(16, s.size * 1.5);
        for (let i = 0; i < s.points.length; i += 2) {
          const dx = s.points[i] - pos.x;
          const dy = s.points[i + 1] - pos.y;
          if (dx * dx + dy * dy < r * r) return false;
        }
        return true;
      })
    );
  };

  const handleDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.evt.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    drawingRef.current = true;
    if (tool === "eraser") {
      eraseAt(pos);
    } else {
      setCurrentStrokes((prev) => [
        ...prev,
        { points: [pos.x, pos.y, pos.x + 0.01, pos.y + 0.01], color, size },
      ]);
    }
  };

  const handleMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!drawingRef.current) return;
    e.evt.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    if (tool === "eraser") {
      eraseAt(pos);
      return;
    }
    setCurrentStrokes((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      const n = last.points.length;
      const dx = pos.x - last.points[n - 2];
      const dy = pos.y - last.points[n - 1];
      if (dx * dx + dy * dy < 6) return prev;
      const updated = { ...last, points: [...last.points, pos.x, pos.y] };
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleUp = () => {
    drawingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ touchAction: "none", aspectRatio: `${BASE_W} / ${BASE_H}` }}
    >
      {width > 0 && (
        <Stage
          width={width}
          height={width * (BASE_H / BASE_W)}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
          style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
        >
          <Layer listening={false}>
            {shirtImg && (
              <KonvaImage image={shirtImg} width={BASE_W} height={BASE_H} />
            )}
          </Layer>
          <Layer ref={savedLayerRef} listening={false}>
            <SavedStrokes strokes={savedStrokes} />
          </Layer>
          <Layer ref={liveLayerRef} listening={false}>
            {currentStrokes.map((s, i) => (
              <Line key={i} {...inkProps(s)} />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
