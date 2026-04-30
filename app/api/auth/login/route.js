// login: check email + password and return the user
import { NextResponse } from "next/server";
import repo from "@/repository/socialRepository";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    const user = await repo.getUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { password: _pw, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Login failed" },
      { status: 500 }
    );
  }
}
