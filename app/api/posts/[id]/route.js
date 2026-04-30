// single post: read it, or delete it (only by its owner)
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const post = await repo.getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load post" },
      { status: 500 }
    );
  }
}

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
    await repo.deletePost(id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err?.message ?? "Failed to delete post";
    const status = msg.includes("unauthorized") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
