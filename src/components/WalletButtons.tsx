"use client";

import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import LocalWalletCreate from "./wallet/LocalWalletCreate";


const WalletButtons = () => {

  return (
    <div>
      <WalletMultiButton />
      <LocalWalletCreate />
      {/* <WalletDisconnectButton /> */}
    </div>
  );
};

export default WalletButtons;
