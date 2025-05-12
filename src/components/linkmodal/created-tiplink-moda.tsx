"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QRCode from "@/components/ui/qrcode";
import { CheckIcon, Copy, RefreshCw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58"
import { toast } from "@/hooks/use-toast";
import { useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
interface CreatedTipLinkModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  usdValue: string;
  solLinkUrl: string;
  claimBackPublicKey?: PublicKey;
}

export default function CreatedTipLinkModal({
  open,
  onClose,
  amount,
  currency,
  usdValue,
  solLinkUrl,
  claimBackPublicKey,

}: CreatedTipLinkModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const[loading,setLoading]=useState<boolean>(false)
const {connection}=useConnection();
const router=useRouter()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(solLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SolLink for ${amount.toFixed(4)} ${currency}`,
          text: `I'm sending you ${amount.toFixed(
            4
          )} ${currency} (~$${usdValue}) via SolLink!`,
          url: solLinkUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard();
    }
  };

  const claimBack = async() => {
    try {
      setLoading(true);
      const keypairBytes = bs58.decode(solLinkUrl.toString());
      const sender = Keypair.fromSecretKey(keypairBytes);
      const bal = await connection.getBalance(sender.publicKey, "confirmed");

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: claimBackPublicKey!,
          lamports: bal - 5000,
        })
      );
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
      );
      //router.push("/create");
      setLoading(false);
      onClose();
      return toast({
        title: "crypto claim back success",
        description: signature,
      });
    } catch (err) {
        console.error("❌ Transaction failed:", err);
        setLoading(false);
        onClose();

      }
    
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {showQR ? "SolLink URL's QR Code" : "You've created a SolLink!"}
          </DialogTitle>
        </DialogHeader>

        {!showQR ? (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-600 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Solana Balance
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">
                    {amount.toFixed(4)}
                  </span>
                  <span className="ml-2 text-2xl text-muted-foreground">
                    {currency}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ~${usdValue} USD
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Input value={solLinkUrl} readOnly className="bg-muted/50" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className={cn(
                  copied ? "border-green-500 text-green-500" : "border-input"
                )}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={() => setShowQR(true)}
                variant="outline"
                className="w-full"
              >
                Show QR Code
              </Button>
            </div>

            <Button variant="secondary" className="w-full" onClick={claimBack}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Claiming back...
                </>
              ) : (
                "Claim back"
              )}{" "}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              Scan below to open directly to this specific SolLink:
            </p>

            <div className="bg-muted/30 p-4 rounded-lg">
              <QRCode value={solLinkUrl} className="max-w-[240px] mx-auto" />
            </div>

            <div className="flex gap-2 items-center bg-muted/50 p-2 rounded-md">
              <Input
                value={solLinkUrl}
                readOnly
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className={cn(
                  "h-8 w-8",
                  copied ? "text-green-500" : "text-muted-foreground"
                )}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button onClick={() => setShowQR(false)} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
