import { useMemo, useState } from "react";
import { ChevronDown, MoreHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "motion/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRecoilValue } from "recoil";
import { TokenPriceAtom } from "@/recoil/tokenPrice";
import Image from "next/image";
import AlreadyClaimed from "./AlreadyClaimed";

interface ClaimCardProps {
  onClaim: () => void;
  balance: number;
}

export default function ClaimCard({ onClaim, balance }: ClaimCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const tokenPrice = useRecoilValue(TokenPriceAtom);

  const solBalance = useMemo(() => balance / LAMPORTS_PER_SOL, [balance]);
  const usdBalance = useMemo(
    () => solBalance * (tokenPrice || 0),
    [solBalance, tokenPrice]
  );


  if (usdBalance <= 0.2) {
    return <AlreadyClaimed />;
  }


  if (tokenPrice === null || tokenPrice === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 font-medium">
        <RefreshCw className="animate-spin mb-2 h-6 w-6 text-gray-400" />
        <span>Loading price data...</span>
      </div>
    );

    
    
  }


  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center text-primary mb-2">
        Here is{" "}
        <span className="text-indigo-600">${usdBalance.toFixed(0)||""}</span> in
        crypto!
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Claim your free Solana tokens below
      </p>

      <Card className="relative overflow-hidden border-none shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/20 z-0" />

        <CardHeader className="relative z-10 pb-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r p-1">
              <Image
                src="/solana.png"
                alt="Solana logo"
                height={32}
                width={32}
              />
            </div>
            <span className="text-gray-600 font-medium">Solana Balance</span>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Options"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
              
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-4">
          <div className="mb-1 flex items-baseline">
            <span className="text-6xl font-bold text-primary tracking-tight">
              {solBalance.toFixed(4)}
            </span>
            <span className="text-4xl text-gray-500 ml-2 font-medium">SOL</span>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex gap-1 items-center text-primary">
              ≈{" "}
              <span className="font-medium">
                ${usdBalance.toFixed(2)} price
              </span>{" "}
              USD
            </div>
            <motion.div
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Ready to claim
            </motion.div>
          </div>

          <motion.div
            className="relative"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300"
              onClick={onClaim}
              aria-label="Claim Solana"
            >
              <span>Claim Now</span>
              <motion.div
                animate={{ rotate: isHovering ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="ml-2 h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
