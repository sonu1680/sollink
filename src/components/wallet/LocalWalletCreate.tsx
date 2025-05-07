import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import bs58 from 'bs58'
import {Keypair} from "@solana/web3.js"
import { useSetRecoilState } from 'recoil'
import { WalletAtom } from '@/recoil/wallet'

const LocalWalletCreate = () => {
const session=useSession();
const localWallet=useSetRecoilState(WalletAtom)
useEffect(()=>{
if (session.status == "authenticated") {
const secretKey58 = JSON.parse(session.data.user.keypair); 
const secretKey = bs58.decode(secretKey58); 

const walletKey = Keypair.fromSecretKey(secretKey); 

const publicKey = walletKey.publicKey; 
const privateKey = Array.from(secretKey.slice(0, 32)); 

localWallet({ publickey: publicKey, privatekey: privateKey });

}
},[])

  return null
}

export default LocalWalletCreate