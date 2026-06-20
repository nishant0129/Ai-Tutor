import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromCookies, verifyAuthToken } from "@/lib/auth";

type RequestBody = {
  name?: string;
  title?: string;
  summary?: string;
  skills?: string;
  experience?: string;
  jobTarget?: string;
  style?: string;
};

async function getUserIdFromToken() {
  const token = await getAuthTokenFromCookies();
  if (!token) return null;
  const payload = verifyAuthToken(token);
  return payload?.userId ?? null;
}

export async function GET() {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await prisma.resume.findUnique({
    where: { userId },
  });

  return NextResponse.json({ resume });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RequestBody;
  const { name, title, summary, skills, experience, jobTarget, style } = body;
  if (!name || !title || !summary || !skills || !experience) {
    return NextResponse.json({ error: "Missing resume fields." }, { status: 400 });
  }

  const resume = await prisma.resume.upsert({
    where: { userId },
    update: { name, title, summary, skills, experience, jobTarget, style },
    create: { userId, name, title, summary, skills, experience, jobTarget, style },
  });

  return NextResponse.json({ resume });
}
