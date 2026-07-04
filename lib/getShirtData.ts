import { connectDB } from "@/lib/db";
import { Shirt, Signature } from "@/lib/models";
import type { Stroke } from "@/lib/types";

export type ShirtData = {
  username: string;
  displayName: string;
  createdAt: string;
  strokes: Stroke[];
  count: number;
};

export async function getShirtData(usernameRaw: string): Promise<ShirtData | null> {
  const username = decodeURIComponent(usernameRaw).toLowerCase();
  await connectDB();

  const shirt = await Shirt.findOne({ username })
    .select("displayName createdAt")
    .lean<{ displayName: string; createdAt: Date }>();
  if (!shirt) return null;

  const sigs = await Signature.find({ shirtUsername: username })
    .sort({ createdAt: 1 })
    .select("strokes")
    .lean<{ strokes: Stroke[] }[]>();

  return {
    username,
    displayName: shirt.displayName,
    createdAt: shirt.createdAt.toISOString(),
    strokes: sigs.flatMap((s) =>
      s.strokes.map((st) => ({ points: st.points, color: st.color, size: st.size }))
    ),
    count: sigs.length,
  };
}
