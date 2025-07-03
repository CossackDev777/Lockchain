import { NextResponse } from "next/server";
import Server from "@stellar/stellar-sdk";

const server = new Server("https://horizon.stellar.org");

export async function POST(request: Request) {
  const body = await request.json();
  const { publicKey } = body;

  if (!publicKey) {
    return NextResponse.json({ error: "Public key is required" }, { status: 400 });
  }

  try {
    const account = await server.loadAccount(publicKey);
    const balances = account.balances.map((balance: { asset_type: string; asset_code?: string; asset_issuer?: string; balance: string }) => ({
      asset_type: balance.asset_type,
      asset_code: balance.asset_code,
      asset_issuer: balance.asset_issuer,
      balance: balance.balance,
    }));

    return NextResponse.json({ balances });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKey = searchParams.get("publicKey");

  if (!publicKey) {
    return NextResponse.json({ error: "Public key is required" }, { status: 400 });
  }

  try {
    const records = await server
      .transactions()
      .forAccount(publicKey)
      .order("desc")
      .limit(10)
      .call();

    const transactions = records.records.map((tx: any) => ({
      id: tx.id,
      type: tx.operation_count > 1 ? "multiple" : "single",
      amount: "",
      created_at: tx.created_at,
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}