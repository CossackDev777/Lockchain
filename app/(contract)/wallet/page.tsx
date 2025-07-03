"use client";

import { useState, useEffect } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import { AppLayout } from "@/components/layouts/app-layout";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageTransition } from "@/components/ui/page-transition";
import { useWallet } from "@/components/wallet-provider";

export default function WalletPage() {
  return (
    <AppLayout>
      <PageTransition>
        <DashboardLayout>
          <div className="px-0 sm:px-6 py-0 sm:py-6">
            <div className="flex justify-between items-center mb-4">
              <div>Welcome to Wallet page</div>
            </div>
          </div>
        </DashboardLayout>
      </PageTransition>
    </AppLayout>
  );
}