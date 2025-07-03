import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { empty } from "@/lib/generated/prisma/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("walletAddress");
  const contractId = searchParams.get("contractId");

  if (contractId) {
    // Fetch contract by contractId
    try {
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: {
          milestones: {
            include: {
              transaction: true,
            },
          },
        },
      });

      if (!contract) {
        return NextResponse.json(
          { error: "Contract not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(contract);
    } catch (error) {
      console.error("Error fetching contract by ID:", error);
      return NextResponse.json(
        { error: "Failed to fetch contract" },
        { status: 500 }
      );
    }
  }

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const contracts = await prisma.contract.findMany({
      where: {
        OR: [
          { senderAddress: walletAddress },
          { receiverAddress: walletAddress },
        ],
      },
      include: {
        milestones: {
          include: {
            transaction: true,
          },
        },
      },
    });

    const contractsWithStatus = contracts.map((contract: typeof contracts[number]) => ({
      ...contract,
      type: contract.senderAddress === walletAddress ? "SENT" : "RECEIVED",
    }));

    return NextResponse.json(contractsWithStatus);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      contractCode,
      title,
      description,
      amount,
      currency,
      senderAddress,
      receiverAddress,
      dueDate,
      method,
      milestones,
    } = body;

    if (
      !contractCode ||
      !title ||
      !amount ||
      !senderAddress ||
      !receiverAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newContract = await prisma.contract.create({
      data: {
        contractCode,
        title,
        description,
        amount,
        currency: currency || "XLM",
        senderAddress,
        receiverAddress,
        dueDate,
        status: "pending",
        method: method || "Manual",
        milestones: {
          create: milestones?.map((milestone: any) => ({
            name: milestone.name,
            description: milestone.description,
            dueDate: milestone.dueDate,
            sequence: milestone.sequence,
            status: milestone.status || "pending",
          })),
        },
      },
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error("Error saving contract:", error);
    return NextResponse.json(
      { error: "Failed to save contract" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { contractId, action } = body;

    if (!contractId) {
      return NextResponse.json(
        { error: "Contract ID is required" },
        { status: 400 }
      );
    }

    // Prepare the update data
    const updateData: any = {};
    if (action === "accept") {
      updateData.status = "active";
    } 
    if (action === "reject") {
      updateData.status = "rejected";
    }

    // Update the contract
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
    });

    return NextResponse.json(updatedContract, { status: 200 });
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}