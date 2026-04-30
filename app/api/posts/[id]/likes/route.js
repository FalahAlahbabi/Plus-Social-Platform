// like / unlike a post, plus a check endpoint for the heart icon state
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(request, { params }) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }
    const liked = await repo.isLiked(userId, postId);
    return NextResponse.json({ liked });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to check like status" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id: postId } = await params;
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    const like = await repo.addLike(userId, postId);
    return NextResponse.json(like, { status: 201 });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Already liked" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: err?.message ?? "Failed to like post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }
    await repo.removeLike(userId, postId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to unlike post" },
      { status: 500 }
    );
  }
}
