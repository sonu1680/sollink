import { PublicKey } from '@solana/web3.js';
import recoil, { atom } from 'recoil';

type wallet={
publickey:PublicKey|null,
privatekey:number[]|null
}
export const WalletAtom=atom<wallet>({
    key:"walletAtom",
    default:{publickey:null,privatekey:null}
})
