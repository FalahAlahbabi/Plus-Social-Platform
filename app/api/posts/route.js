// feed (GET ?userId=) and create new post (POST)
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }
    const posts = await repo.getFeedPosts(userId);
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load feed" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, content } = await request.json();
    if (!userId || !content || !String(content).trim()) {
      return NextResponse.json(
        { error: "userId and non-empty content are required" },
        { status: 400 }
      );
    }
    const post = await repo.createPost(userId, content);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to create post" },
      { status: 500 }
    );
  }
}
