import { NextResponse } from "next/server";
import { getPostsForReview } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getPostsForReview();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
