// posts of a single user (used by the profile page)
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const posts = await repo.getPostsByUser(id);
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load user's posts" },
      { status: 500 }
    );
  }
}
