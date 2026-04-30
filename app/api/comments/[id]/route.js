// delete a comment (only by its author)
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }
    await repo.deleteComment(id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err?.message ?? "Failed to delete comment";
    const status = msg.includes("unauthorized") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
