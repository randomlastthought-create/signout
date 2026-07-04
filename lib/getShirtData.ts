import { connectDB } from "@/lib/db";
import { Shirt, Signature } from "@/lib/models";
import type { Stroke, TextItem, Mark, GiftDetails } from "@/lib/types";

export type ShirtData = {
  username: string;
  displayName: string;
  createdAt: string;
  marks: Mark[];
  count: number;
  gift: GiftDetails | null;
};

export async function getShirtData(usernameRaw: string): Promise<ShirtData | null> {
  const username = decodeURIComponent(usernameRaw).toLowerCase();
  await connectDB();

  const shirt = await Shirt.findOne({ username })
    .select("displayName createdAt gift")
    .lean<{ displayName: string; createdAt: Date; gift?: GiftDetails | null }>();
  if (!shirt) return null;

  const sigs = await Signature.find({ shirtUsername: username })
    .sort({ createdAt: 1 })
    .select("strokes texts")
    .lean<{ strokes: Stroke[]; texts: TextItem[] }[]>();

  const marks: Mark[] = sigs.flatMap((s) => [
    ...(s.strokes ?? []).map(
      (st): Mark => ({
        kind: "stroke",
        stroke: { points: st.points, color: st.color, size: st.size },
      })
    ),
    ...(s.texts ?? []).map(
      (t): Mark => ({
        kind: "text",
        item: { x: t.x, y: t.y, text: t.text, color: t.color, fontSize: t.fontSize, rotate: t.rotate },
      })
    ),
  ]);

  return {
    username,
    displayName: shirt.displayName,
    createdAt: shirt.createdAt.toISOString(),
    marks,
    count: sigs.length,
    gift: shirt.gift
      ? {
          bankName: shirt.gift.bankName,
          accountName: shirt.gift.accountName,
          accountNumber: shirt.gift.accountNumber,
        }
      : null,
  };
}
