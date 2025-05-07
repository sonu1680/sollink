import { PublicKey } from "@solana/web3.js";

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  balanceUsd: number;
  icon: string;
  key?:PublicKey

}


export interface AssetAccount {
  name: string;
 
  icon: string;
}

