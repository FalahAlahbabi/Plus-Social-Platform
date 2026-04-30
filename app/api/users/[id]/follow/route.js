// follow / unfollow a user, plus a check endpoint for the button state
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(request, { params }) {
  try {
    const { id: followingId } = await params;
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get("followerId");
    if (!followerId) {
      return NextResponse.json(
        { error: "followerId query parameter is required" },
        { status: 400 }
      );
    }
    const following = await repo.isFollowing(followerId, followingId);
    return NextResponse.json({ following });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to check follow status" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id: followingId } = await params;
    const { followerId } = await request.json();
    if (!followerId) {
      return NextResponse.json(
        { error: "followerId is required" },
        { status: 400 }
      );
    }
    if (Number(followerId) === Number(followingId)) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }
    const follow = await repo.followUser(followerId, followingId);
    return NextResponse.json(follow, { status: 201 });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Already following" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: err?.message ?? "Failed to follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: followingId } = await params;
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get("followerId");
    if (!followerId) {
      return NextResponse.json(
        { error: "followerId query parameter is required" },
        { status: 400 }
      );
    }
    await repo.unfollowUser(followerId, followingId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
