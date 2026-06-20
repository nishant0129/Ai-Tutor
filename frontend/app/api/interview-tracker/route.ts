import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromCookies, verifyAuthToken } from "@/lib/auth";

type RequestBody = {
  company?: string;
  role?: string;
  date?: string;
  status?: string;
  id?: string;
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

  const interviews = await prisma.interview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ interviews });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RequestBody;
  const { company, role, date, status } = body;
  if (!company || !role || !date || !status) {
    return NextResponse.json({ error: "Missing interview fields." }, { status: 400 });
  }

  const interview = await prisma.interview.create({
    data: { userId, company, role, date, status },
  });

  return NextResponse.json({ interview }, { status: 201 });
}

export async function PATCH(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RequestBody;
  const { id, status } = body;
  if (!id || !status) {
    return NextResponse.json({ error: "Missing update data." }, { status: 400 });
  }

  const interview = await prisma.interview.updateMany({
    where: { id, userId },
    data: { status },
  });

  return NextResponse.json({ updated: interview.count });
}
