"use client";
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
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import AssetSelector from "./asset-selector";
import FundAccountSelect from "./fundAccount-select";
import CreatedTipLinkModal from "@/components/linkmodal/created-tiplink-moda";
import { AlertDialogs } from "@/components/AlertDialogs";
import { useSolLinkForm } from "@/hooks/useSolLinkForm";

export default function TipLinkForm() {
const {
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
} = useSolLinkForm();

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
              onChange={(e)=>handleAmountChange(e?.target.value)}
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
