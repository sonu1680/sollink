'use client'
import { QrCode } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Method from './method';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRecoilValue } from 'recoil';
import { WalletAtom } from '@/recoil/wallet';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TokenPriceAtom } from '@/recoil/tokenPrice';
import { useSession } from 'next-auth/react';

const Balance = () => {
  const {connection}=useConnection();
    const [balance,setBalance]=useState<number>(0)
  const[sol,setSol]=useState<number>(0);
  const {publickey}=useRecoilValue(WalletAtom);
const tokenPrice=useRecoilValue(TokenPriceAtom)
const {publicKey}=useWallet()
const session=useSession();
const solTousd=()=>{
   connection.getBalance(new PublicKey(publickey!)).then((bal) => {
     const sol = bal / LAMPORTS_PER_SOL;
     setSol(sol);
     setBalance(sol * tokenPrice!);
})
}
useEffect(() => {
  if (session.status == "authenticated" && publickey) solTousd();
}, [session.status, publickey, tokenPrice]);

  return (
    <div className="w-full min-w-[300px] md:p-8 bg-gray-900/30 rounded-sm space-y-5  p-2 ">
      <div className="title  ">Account assest</div>
      <div className="balance w-full  flex flex-row justify-between  ">
        <span className="points font-semibold text-3xl md:text-5xl ">
          ${balance.toFixed(2)}{" "}
          <span className="text-xl md:text-3xl  text-gray-400 ">USD</span>{" "}
        </span>
        <span className="points font-semibold text-3xl md:text-5xl ">
          {sol?.toFixed(2)}{" "}
          <span className="text-xl md:text-3xl  text-gray-400 ">SOL</span>{" "}
        </span>
        <QrCode />
      </div>
      <Method />
    </div>
  );
}

export default Balance