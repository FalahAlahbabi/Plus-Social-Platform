// users list
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET() {
  try {
    const users = await repo.getAllUsers();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load users" },
      { status: 500 }
    );
  }
}
