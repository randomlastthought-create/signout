import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Shirt } from "@/lib/models";

const ACCOUNT_NUMBER_RE = /^[0-9]{6,20}$/;

type Params = { params: Promise<{ username: string }> };

// Update (or clear) the gift details for a shirt. Auth model matches the rest
// of the app: knowing the username is the only gate.
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { username } = await params;
    const body = await req.json().catch(() => null);

    if (!body || !("gift" in body)) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    let gift: { bankName: string; accountName: string; accountNumber: string } | null = null;
    if (body.gift !== null) {
      if (typeof body.gift !== "object") {
        return NextResponse.json({ error: "Invalid gift details." }, { status: 400 });
      }
      const bankName = String(body.gift.bankName ?? "").trim();
      const accountName = String(body.gift.accountName ?? "").trim();
      const accountNumber = String(body.gift.accountNumber ?? "").trim();
      if (!bankName || bankName.length > 50) {
        return NextResponse.json(
          { error: "Bank name is required (max 50 characters)." },
          { status: 400 }
        );
      }
      if (!accountName || accountName.length > 80) {
        return NextResponse.json(
          { error: "Account name is required (max 80 characters)." },
          { status: 400 }
        );
      }
      if (!ACCOUNT_NUMBER_RE.test(accountNumber)) {
        return NextResponse.json(
          { error: "Account number must be 6-20 digits." },
          { status: 400 }
        );
      }
      gift = { bankName, accountName, accountNumber };
    }

    await connectDB();
    const shirt = await Shirt.findOneAndUpdate(
      { username: username.toLowerCase() },
      { $set: { gift } },
      { new: true }
    ).lean<{ gift: typeof gift }>();

    if (!shirt) {
      return NextResponse.json({ error: "Shirt not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, gift: shirt.gift });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
