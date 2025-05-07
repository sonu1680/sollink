"use client";
import React, { useEffect } from "react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import bs58 from "bs58";
import ClaimView from "@/components/claimModal/ClaimView";

const page = () => {
  const params = useParams();
  const privateKeyEncoded = params.id as string;
  const wallet = useWallet();
  const { connection } = useConnection();

  const sendTransaction = async () => {
    try {
      if (!wallet.publicKey) {
        console.warn("Wallet not connected");
        return;
      }
      const keypairBytes = bs58.decode(
        params.id.toString()
      );
      const sender = Keypair.fromSecretKey(keypairBytes);
      const receiver = wallet.publicKey;
      console.log(receiver,sender)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: receiver,
          lamports: 0.01 * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
      );

       console.log("✅ Transaction signature:",signature);
    } catch (err) {
      console.error("❌ Transaction failed:", err);
    }
  };

  useEffect(() => {
    if (wallet.connected && connection) {
      // sendTransaction();
    }
  }, [wallet.connected, privateKeyEncoded]);

  return (
    <div className="w-full p-2 flex justify-center items-center">
      <ClaimView params={String(params.id)} />
    </div>
  );
};

export default page;
