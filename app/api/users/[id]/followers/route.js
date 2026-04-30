// list of users that follow this user
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const followers = await repo.getFollowers(id);
    return NextResponse.json(followers);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load followers" },
      { status: 500 }
    );
  }
}
