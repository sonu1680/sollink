import { PublicKey } from '@solana/web3.js';
import recoil, { atom } from 'recoil';

type wallet={
publickey:PublicKey|null,
privatekey:Uint8Array|null
}
export const WalletAtom=atom<wallet>({
    key:"walletAtom",
    default:{publickey:null,privatekey:null}
})
