// add a comment to a post
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function POST(request, { params }) {
  try {
    const { id: postId } = await params;
    const { userId, text } = await request.json();
    if (!userId || !text || !String(text).trim()) {
      return NextResponse.json(
        { error: "userId and non-empty text are required" },
        { status: 400 }
      );
    }
    const comment = await repo.addComment(userId, postId, text);
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to add comment" },
      { status: 500 }
    );
  }
}
