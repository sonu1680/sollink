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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import AssetSelector from "./asset-selector";
import axios from "axios";
import { Asset } from "@/lib/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import FundAccountSelect from "./fundAccount-select";
import CreatedTipLinkModal from "@/components/linkmodal/created-tiplink-moda";
import { useRecoilValue } from "recoil";
import { TokenPriceAtom } from "@/recoil/tokenPrice";

export default function TipLinkForm() {
  const { toast } = useToast();
  const tokenPrice=useRecoilValue(TokenPriceAtom);
  const [amount, setAmount] = useState<string>("0");
  const [cryptoEquivalent, setCryptoEquivalent] = useState<number>(0);
  const[signature,setSignature]=useState<string|null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset>({
    symbol: "SOL",
    name: "Solana",
    balance: 0,
    balanceUsd: 0,
    icon: "/images/sol-icon.png",
  });
  const [selectAccount, setSelectAccount] = useState<Asset>({
    symbol: "phantom",
    name: "Solana",
    balance: 0,
    balanceUsd: 0,
    icon: "/images/sol-icon.png",
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const solPriceRef = useRef<number>(144);
  const { connection } = useConnection();
  const wallet = useWallet();
  const [tipLinkCreated, setTipLinkCreated] = useState(false);

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString());
    
    setCryptoEquivalent(value / solPriceRef.current);
  };

  const handleCreateTipLink = async () => {
    setIsCreating(true);
    try {
      const key = Keypair.generate();
      const publicKey = key.publicKey;
      const privateKey = JSON.stringify(bs58.encode(key.secretKey));

      const trx = new Transaction();
      const details = SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: publicKey,
        lamports: Number(cryptoEquivalent.toFixed(3)) * LAMPORTS_PER_SOL,
      });

      trx.add(details);
      const signature = await wallet.sendTransaction(trx, connection);
      setSignature(privateKey);
      setTipLinkCreated(true);

      toast({
        title: "Link Created!",
        description: signature.toString(),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong!",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && solPriceRef.current > 0) {
        setCryptoEquivalent(numericValue / solPriceRef.current);
      } else {
        setCryptoEquivalent(0);
      }
    }
  };

  const getBalance = async (publicKey: PublicKey) => {
    const balance = await connection.getBalance(publicKey, "confirmed");
    setSelectedAsset((prev) => ({
      ...prev,
      balance: balance / LAMPORTS_PER_SOL,
      balanceUsd: (solPriceRef.current * balance) / LAMPORTS_PER_SOL,
    }));
  };

  // const getTokenPrice = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=SOL",
  //       {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: "Bearer ZReKGZNXr4h7LmdAVtvigBXbV1l22oZV",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     const price = data.data[0].prices[0].value;
  //     solPriceRef.current = parseFloat(price);
  //   } catch (error) {
  //     console.error("Error fetching token price:", error);
  //   }
  // };

  useEffect(() => {
    // getTokenPrice().then(() => {
      solPriceRef.current = (tokenPrice||0);
 
      if (wallet.connected && wallet.publicKey) {

        getBalance(wallet.publicKey);
      }
    // });
  }, [tokenPrice,connection, wallet.publicKey]);

  return (
    <Card className="w-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all">
      <CreatedTipLinkModal
        open={tipLinkCreated}
        onClose={() => setTipLinkCreated(false)}
        amount={String(cryptoEquivalent.toFixed(4).toString())}
        currency="SOL"
        usdValue={amount}
        tipLinkUrl={signature || ""}
      />

      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight transition-colors">
          Create a TipLink
        </CardTitle>
        <CardDescription className="text-md max-w-sm mx-auto text-muted-foreground">
          Send crypto & NFTs to anyone, even if they don&apos;t have a wallet.
          No app needed!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <FundAccountSelect
            selectedAsset={selectAccount}
            onAssetChange={setSelectAccount}
          />
        </div>
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

        <div className="relative mt-6">
          <div className="flex items-center border rounded-md bg-background/50 hover:bg-background/80 transition-colors focus-within:ring-1 focus-within:ring-ring">
            <span className="pl-3 text-lg font-medium text-foreground">$</span>
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
