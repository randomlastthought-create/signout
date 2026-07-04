import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Shirt, Signature, type Stroke, type TextItem } from "@/lib/models";

const COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const MAX_STROKES = 200;
const MAX_POINTS = 5000;
const MAX_TEXTS = 40;
const MAX_TEXT_LEN = 140;

type Params = { params: Promise<{ username: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { username } = await params;
    await connectDB();
    const signatures = await Signature.find({ shirtUsername: username })
      .sort({ createdAt: 1 })
      .select("strokes texts createdAt")
      .lean();
    return NextResponse.json({ signatures });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { username } = await params;
    const body = await req.json().catch(() => null);
    const strokes = (body?.strokes ?? []) as Stroke[];
    const texts = (body?.texts ?? []) as TextItem[];

    if (!Array.isArray(strokes) || !Array.isArray(texts)) {
      return NextResponse.json({ error: "Invalid signature data." }, { status: 400 });
    }
    if (strokes.length === 0 && texts.length === 0) {
      return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
    }
    if (strokes.length > MAX_STROKES || texts.length > MAX_TEXTS) {
      return NextResponse.json({ error: "Invalid signature data." }, { status: 400 });
    }
    for (const s of strokes) {
      if (
        !Array.isArray(s.points) ||
        s.points.length < 4 ||
        s.points.length > MAX_POINTS ||
        s.points.some((n) => typeof n !== "number" || !Number.isFinite(n)) ||
        !COLOR_RE.test(s.color) ||
        typeof s.size !== "number" ||
        s.size < 1 ||
        s.size > 40
      ) {
        return NextResponse.json({ error: "Invalid stroke data." }, { status: 400 });
      }
    }
    for (const t of texts) {
      if (
        typeof t.x !== "number" ||
        typeof t.y !== "number" ||
        !Number.isFinite(t.x) ||
        !Number.isFinite(t.y) ||
        typeof t.text !== "string" ||
        t.text.trim().length === 0 ||
        t.text.length > MAX_TEXT_LEN ||
        !COLOR_RE.test(t.color) ||
        typeof t.fontSize !== "number" ||
        t.fontSize < 8 ||
        t.fontSize > 96 ||
        typeof t.rotate !== "number" ||
        !Number.isFinite(t.rotate)
      ) {
        return NextResponse.json({ error: "Invalid text data." }, { status: 400 });
      }
    }

    await connectDB();
    const shirt = await Shirt.findOne({ username: username.toLowerCase() }).lean();
    if (!shirt) {
      return NextResponse.json({ error: "Shirt not found." }, { status: 404 });
    }

    await Signature.create({
      shirtUsername: username.toLowerCase(),
      strokes: strokes.map((s) => ({
        points: s.points.map((n) => Math.round(n * 100) / 100),
        color: s.color,
        size: s.size,
      })),
      texts: texts.map((t) => ({
        x: Math.round(t.x * 100) / 100,
        y: Math.round(t.y * 100) / 100,
        text: t.text.trim(),
        color: t.color,
        fontSize: t.fontSize,
        rotate: t.rotate,
      })),
    });
    const count = await Signature.countDocuments({ shirtUsername: username.toLowerCase() });
    return NextResponse.json({ ok: true, count }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
