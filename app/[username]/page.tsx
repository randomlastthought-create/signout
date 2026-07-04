import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SignExperience from "@/components/SignExperience";
import SetupNotice from "@/components/SetupNotice";
import { getShirtData, type ShirtData } from "@/lib/getShirtData";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Sign ${decodeURIComponent(username)}'s shirt — signout`,
    description: "Leave your mark on the digital signout shirt.",
  };
}

export default async function ShirtPage({ params }: Props) {
  const { username } = await params;

  let data: ShirtData | null;
  try {
    data = await getShirtData(username);
  } catch (err) {
    return (
      <SetupNotice
        message={err instanceof Error ? err.message : "Could not reach the database."}
      />
    );
  }
  if (!data) notFound();

  return (
    <SignExperience
      mode="visitor"
      username={data.username}
      displayName={data.displayName}
      createdAt={data.createdAt}
      initialStrokes={data.strokes}
      initialCount={data.count}
    />
  );
}
