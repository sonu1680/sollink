'use client'
import React from 'react'
import {ConnectionProvider,WalletProvider} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
 
} from "@solana/wallet-adapter-react-ui";
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import TokenpriceApi from './TokenpriceApi';
const Provider = ({children}:any) => {
  
  return (
    <SessionProvider>
      <RecoilRoot>
        <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <TokenpriceApi />

              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default Provider