// signup: create a new user account
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function POST(request) {
  try {
    const { username, email, password, bio, profilePicture } =
      await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await repo.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const created = await repo.createUser({
      username,
      email,
      password,
      bio: bio ?? null,
      profilePicture: profilePicture ?? "/assets/images/default-avatar.png",
    });

    const { password: _pw, ...safeUser } = created;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (err) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: err?.message ?? "Signup failed" },
      { status: 500 }
    );
  }
}
