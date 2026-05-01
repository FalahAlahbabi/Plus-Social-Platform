// follow / unfollow a user, plus a check endpoint for the button state
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const followingId = Number(id);

    const { searchParams } = new URL(request.url);
    const followerId = Number(searchParams.get("followerId"));

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
    const { id } = await params;
    const followingId = Number(id);

    const { followerId } = await request.json();
    const numericFollowerId = Number(followerId);

    if (!numericFollowerId) {
      return NextResponse.json(
        { error: "followerId is required" },
        { status: 400 }
      );
    }

    if (numericFollowerId === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const alreadyFollowing = await repo.isFollowing(
      numericFollowerId,
      followingId
    );

    if (alreadyFollowing) {
      await repo.unfollowUser(numericFollowerId, followingId);
      return NextResponse.json(
        { success: true, following: false, message: "Unfollowed successfully" },
        { status: 200 }
      );
    }

    const follow = await repo.followUser(numericFollowerId, followingId);
    return NextResponse.json(
      { success: true, following: true, follow },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to toggle follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const followingId = Number(id);

    const { searchParams } = new URL(request.url);
    const followerId = Number(searchParams.get("followerId"));

    if (!followerId) {
      return NextResponse.json(
        { error: "followerId query parameter is required" },
        { status: 400 }
      );
    }

    await repo.unfollowUser(followerId, followingId);
    return NextResponse.json({ success: true, following: false });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to unfollow user" },
      { status: 500 }
    );
  }
}