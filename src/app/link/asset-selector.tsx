"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import { Asset } from "@/lib/types";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const assets: Asset[] = [
  {
    symbol: "SOL",
    name: "Solana",
    balance: 0.003,
    balanceUsd: 0.38,
    icon: "/images/sol-icon.png",
  },

  //   {
  //     symbol: "ETH",
  //     name: "Ethereum",
  //     balance: 0.0002,
  //     balanceUsd: 0.42,
  //     icon: "/images/eth-icon.png",
  //   },
  //   {
  //     symbol: "BTC",
  //     name: "Bitcoin",
  //     balance: 0.00001,
  //     balanceUsd: 0.45,
  //     icon: "/images/btc-icon.png",
  //   },
  //   {
  //     symbol: "USDC",
  //     name: "USD Coin",
  //     balance: 0.54,
  //     balanceUsd: 0.54,
  //     icon: "/images/usdc-icon.png",
  //   },
];

interface AssetSelectorProps {
  selectedAsset: Asset;
  onAssetChange: (asset: Asset) => void;
}

export default function AssetSelector({
  selectedAsset,
  onAssetChange,
}: AssetSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 px-4 py-6 bg-background/50 hover:bg-background/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30 rounded-full" />
              {selectedAsset.icon && (
                <Image
                  src="/images/sol-icon.png"
                  alt={selectedAsset.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
            </div>
            <span className="font-medium">{selectedAsset.symbol}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="w-full">
          <CommandInput placeholder="Search assets..." />
          <CommandEmpty>No assets found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {assets.map((asset) => (
              <CommandItem
                key={asset.symbol}
                value={asset.symbol}
                onSelect={() => {
                  onAssetChange(asset);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer"
              >
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30 rounded-full" />
                  {asset.icon && (
                    <Image
                      src="/images/sol-icon.png"
                      alt={asset.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                </div>
                <span>{asset.symbol}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {asset.balance} (${asset.balanceUsd})
                </span>
                {asset.symbol === selectedAsset.symbol && (
                  <Check className="ml-2 h-4 w-4 text-primary" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
