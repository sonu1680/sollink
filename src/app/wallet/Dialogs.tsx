import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useRecoilValue } from "recoil";
import { WalletAtom } from "@/recoil/wallet";
import { toast } from "@/hooks/use-toast";
import { RefreshCcw } from "lucide-react";

export const Dialogs = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {


const[addres,setAddress]=useState<string|null>(null);
const [amount, setAmount] = useState<number>(0);
const [balance, setBalance] = useState<number>(0);
const[loading,setLoading]=useState<boolean>(false)
const {connection}=useConnection()
const {privatekey,publickey}=useRecoilValue(WalletAtom)
const initTrx=async()=>{


if(addres && amount){
    setLoading(true)
  try {
    const sender = Keypair.fromSecretKey(privatekey as Uint8Array);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: new PublicKey(addres),
        lamports: amount * LAMPORTS_PER_SOL - 6000,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);
    setLoading(false);
    onClose();
    toast({
      title: "Transaction Sucess",
      description: signature,
    });
  } catch (error) {
    console.log(error)
    setLoading(false);
    toast({
        title: "Transaction Failed!",
        description:"Something went wrong!"
    })

    
  }
    
}
}


useEffect(()=>{
    const getBalance = async () => {
      if (publickey) {
        const balance = await connection.getBalance(publickey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };
    getBalance();
},[open])
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Solana</DialogTitle>
          <DialogDescription>
            Available SOL : {balance.toFixed(5)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Wallet Address
            </label>
            <Input
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={addres || ""}
              placeholder="Enter wallet address"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <Input
              id="amount"
              onChange={(e) => setAmount(e.target.value as unknown as number)}
              placeholder="Amount in SOL"
              type="number"
              value={amount || ""}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={initTrx}>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCcw className="animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Dialogs;
