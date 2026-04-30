// list of users this user is following
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const following = await repo.getFollowing(id);
    return NextResponse.json(following);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load following" },
      { status: 500 }
    );
  }
}
