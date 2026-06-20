import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { buildAuthCookie, createAuthToken } from "@/lib/auth";

type RequestBody = {
  username: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody;
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  const token = createAuthToken({ userId: user.id, username: user.username, email: user.email });
  const response = NextResponse.json({ user: { username: user.username, email: user.email } });
  response.cookies.set(buildAuthCookie(token));
  return response;
}
