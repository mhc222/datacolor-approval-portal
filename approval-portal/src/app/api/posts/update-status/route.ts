import { NextRequest, NextResponse } from "next/server";
import { updatePostStatus } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, postId, status, comment } = body;
    const recordId = id || postId;

    if (!recordId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ["Approved", "Needs Revision", "Revision Requested", "Draft", "Ready for Review", "Review"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    await updatePostStatus(recordId, status, comment);

    return NextResponse.json({
      success: true,
      message: `Post status updated to "${status}"`,
    });
  } catch (error) {
    console.error("Error updating post status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
      { status: 500 }
    );
  }
}
