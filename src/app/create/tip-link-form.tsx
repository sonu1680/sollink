"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import AssetSelector from "./asset-selector";
import FundAccountSelect from "./fundAccount-select";
import CreatedTipLinkModal from "@/components/linkmodal/created-tiplink-moda";
import bs58 from "bs58";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useRecoilValue } from "recoil";
import { TokenPriceAtom } from "@/recoil/tokenPrice";
import { useSession } from "next-auth/react";
import { WalletAtom } from "@/recoil/wallet";
import { Asset, AssetAccount } from "@/lib/types";

import { AlertDialogs } from "@/components/AlertDialogs";

export default function TipLinkForm() {
  const { toast } = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();
  const session = useSession();

  const tokenPrice = useRecoilValue(TokenPriceAtom);

  const [amount, setAmount] = useState("0");
  const [cryptoEquivalent, setCryptoEquivalent] = useState(0);
  const [signature, setSignature] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tipLinkCreated, setTipLinkCreated] = useState(false);

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
  const solPriceRef = useRef<number>(144);
  const solLinkWallet = useRecoilValue(WalletAtom);
const [solLinkTrxDialog,setSolLinkTrxDialog]=useState<boolean>(false)
const [dialogHandlers, setDialogHandlers] = useState<{
  onConfirm: () => void;
  onClose: () => void;
} | null>(null);
  // Update accounts based on wallet/session
  useEffect(() => {
    const updatedAccounts: AssetAccount[] = [];
    updatedAccounts.push({ name: "SolLink", icon: "/solana.png" });

    if (wallet.publicKey && wallet.wallet?.adapter.name) {
      updatedAccounts.push({
        name: wallet.wallet.adapter.name,
        icon: wallet.wallet.adapter.icon ?? "",
      });
    }

    setAccounts(updatedAccounts);

     if (session.status === "authenticated") {
      setSelectAccount({ name: "SolLink", icon: "/solana.png" });

    }
    else if (wallet.publicKey) {
      setSelectAccount({
        name: wallet.wallet?.adapter.name!,
        icon: wallet.wallet?.adapter.icon! ?? "",
      });
    } else{
      setSelectAccount({ name: "Connect Wallet", icon: "/null.png" });

    }
   
  }, [session.status, wallet.publicKey,]);

  useEffect(() => {
    solPriceRef.current = tokenPrice || 0;
    if (wallet.connected && wallet.publicKey) {
       getBalance(wallet.publicKey);
    }
    else if (solLinkWallet.publickey) {
      getBalance(solLinkWallet.publickey);
    }

  }, [ wallet.publicKey, selectAccount]);

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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


//confirm sollink trx popup
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
    let txSig;;
    let senderPublickey;;
    if (selectAccount.name=="SolLink"){
      senderPublickey = solLinkWallet.publickey;;
    }else{
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

      if (selectAccount.name == "SolLink") {
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

  return (
    <Card className="w-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all">
      <AlertDialogs
        open={solLinkTrxDialog}
        title="Are you absolutely sure?"
        description="This action cannot be undone. Are you sure you want to proceed?"
        onClose={() => {
          setSolLinkTrxDialog(false);
          dialogHandlers?.onClose?.(); // reject promise if any
        }}
        onConfirm={() => {
          setSolLinkTrxDialog(false);
          dialogHandlers?.onConfirm?.(); // resolve promise if any
        }}
      />

      <CreatedTipLinkModal
        open={tipLinkCreated}
        onClose={() => setTipLinkCreated(false)}
        amount={cryptoEquivalent.toFixed(4)}
        currency="SOL"
        usdValue={amount}
        tipLinkUrl={signature ?? ""}
      />

      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold">Create a SolLink</CardTitle>
        <CardDescription>
          Send crypto to anyone—even if they don't have a wallet. No app needed!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FundAccountSelect
          assets={accounts}
          selectedAsset={selectAccount}
          onAssetChange={setSelectAccount}
        />
        <div className="space-y-2">
          <AssetSelector
            selectedAsset={selectedAsset}
            onAssetChange={setSelectedAsset}
          />
          <p className="text-sm text-center text-muted-foreground">
            Your available {selectedAsset.symbol}: {selectedAsset.balance} ($
            {selectedAsset.balanceUsd.toFixed(3)})
          </p>
        </div>

        <div className="mt-6 relative">
          <div className="flex items-center border rounded-md bg-background/50">
            <span className="pl-3 text-lg font-medium">$</span>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="border-0 text-lg focus-visible:ring-0 pl-0"
              placeholder="0.00"
            />
            <span className="pr-3 text-sm text-muted-foreground">USD</span>
          </div>
          <div className="mt-1 text-center text-sm text-muted-foreground">
            {cryptoEquivalent.toFixed(6)} {selectedAsset.symbol}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[1, 2, 5].map((val) => (
            <Button
              key={val}
              variant="outline"
              onClick={() => handleQuickAmountSelect(val)}
              className={cn(
                "transition-all",
                amount === val.toString() && "bg-primary/10 border-primary/30"
              )}
            >
              ${val}
            </Button>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-6 text-base font-medium"
          onClick={handleCreateTipLink}
          disabled={isCreating || parseFloat(amount) <= 0}
        >
          {isCreating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating TipLink...
            </>
          ) : (
            "Create TipLink"
          )}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Lost your link?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Click Here
            </a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
