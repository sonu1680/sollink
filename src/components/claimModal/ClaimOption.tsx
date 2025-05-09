import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import {
  ArrowLeft,
  Wallet,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ClaimOptionsProps {
  onBack: () => void;
  params: string;
  balance: any;
}

export default function ClaimOptions({
  onBack,
  params,
  balance,
}: ClaimOptionsProps) {
  const session = useSession();
  const localWallet = useRecoilValue(WalletAtom);
  const [activeTab, setActiveTab] = useState("quick");
  const [walletAddress, setWalletAddress] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      "F3dzQ74R9vRp7JuFgqA4xLrhGLrtoXZQhkbbGKRhKQeY"
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const sendTransaction = async (receiverAddress: PublicKey) => {
    try {
      const keypairBytes = bs58.decode(params.toString());
      const sender = Keypair.fromSecretKey(keypairBytes);
      if (balance < 5000) return toast({ title: "insufficient balance" });
      const receiver = wallet.publicKey;
      // console.log(receiver, sender);

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
      setIsSubmitting(false);

      return toast({ title: "crypto clain success",description:signature });

    } catch (err) {
      console.error("❌ Transaction failed:", err);
    }
  };
  const handleClaimSubmit = async (method: string) => {
    setIsSubmitting(true);
    console.log(method)
    switch (method) {
      case "google":
        if (session.status == "unauthenticated") await signIn();

        await sendTransaction(localWallet.publickey!);
        setIsSubmitting(false);

        break;
      case "handleClaimSubmit":
        await sendTransaction(new PublicKey(walletAddress));
        break;

        case "address":
          if (wallet.publicKey) await sendTransaction(wallet.publicKey);
          break;
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" className="mb-2 -ml-2" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="border-none shadow-xl">
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold text-center text-gray-800">
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
              <motion.div variants={container} initial="hidden" animate="show">
                <motion.div variants={item} className="mb-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    onClick={() => handleClaimSubmit("google")}
                  >
                    <div className="mr-3 flex-shrink-0">
                      <Icons.google className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-700">
                        Google Login & Claim
                      </div>
                      <div className="text-xs text-gray-500">
                        Quick access without creating a new wallet
                      </div>
                    </div>
                  </Button>
                </motion.div>

                <motion.div variants={item}>
                  {/* <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    onClick={handleClaimSubmit}
                  >
                    <div className="mr-3 flex-shrink-0 text-gray-600">
                      <Icons.apple className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-700">
                        Apple Login & Claim
                      </div>
                      <div className="text-xs text-gray-500">
                        Secure sign-in with your Apple ID
                      </div>
                    </div>
                  </Button> */}
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-0">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                <motion.div variants={item}>
                  {/* <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    onClick={() => handleClaimSubmit("phantom")}
                  >
                    <div className="mr-3 flex-shrink-0 text-gray-600">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-700">
                        Phantom Wallet
                      </div>
                      <div className="text-xs text-gray-500">
                        Connect your Phantom wallet to claim
                      </div>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                  </Button> */}
                </motion.div>

                <motion.div onClick={()=>handleClaimSubmit('wallet')} className="flex justify-center items-center" variants={item}>
                  {/* <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    onClick={() => handleClaimSubmit("solflare")}
                  >
                    <div className="mr-3 flex-shrink-0 text-gray-600">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-700">
                        Solflare
                      </div>
                      <div className="text-xs text-gray-500">
                        Connect your Solflare wallet to claim
                      </div>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                  </Button> */}
                  <WalletButtons/>
                </motion.div>

                <motion.div variants={item}>
                  {/* <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                    onClick={() => handleClaimSubmit("morewallet")}
                  >
                    <div className="mr-3 flex-shrink-0 text-gray-600">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-700">
                        More Wallets
                      </div>
                      <div className="text-xs text-gray-500">
                        See additional wallet options
                      </div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                  </Button> */}
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="address" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Claim to Solana Wallet Address
                  </h3>
                  <Input
                    placeholder="Enter Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="px-4 py-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                  <div className="text-sm text-indigo-800 font-medium">
                    <div>Your claim link:</div>
                    <div className="text-xs font-normal text-indigo-700 truncate max-w-[200px]">
                      add claim id or link
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100"
                    onClick={handleCopyClick}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              className="w-full py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300"
              onClick={() => handleClaimSubmit("address")}
              disabled={
                isSubmitting || (activeTab === "address" && !walletAddress)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Claim ${Number(balance) / LAMPORTS_PER_SOL} SOL`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
