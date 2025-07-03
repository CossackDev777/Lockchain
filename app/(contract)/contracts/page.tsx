"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { LuCircleAlert } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/ui/page-transition";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AppLayout } from "@/components/layouts/app-layout";
import { useWallet } from "@/components/wallet-provider";

export default function ContractsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("received");
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/contracts?walletAddress=${publicKey}`);
      if (!response.ok) throw new Error("Failed to fetch contracts");
      const data = await response.json();
      console.log("Fetched contracts:", data);
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError("Failed to load contracts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      const delayFetch = setTimeout(() => {
        fetchContracts();
      }, 1000); // slight delay to let wallet settle
      return () => clearTimeout(delayFetch);
    } else {
      setContracts([]);
      setIsLoading(false);
    }
  }, [publicKey]);

  const filterContracts = useMemo(
    () => (type: string, status: string) =>
      contracts.filter((c) => c.type === type && c.status === status),
    [contracts]
  );

  if (!publicKey && !isLoading) {
    return (
      <AppLayout>
        <PageTransition>
          <DashboardLayout>
            <EmptyState message="Please connect your wallet to view contracts." />
          </DashboardLayout>
        </PageTransition>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <DashboardLayout>
          <div className="px-0 sm:px-6 py-0 sm:py-6">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <button
                onClick={fetchContracts}
                className="text-sm text-[#00d0ff] border border-[#00d0ff] px-3 py-1 rounded-full hover:bg-[#00d0ff]/10 transition-all"
              >
                Refresh
              </button>
            </div>

            {isLoading ? (
              <LoadingState message="Loading your contracts..." />
            ) : error ? (
              <EmptyState message={error} />
            ) : (
              <Tabs
                defaultValue="received"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="px-6 pt-6">
                  <TabsList className="grid grid-cols-2 w-full max-w-md bg-[#1e293b] rounded-full p-1">
                    <TabsTrigger
                      value="received"
                      className="text-sm py-1.5 rounded-full data-[state=active]:bg-[#00d0ff] data-[state=active]:text-black"
                    >
                      Received
                    </TabsTrigger>
                    <TabsTrigger
                      value="sent"
                      className="text-sm py-1.5 rounded-full data-[state=active]:bg-[#00d0ff] data-[state=active]:text-black"
                    >
                      Sent
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-6">
                  <TabsContent value="received" className="mt-0 space-y-8">
                    <ContractTable
                      title="Pending Contracts"
                      contracts={filterContracts("RECEIVED", "pending")}
                    />
                    <ContractTable
                      title="Active Contracts"
                      contracts={filterContracts("RECEIVED", "active")}
                    />
                    <ContractTable
                      title="Completed Contracts"
                      contracts={filterContracts("RECEIVED", "completed")}
                    />
                  </TabsContent>
                  <TabsContent value="sent" className="mt-0 space-y-8">
                    <ContractTable
                      title="Pending Contracts"
                      contracts={filterContracts("SENT", "pending")}
                    />
                    <ContractTable
                      title="Active Contracts"
                      contracts={filterContracts("SENT", "active")}
                    />
                    <ContractTable
                      title="Completed Contracts"
                      contracts={filterContracts("SENT", "completed")}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </div>
        </DashboardLayout>
      </PageTransition>
    </AppLayout>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="flex flex-col items-center">
        <BiLoaderCircle className="h-10 w-10 animate-spin text-[#00d0ff] mb-4" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 bg-[#0e0f11] rounded-lg border border-gray-700 mt-4">
      <div className="bg-white p-2.5 rounded-full shadow-sm mb-3">
        <FaClock className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-white text-sm font-medium">{message}</p>
      <p className="text-gray-300 text-xs mt-1">
        Contracts will appear here when created
      </p>
    </div>
  );
}

function ContractTable({ title, contracts }: { title: string; contracts: any[] }) {
  return (
    <section>
      <h2 className="text-lg lg:text-xl font-semibold text-white mb-3">{title}</h2>
      {contracts.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {contracts.map((contract) => (
            <ContractRow key={contract.id} contract={contract} />
          ))}
        </div>
      ) : (
        <EmptyState
          message={`No ${title.toLowerCase().replace(" contracts", "").trim()} contracts`}
        />
      )}
    </section>
  );
}

function ContractRow({ contract }: { contract: any }) {
  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
    if (
      currency === "USDC" ||
      currency === "XLM" ||
      !["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].includes(currency)
    ) {
      return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${currency}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-0.5 bg-amber-400 text-black font-medium text-sm px-2 py-0.5 rounded-md">
            <FaClock className="h-3 w-3" />
            <span className="hidden sm:inline">Pending</span>
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-0.5 bg-emerald-500 text-white font-medium text-sm px-2 py-0.5 rounded-md">
            <LuCircleAlert className="h-3 w-3" />
            <span className="hidden sm:inline">Active</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-0.5 bg-sky-500 text-white font-medium text-sm px-2 py-0.5 rounded-md">
            <FaCheckCircle className="h-3 w-3" />
            <span className="hidden sm:inline">Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-0.5 bg-gray-100 text-gray-800 font-medium text-sm px-2 py-0.5 rounded-md">
            {status}
          </span>
        );
    }
  };

  const handleViewDetails = () => router.push(`/contract/${contract.id}`);

  return (
    <div className="grid md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr] grid-cols-2 items-center py-3 hover:bg-[#1e293b] transition-all duration-200 ease-in-out px-2 sm:px-0">
      <div className="flex flex-col">
        <div className="text-white text-sm font-medium">{contract.title}</div>
        <div className="text-xs text-gray-400 md:hidden">
          {formatCurrency(contract.amount, contract.currency)}
        </div>
        <div className="md:hidden mt-1">{getStatusBadge(contract.status)}</div>
      </div>
      <div className="hidden md:block text-gray-300 text-xs">
        {contract.method}
      </div>
      <div className="hidden md:block text-white text-sm font-medium">
        {formatCurrency(contract.amount, contract.currency)}
      </div>
      <div className="hidden md:block pl-4">{getStatusBadge(contract.status)}</div>
      <div className="text-right">
        <button
          className="rounded-full cursor-pointer border border-[#00d0ff] text-[#00d0ff] text-xs px-3 py-1 hover:bg-[#00d0ff]/10 transition-all duration-200"
          onClick={handleViewDetails}
        >
          Details
        </button>
      </div>
    </div>
  );
}