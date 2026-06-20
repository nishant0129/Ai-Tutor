import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { buildAuthCookie, createAuthToken } from "@/lib/auth";

type RequestBody = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody;
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid login credentials." }, { status: 401 });
  }

  const token = createAuthToken({ userId: user.id, username: user.username, email: user.email });
  const response = NextResponse.json({ user: { username: user.username, email: user.email } });
  response.cookies.set(buildAuthCookie(token));

  return response;
}
