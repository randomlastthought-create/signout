"use client";

import { INK_COLORS, BRUSH_SIZES, type Tool } from "@/lib/types";

type Props = {
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (s: number) => void;
  tool: Tool;
  setTool: (t: Tool) => void;
  onUndo: () => void;
  canUndo: boolean;
};

export default function Toolbar({
  color,
  setColor,
  size,
  setSize,
  tool,
  setTool,
  onUndo,
  canUndo,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2.5 text-sm font-semibold text-slate-800">Pick a color</p>
        <div className="flex flex-wrap items-center gap-2.5">
          {INK_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Ink color ${c}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                color === c ? "ring-2 ring-slate-900 ring-offset-2" : ""
              }`}
              style={{ backgroundColor: c }}
            >
              {color === c && <span className="text-xs text-white">✓</span>}
            </button>
          ))}
          <label className="relative flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 hover:border-violet-300">
            <span
              className="h-4 w-4 rounded-full"
              style={{
                background:
                  "conic-gradient(#f43f5e,#f59e0b,#22c55e,#3b82f6,#a855f7,#f43f5e)",
              }}
            />
            More
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-slate-800">Brush size</p>
        <div className="flex gap-2.5">
          {BRUSH_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-label={`Brush size ${s}`}
              className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white transition-all hover:scale-105 ${
                size === s
                  ? "border-violet-500 ring-2 ring-violet-200"
                  : "border-slate-200"
              }`}
            >
              <span
                className="rounded-full bg-slate-900"
                style={{ width: s + 3, height: s + 3 }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-slate-800">Tools</p>
        <div className="flex flex-col gap-2">
          <ToolButton
            active={tool === "draw"}
            onClick={() => setTool("draw")}
            icon="✍️"
            label="Draw"
          />
          <ToolButton
            active={tool === "text"}
            onClick={() => setTool("text")}
            icon="🔤"
            label="Add Text"
          />
          <ToolButton
            active={tool === "eraser"}
            onClick={() => setTool("eraser")}
            icon="🧽"
            label="Eraser"
          />
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden>↩️</span> Undo
            </span>
            <kbd className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
              Ctrl + Z
            </kbd>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-violet-50 p-3.5 text-sm text-violet-900">
        <p className="font-semibold">💡 Tip</p>
        <p className="mt-0.5 text-violet-800/80">
          Draw your signature or write a message — the eraser only clears your
          own unsaved strokes.
        </p>
      </div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"
      }`}
    >
      <span aria-hidden>{icon}</span> {label}
    </button>
  );
}
