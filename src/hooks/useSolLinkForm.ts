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
  const [claimBackPublicKey, setClaimBackPublickey] =
    useState<PublicKey | null>(null);
  const [dialogHandlers, setDialogHandlers] = useState<{
    onConfirm: () => void;
    onClose: () => void;
  } | null>(null);
  const [walletBalance, setWalletBalance] = useState<{
    balance: number;
    balanceUsd: number;
  }>({
    balance: 0,
    balanceUsd: 0,
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
    solPriceRef.current = tokenPrice || 0;

    const updatedAccounts: AssetAccount[] = [];

    const isWalletConnected = wallet.publicKey && wallet.wallet?.adapter?.name;
    const isUserAuthenticated = session.status === "authenticated";

    // Populate available accounts
    if (isWalletConnected) {
      updatedAccounts.push({
        name: wallet.wallet?.adapter.name!,
        icon: wallet.wallet?.adapter.icon || "/null.png",
      });
    }

    if (isUserAuthenticated) {
      updatedAccounts.push({
        name: "SolLink",
        icon: "/solana.png",
      });
    }

    if (updatedAccounts.length === 0) {
      updatedAccounts.push({
        name: "Connect Wallet",
        icon: "/null.png",
      });
    }

    setAccounts(updatedAccounts);

    // Determine default selected account
    if (isUserAuthenticated) {
      setSelectAccount({ name: "SolLink", icon: "/solana.png" });
    } else if (isWalletConnected) {
      setSelectAccount({
        name: wallet.wallet?.adapter.name!,
        icon: wallet.wallet?.adapter.icon! || "/null.png",
      });
    } else {
      setSelectAccount({ name: "Connect Wallet", icon: "/null.png" });
    }
  }, [
    session.status,
    wallet.publicKey,
    wallet.wallet?.adapter?.name,
    tokenPrice,
  ]);
  useEffect(() => {
    const fetchBalance = async (publicKey: PublicKey) => {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed");
        const sol = lamports / LAMPORTS_PER_SOL;
        setWalletBalance({
          balance: sol,
          balanceUsd: sol * solPriceRef.current,
        });
      } catch (error) {
        toast({
          title: "Failed to fetch balance",
          description: "Please check your network connection.",
        });
      }
    };

    const publicKey =
      selectAccount.name === "SolLink"
        ? solLinkWallet?.publickey
        : wallet?.publicKey;

    if (publicKey) {
      fetchBalance(publicKey);
    
    }
  }, [selectAccount.name, solLinkWallet?.publickey, wallet?.publicKey]);
  

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
    setClaimBackPublickey(senderPublickey);
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
    walletBalance,
    claimBackPublicKey,
  };
}
