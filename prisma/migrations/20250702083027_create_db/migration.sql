-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ownerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "contractCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XLM',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "senderAddress" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "counterparty" TEXT,
    "method" TEXT NOT NULL DEFAULT 'Manual',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "sequence" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StellarTransaction" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "amount" DECIMAL(20,7),
    "assetCode" TEXT,
    "senderAddress" TEXT,
    "receiverAddress" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StellarTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractCode_key" ON "Contract"("contractCode");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_transactionId_key" ON "Contract"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_transactionId_key" ON "Milestone"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "StellarTransaction_txHash_key" ON "StellarTransaction"("txHash");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "StellarTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "StellarTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
