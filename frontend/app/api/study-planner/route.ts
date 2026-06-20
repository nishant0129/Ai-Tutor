import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthTokenFromCookies, verifyAuthToken } from "@/lib/auth";

type RequestBody = {
  title?: string;
  date?: string;
  id?: string;
  done?: boolean;
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

  const tasks = await prisma.studyTask.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RequestBody;
  const { title, date } = body;
  if (!title || !date) {
    return NextResponse.json({ error: "Missing task fields." }, { status: 400 });
  }

  const task = await prisma.studyTask.create({
    data: { userId, title, date },
  });

  return NextResponse.json({ task }, { status: 201 });
}

export async function PATCH(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RequestBody;
  const { id, done } = body;
  if (!id || typeof done !== "boolean") {
    return NextResponse.json({ error: "Missing update data." }, { status: 400 });
  }

  const updated = await prisma.studyTask.updateMany({
    where: { id, userId },
    data: { done },
  });

  return NextResponse.json({ updated: updated.count });
}
