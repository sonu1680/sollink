import { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
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

interface ClaimCardProps {
  onClaim: () => void;
  balance:number
}

export default function ClaimCard({ onClaim ,balance}: ClaimCardProps) {
  const [isHovering, setIsHovering] = useState(false);
const tokenPrice=useRecoilValue(TokenPriceAtom);


  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
        Here is <span className="text-indigo-600">${((Number(balance) / LAMPORTS_PER_SOL)*tokenPrice!).toFixed(0)}</span> in crypto!
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Claim your free Solana tokens below
      </p>

      <Card className="relative overflow-hidden border-none shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/20 z-0" />

        <CardHeader className="relative z-10 pb-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-1">
              <div className="bg-white h-5 w-5 rounded-full flex items-center justify-center">
                <div className="bg-teal-400 h-3 w-3 rounded-full"></div>
              </div>
            </div>
            <span className="text-gray-600 font-medium">Solana Balance</span>

            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Report Issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-4">
          <div className="mb-1 flex items-baseline">
            <span className="text-6xl font-bold text-gray-900 tracking-tight">
              {Number(balance) / LAMPORTS_PER_SOL}
            </span>
            <span className="text-4xl text-gray-500 ml-2 font-medium">SOL</span>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex gap-1 items-center text-gray-600">
              ≈{" "}
              <span className="font-medium">
                ${((Number(balance) / LAMPORTS_PER_SOL)*tokenPrice!).toFixed(2)} price
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

