// single user: get profile, update bio or picture
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const user = await repo.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let updated = null;

    if (typeof body.bio === "string") {
      updated = await repo.updateUserBio(id, body.bio);
    }
    if (typeof body.profilePicture === "string") {
      updated = await repo.updateUserPicture(id, body.profilePicture);
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Provide bio and/or profilePicture" },
        { status: 400 }
      );
    }

    const { password: _pw, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to update user" },
      { status: 500 }
    );
  }
}
