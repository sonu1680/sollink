import { atom } from "recoil"

export const TokenPriceAtom = atom<number|null>({
  key: "TokenPriceAtom",
  default: null,
});