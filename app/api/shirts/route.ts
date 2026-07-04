import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Shirt } from "@/lib/models";

const USERNAME_RE = /^[a-z0-9-]{3,20}$/;
const ACCOUNT_NUMBER_RE = /^[0-9]{6,20}$/;
const RESERVED = new Set(["api", "create", "dashboard", "how-it-works"]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const displayName = String(body?.displayName ?? "").trim();
    const username = String(body?.username ?? "").trim().toLowerCase();

    if (!displayName || displayName.length > 50) {
      return NextResponse.json(
        { error: "Display name is required (max 50 characters)." },
        { status: 400 }
      );
    }
    if (!USERNAME_RE.test(username) || RESERVED.has(username)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters: lowercase letters, numbers and hyphens." },
        { status: 400 }
      );
    }

    let gift: { bankName: string; accountName: string; accountNumber: string } | null = null;
    if (body?.gift && typeof body.gift === "object") {
      const bankName = String(body.gift.bankName ?? "").trim();
      const accountName = String(body.gift.accountName ?? "").trim();
      const accountNumber = String(body.gift.accountNumber ?? "").trim();
      if (bankName || accountName || accountNumber) {
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
    }

    await connectDB();
    const existing = await Shirt.findOne({ username }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "That username is already taken. Try another one." },
        { status: 409 }
      );
    }

    const shirt = await Shirt.create({ username, displayName, gift });
    return NextResponse.json(
      { username: shirt.username, displayName: shirt.displayName },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
