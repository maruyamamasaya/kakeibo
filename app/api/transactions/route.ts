import { NextResponse } from "next/server";

import {
  createTransaction,
  listTransactionsByMonth,
} from "../../lib/dynamodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json({ error: "month is required" }, { status: 400 });
  }

  try {
    const transactions = await listTransactionsByMonth(month);
    return NextResponse.json({ transactions });
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
      amount?: number;
      type?: "income" | "expense";
      category?: string;
      note?: string;
      payer?: string;
    };

    if (
      !payload.date ||
      !payload.type ||
      !payload.category ||
      !payload.payer ||
      typeof payload.amount !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 },
      );
    }

    const transaction = await createTransaction({
      date: payload.date,
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      note: payload.note ?? "",
      payer: payload.payer,
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save data" },
      { status: 500 },
    );
  }
};
