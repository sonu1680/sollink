import { TokenPriceAtom } from "@/recoil/tokenPrice";
import { WalletAtom } from "@/recoil/wallet";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { RefreshCw } from "lucide-react";

const NoToken = () => {
  const { connection } = useConnection();
  const { publickey } = useRecoilValue(WalletAtom);
  const [balance, setBalance] = useState<number | null>(null);
  const [usd, setUsd] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const tokenPrice = useRecoilValue(TokenPriceAtom);

  const fetchBalance = async () => {
    if (publickey) {
      setIsRefreshing(true);
      try {
        const balance = await connection.getBalance(publickey);
        setBalance(balance / LAMPORTS_PER_SOL);

        if (tokenPrice) {
          setUsd((balance / LAMPORTS_PER_SOL) * tokenPrice);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
    // Set up an interval to refresh balance every minute
    const intervalId = setInterval(fetchBalance, 60000);

    return () => clearInterval(intervalId);
  }, [publickey, connection, tokenPrice]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    fetchBalance();
  };

  return (
    <div className="p-3 sm:p-4 md:p-6  text-white">
      <div className="w-full  mx-auto">
        <div className="bg-secondary rounded-xl shadow-lg overflow-hidden hover:bg-black/30 transition-all duration-300">
          {/* Card Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
                  <Image
                    src="/solana.png"
                    height={48}
                    width={48}
                    alt="sol"
                    className="p-1.5 sm:p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-lg text-primary sm:text-xl font-semibold uppercase">
                    Solana
                  </div>
                  <div className="text-xs text-gray-400 font-normal">SOL</div>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                disabled={isRefreshing}
              >
                <RefreshCw
                  size={16}
                  className={`text-white/80 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            <div className="flex flex-col space-y-2">
              {/* Balance Row */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400 uppercase">Balance</div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-semibold">
                    {balance !== null
                      ? `${balance.toFixed(4)} SOL`
                      : "Loading..."}
                  </div>
                </div>
              </div>

              {/* USD Value Row */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400 uppercase">Value</div>
                <div className="text-right">
                  <div className="text-base sm:text-lg text-green-400">
                    {usd !== null ? `$${usd.toFixed(2)} USD` : "Loading..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-4 py-3 bg-black/30 text-center text-xs text-gray-400">
            {publickey ? (
              <span className="truncate block">{publickey.toString()}</span>
            ) : (
              <span>Wallet not connected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoToken;
