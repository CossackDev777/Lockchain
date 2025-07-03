"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";

type TransactionRecord = {
  id: string;
  type: string;
  amount: string;
  operation_count: number;
  asset_code?: string;
  created_at: string;
};

type WalletContextType = {
  isConnectedState: boolean;
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  balances: Array<{
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
    balance: string;
  }>;
  fetchBalances: () => Promise<void>;
  network: "testnet" | "mainnet";
  transactions: Array<{
    id: string;
    type: string;
    amount: string;
    asset_code?: string;
    created_at: string;
  }>;
  walletName?: string;
  walletType?: string;
  isFetchingBalances: boolean;
  isFetchingTransactions: boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET, // Change to WalletNetwork.MAINNET for production
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnectedState, setIsConnectedState] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Array<any>>([]);
  const [transactions, setTransactions] = useState<
    WalletContextType["transactions"]
  >([]);
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      const connected = await kit.openModal({
        onWalletSelected: async (wallet: ISupportedWallet) => {
          const { address } = await kit.getAddress();
          setPublicKey(address);
          setIsConnectedState(true);
        },
        onClosed: (err?: Error) => {
          if (err) {
            setError(err.message);
            setIsConnectedState(false);
          }
        },
      });

      if (!isConnectedState) {
        throw new Error("No wallet connected.");
      }
    } catch (err) {
      setError((err as Error).message);
      setIsConnectedState(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setPublicKey(null);
    setIsConnectedState(false);
    setBalances([]);
    setTransactions([]);
  }, []);

  const fetchBalances = useCallback(async () => {
    if (!publicKey) return;
    try {
      setIsFetchingBalances(true);
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicKey }),
      });

      const data = await response.json();
      if (response.ok) {
        setBalances(data.balances);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsFetchingBalances(false);
    }
  }, [publicKey]);

  const fetchTransactions = useCallback(async () => {
    if (!publicKey) return;
    try {
      setIsFetchingTransactions(true);
      const response = await fetch(`/api/wallet?publicKey=${publicKey}`, {
        method: "GET",
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsFetchingTransactions(false);
    }
  }, [publicKey]);

  useEffect(() => {
    (async () => {
      try {
        if (isConnectedState) {
          const { address } = await kit.getAddress();
          setPublicKey(address);
          setIsConnectedState(true);
        }
      } catch {
        setIsConnectedState(false);
      }
    })();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnectedState,
        publicKey,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        balances,
        fetchBalances,
        network,
        transactions,
        walletName: "Stellar Wallet",
        walletType: "browser-extension",
        isFetchingBalances,
        isFetchingTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
