import { NextResponse } from "next/server";

import { createMemo, listMemosByMonth } from "../../lib/dynamodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json({ error: "month is required" }, { status: 400 });
  }

  try {
    const memos = await listMemosByMonth(month);
    return NextResponse.json({ memos });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load data" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const payload = (await request.json()) as {
      date?: string;
      title?: string;
      body?: string;
      tag?: "info" | "alert";
    };

    if (!payload.date || !payload.title || !payload.body || !payload.tag) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 },
      );
    }

    const memo = await createMemo({
      date: payload.date,
      title: payload.title,
      body: payload.body,
      tag: payload.tag,
    });

    return NextResponse.json({ memo }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save data" },
      { status: 500 },
    );
  }
};
