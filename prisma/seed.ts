import { PrismaClient } from '../lib/generated/prisma';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

const FIXED_WALLET_ADDRESS = "GCN6RWTBX2P3W5WFCAKXHXGBFVR3KBYNT4Y7BBV5VZONDS2MB7JBCIHL";

const contractExamples = [
  {
    id: "c1",
    title: "Logo Design",
    description: "Design new logo for launch campaign",
    amount: 500,
    currency: "USDC",
    status: "pending",
    dueDate: new Date("2025-05-15"),
    counterparty: "Creative Studios Inc.",
    method: "Manual",
  },
  {
    id: "c2",
    title: "Website Development",
    description: "Build e-commerce site with payment integration",
    amount: 2500,
    currency: "XLM",
    status: "pending",
    dueDate: new Date("2025-06-20"),
    counterparty: "TechSolutions Ltd.",
    method: "Automatic",
  },
  {
    id: "c3",
    title: "Content Writing",
    description: "Create blog posts for product launch",
    amount: 750,
    currency: "USDC",
    status: "active",
    dueDate: new Date("2025-05-10"),
    counterparty: "WordCraft Agency",
    method: "Manual",
  },
  {
    id: "c4",
    title: "Mobile App Development",
    description: "Develop iOS app with user authentication",
    amount: 3500,
    currency: "XLM",
    status: "active",
    dueDate: new Date("2025-07-15"),
    counterparty: "AppWorks Studio",
    method: "Automatic",
  },
  {
    id: "c5",
    title: "Brand Strategy",
    description: "Complete brand identity and guidelines",
    amount: 1200,
    currency: "USDC",
    status: "completed",
    dueDate: new Date("2025-04-01"),
    counterparty: "Brand Elevate",
    method: "Manual",
  },
  {
    id: "c6",
    title: "UI/UX Design",
    description: "Design user interface for dashboard",
    amount: 1800,
    currency: "XLM",
    status: "completed",
    dueDate: new Date("2025-03-25"),
    counterparty: "DesignMasters Co.",
    method: "Automatic",
  },
  {
    id: "c7",
    title: "Marketing Campaign",
    description: "Run social media ads for product launch",
    amount: 950,
    currency: "USDC",
    status: "active",
    dueDate: new Date("2025-05-30"),
    counterparty: "Digital Marketing Pro",
    method: "Manual",
  },
  {
    id: "c8",
    title: "Video Production",
    description: "Create promotional video for homepage",
    amount: 1500,
    currency: "XLM",
    status: "completed",
    dueDate: new Date("2025-04-15"),
    counterparty: "Visual Media Group",
    method: "Automatic",
  },
];

function generateRandomAddress(): string {
  const base = randomBytes(32).toString("hex").toUpperCase().slice(0, 55);
  return `G${base}`;
}

function generateContractCode(): string {
  return randomBytes(4).toString("hex");
}

async function main() {
  console.log("📥 Seeding wallets...");

  const walletAddresses: string[] = [FIXED_WALLET_ADDRESS];

  // Generate 4 random wallets
  for (let i = 0; i < 4; i++) {
    walletAddresses.push(generateRandomAddress());
  }

  for (const address of walletAddresses) {
    await prisma.wallet.upsert({
      where: { address },
      update: {},
      create: {
        address,
        ownerName: `User-${address.slice(-4)}`,
      },
    });
  }

  const otherWallets = walletAddresses.filter(addr => addr !== FIXED_WALLET_ADDRESS);

  console.log("📥 Seeding contracts...");

  for (const contract of contractExamples) {
    const randomOther = otherWallets[Math.floor(Math.random() * otherWallets.length)];

    // Randomly decide if FIXED wallet is sender or receiver
    const fixedIsSender = Math.random() < 0.5;

    const senderAddress = fixedIsSender ? FIXED_WALLET_ADDRESS : randomOther;
    const receiverAddress = fixedIsSender ? randomOther : FIXED_WALLET_ADDRESS;

    await prisma.contract.upsert({
      where: { id: contract.id },
      update: {},
      create: {
        ...contract,
        senderAddress,
        receiverAddress,
        contractCode: generateContractCode(),
      },
    });
  }

  console.log("✅ Done seeding wallets and contracts.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
