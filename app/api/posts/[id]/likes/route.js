// like / unlike a post, plus a check endpoint for the button state
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const postId = Number(id);

    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

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
    const { id } = await params;
    const postId = Number(id);

    const { userId } = await request.json();
    const numericUserId = Number(userId);

    if (!numericUserId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const alreadyLiked = await repo.isLiked(numericUserId, postId);

    if (alreadyLiked) {
      await repo.removeLike(numericUserId, postId);
      return NextResponse.json(
        { success: true, liked: false, message: "Like removed" },
        { status: 200 }
      );
    }

    const like = await repo.addLike(numericUserId, postId);
    return NextResponse.json(
      { success: true, liked: true, like },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to toggle like post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const postId = Number(id);

    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    await repo.removeLike(userId, postId);
    return NextResponse.json({ success: true, liked: false });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to unlike post" },
      { status: 500 }
    );
  }
}