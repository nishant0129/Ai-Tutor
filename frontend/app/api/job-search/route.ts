import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromCookies, verifyAuthToken } from "@/lib/auth";

type RequestBody = {
  company?: string;
  role?: string;
  status?: string;
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

  const jobs = await prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RequestBody;
  const { company, role, status } = body;
  if (!company || !role || !status) {
    return NextResponse.json({ error: "Missing job fields." }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: { userId, company, role, status },
  });

  return NextResponse.json({ job }, { status: 201 });
}
