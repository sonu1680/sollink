"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { useRecoilValue } from "recoil";
import { TokenPriceAtom } from "@/recoil/tokenPrice";
import { useSession } from "next-auth/react";
import { WalletAtom } from "@/recoil/wallet";
import { Asset, AssetAccount } from "@/lib/types";

export function useSolLinkForm() {
  const { toast } = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();
  const session = useSession();

  const tokenPrice = useRecoilValue(TokenPriceAtom);
  const solLinkWallet = useRecoilValue(WalletAtom);
  const solPriceRef = useRef<number>(144);

  const [amount, setAmount] = useState("0");
  const [cryptoEquivalent, setCryptoEquivalent] = useState(0);
  const [signature, setSignature] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tipLinkCreated, setTipLinkCreated] = useState(false);
  const [solLinkTrxDialog, setSolLinkTrxDialog] = useState<boolean>(false);
  const [dialogHandlers, setDialogHandlers] = useState<{
    onConfirm: () => void;
    onClose: () => void;
  } | null>(null);
const [walletBalance, setWalletBalance] = useState<{balance:number,balanceUsd:number}>({
  balance:0,
  balanceUsd:0
});
  const [selectedAsset, setSelectedAsset] = useState<Asset>({
    symbol: "SOL",
    name: "Solana",
    balance: 0,
    balanceUsd: 0,
    icon: "/solana.png",
  });

  const [selectAccount, setSelectAccount] = useState<AssetAccount>({
    name: "SolLink",
    icon: "/solana.png",
  });

  const [accounts, setAccounts] = useState<AssetAccount[]>([]);

  useEffect(() => {
    const updatedAccounts: AssetAccount[] = [
      { name: "SolLink", icon: "/solana.png" },
    ];

    if (wallet.publicKey && wallet.wallet?.adapter.name) {
      updatedAccounts.push({
        name: wallet.wallet.adapter.name,
        icon: wallet.wallet.adapter.icon ?? "",
      });
    }

    setAccounts(updatedAccounts);

    if (session.status === "authenticated") {
      setSelectAccount({ name: "SolLink", icon: "/solana.png" });
    } else if (wallet.publicKey) {
      setSelectAccount({
        name: wallet.wallet?.adapter.name!,
        icon: wallet.wallet?.adapter.icon! ?? "",
      });
    } else {
      setSelectAccount({ name: "Connect Wallet", icon: "/null.png" });
    }
  }, [session.status, wallet.publicKey]);

  useEffect(() => {
    solPriceRef.current = tokenPrice || 0;
    if (wallet.connected && wallet.publicKey) {
      getBalance(wallet.publicKey);
    } else if (solLinkWallet.publickey) {
      getBalance(solLinkWallet.publickey);
    }
  }, [wallet.publicKey, selectAccount]);

  const getBalance = async (publicKey: PublicKey) => {
    try {
      const balance = await connection.getBalance(publicKey, "confirmed");
      setSelectedAsset((prev) => ({
        ...prev,
        balance: balance / LAMPORTS_PER_SOL,
        balanceUsd: (solPriceRef.current * balance) / LAMPORTS_PER_SOL,
      }));
    } catch (err) {
      console.error("Error getting balance:", err);
    }
  };
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey, "confirmed");
        setWalletBalance({
          balance: balance / LAMPORTS_PER_SOL,
          balanceUsd: (solPriceRef.current * balance) / LAMPORTS_PER_SOL,
        });
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    if (publicKey) {
      fetchBalance();
    }
  }, [connection, publicKey]);
  
  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      const numeric = parseFloat(value);
      setCryptoEquivalent(!isNaN(numeric) ? numeric / solPriceRef.current : 0);
    }
  };

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString());
    setCryptoEquivalent(value / solPriceRef.current);
  };

  const confirmSolLinkTransaction = () => {
    return new Promise<void>((resolve, reject) => {
      const handleConfirm = () => {
        setSolLinkTrxDialog(false);
        resolve();
      };

      const handleClose = () => {
        setSolLinkTrxDialog(false);
        reject(new Error("User cancelled"));
      };

      setSolLinkTrxDialog(true);
      setDialogHandlers({ onConfirm: handleConfirm, onClose: handleClose });
    });
  };

  const handleCreateTipLink = async () => {
    let txSig;
    let senderPublickey;

    if (selectAccount.name === "SolLink") {
      senderPublickey = solLinkWallet.publickey;
    } else {
      senderPublickey = wallet.publicKey;
    }

    if (!senderPublickey) {
      toast({ title: "Wallet not connected" });
      return;
    }

    setIsCreating(true);
    try {
      const key = Keypair.generate();
      const trx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublickey,
          toPubkey: key.publicKey,
          lamports: Math.round(cryptoEquivalent * LAMPORTS_PER_SOL),
        })
      );

      if (selectAccount.name === "SolLink") {
        const sender = Keypair.fromSecretKey(solLinkWallet.privatekey!);
        try {
          await confirmSolLinkTransaction();
          txSig = await sendAndConfirmTransaction(connection, trx, [sender]);
        } catch (err) {
          toast({ title: "Transaction cancelled" });
          return;
        }
      } else {
        txSig = await wallet.sendTransaction(trx, connection);
      }

      setSignature(bs58.encode(key.secretKey));
      setTipLinkCreated(true);
      toast({ title: "TipLink created", description: txSig });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Transaction failed", description: err.message });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    amount,
    setAmount,
    cryptoEquivalent,
    selectedAsset,
    setSelectedAsset,
    accounts,
    selectAccount,
    setSelectAccount,
    handleAmountChange,
    handleQuickAmountSelect,
    handleCreateTipLink,
    isCreating,
    tipLinkCreated,
    setTipLinkCreated,
    signature,
    solLinkTrxDialog,
    dialogHandlers,
    setSolLinkTrxDialog,
  };
}
