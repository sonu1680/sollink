import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
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
import { WalletAtom } from "@/recoil/wallet";
import { toast } from "@/hooks/use-toast";
import WalletButtons from "../WalletButtons";
import { useRouter } from "next/navigation";

interface ClaimOptionsProps {
  onBack: () => void;
  params: string;
  balance: number;
}

export default function ClaimOptions({
  onBack,
  params,
  balance,
}: ClaimOptionsProps) {
  const { status } = useSession();
  const localWallet = useRecoilValue(WalletAtom);
  const [activeTab, setActiveTab] = useState("quick");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
const router=useRouter();
  const sendTransaction = useCallback(
    async (receiverAddress: PublicKey) => {
      try {
        const keypairBytes = bs58.decode(params);
        const sender = Keypair.fromSecretKey(keypairBytes);

        if (balance < 5000) {
          toast({ title: "Insufficient balance" });
          return;
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: receiverAddress,
            lamports: balance - 5000,
          })
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [sender]
        );
        toast({ title: "Crypto claim success", description: signature });
        router.push("/wallet");
      } catch (err) {
        console.error("❌ Transaction failed:", err);
        toast({ title: "Transaction failed", description: `${err}` });
      } finally {
        setIsSubmitting(false);
      }
    },
    [balance, connection, params]
  );

  const handleClaimClick = useCallback(async () => {
    setIsSubmitting(true);

    switch (activeTab) {
      case "quick":
        if (status === "unauthenticated") await signIn();
        if (localWallet?.publickey)
          await sendTransaction(localWallet.publickey);
        break;

      case "wallet":
        if (wallet.publicKey) await sendTransaction(wallet.publicKey);
        else toast({ title: "Wallet not connected" });
        break;

      case "address":
        try {
          const pubKey = new PublicKey(walletAddress);
          await sendTransaction(pubKey);
        } catch {
          toast({ title: "Invalid address" });
        }
        break;
    }
  }, [activeTab, localWallet, status, wallet, walletAddress, sendTransaction]);

  const getClaimButtonText = () => {
    const solAmount = (balance / LAMPORTS_PER_SOL).toFixed(4);
    if (isSubmitting)
      return (
        <>
          {" "}
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...{" "}
        </>
      );
    return `Claim ${solAmount} SOL`;
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" className="mb-2 -ml-2" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="border-none shadow-xl">
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold text-center text-primary">
            Choose how to claim your SOL
          </h2>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="quick"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="quick">Quick</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="mt-0">
              <motion.div initial="hidden" animate="show">
                <motion.div className="mb-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    onClick={handleClaimClick}
                  >
                    <div className="mr-3 flex-shrink-0">
                      <Icons.google className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-primary group-hover:text-indigo-700">
                        {status === "authenticated"
                          ? "Claim"
                          : "Google Login & Claim"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Quick access without creating a new wallet
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-0">
              <div className="flex justify-center">
                <WalletButtons />
              </div>
            </TabsContent>

            <TabsContent value="address" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">
                    Claim to Solana Wallet Address
                  </h3>
                  <Input
                    placeholder="Enter Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              className="w-full py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300"
              onClick={handleClaimClick}
              disabled={
                isSubmitting ||
                (activeTab === "address" && !walletAddress.trim())
              }
            >
              {getClaimButtonText()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
