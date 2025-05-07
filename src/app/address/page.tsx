'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react'
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import bs58 from "bs58";
import nacl from "tweetnacl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddressID from './AddressID';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


type data = {
  privateKey: String;
  publicKey: String;
  count: number;
};

const page = () => {
   const [phrase, setPhrase] = useState<string | null>(null);
   const [address, setAddress] = useState<data[]>([]);
   const [walletCount, setWalletCount] = useState(0);
   const pathIndexRef = useRef<number[]>([]);
  const { toast } = useToast();

   const seedRef = useRef<any>(null);

   const generateWallet = () => {
     const mnemonic = generateMnemonic(128);
     setPhrase(mnemonic);
     seedRef.current = mnemonicToSeedSync(mnemonic);
     localStorage.setItem("mnemonic", JSON.stringify(mnemonic));
     addWallet();
      toast({
        title: "Wallet created!",
      });
   };
   const addWallet = () => {
     const newCount = walletCount + 1;
     derivedAddress(newCount, "addWallet");
     setWalletCount(newCount);
        toast({
          title: "New wallet added!",
        })
   };

   const derivedAddress = (count: number, callBy: string) => {
     const path = `m/44'/501'/${count}'/0'`;
     const derivativeSeed = derivePath(
       path,
       seedRef.current.toString("hex")
     ).key;
     const secret = nacl.sign.keyPair.fromSeed(derivativeSeed).secretKey;
     const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
     const privateKey = bs58.encode(Buffer.from(secret.slice(0, 32)));
     const data = {
       publicKey: publicKey,
       privateKey: privateKey,
       count: count,
     };
     setAddress((prev) => [...prev, data]);
     if (callBy == "addWallet") {
       pathIndexRef.current.push(count);
       localStorage.setItem(
         "walletIndex",
         JSON.stringify(pathIndexRef.current)
       );
     }
   };

   const handleDeleteWallet = (index: number) => {
     const sonu = address;
     const updatedAddress = sonu.filter((item) => item.count !== index);
     pathIndexRef.current = pathIndexRef.current.filter(
       (count) => count !== index
     );
     setAddress(updatedAddress);
     localStorage.setItem("walletIndex", JSON.stringify(pathIndexRef.current));
      toast({
        title: "Wallet deleted!",
      });
   };

   const clearWallet = () => {
     setAddress([]);
     setWalletCount(-1);
     setPhrase(null);
     localStorage.removeItem("mnemonic");
     localStorage.removeItem("walletIndex");
      toast({
        title: "Wallet cleared!",
      });
   };
   useEffect(() => {
     const localMnmenonic = localStorage.getItem("mnemonic");
     const localWalletIndex = localStorage.getItem("walletIndex");
     if (!localWalletIndex) return;
     const index = JSON.parse(localWalletIndex);

     if (localMnmenonic && localWalletIndex) {
       seedRef.current = mnemonicToSeedSync(localMnmenonic);
       setPhrase(JSON.parse(localMnmenonic));
       pathIndexRef.current.push(...index);
       console.log(index.length);
       index.length >= 1
         ? setWalletCount(Math.max(...index))
         : setWalletCount(-1);

       index.forEach((idx: number) => derivedAddress(idx, "storeData"));
     }
   }, []);


  return (
    <div className="w-full bg-background/30 flex justify-center flex-col items-center ">
      {!phrase ? (
        <div className="generateWallet w-full  md:w-5/6  p-2 space-y-4 ">
          <div className="titlle text-3xl md:text-5xl font-bold capitalize">
            Secret recover phrase
          </div>
          <div className="titlle text-lg md:text-xl font-semibold capitalize">
            Save these words in a safe place.
          </div>
          <div className="flex flex-col w-full  items-center space-y-6 ">
            <Input
              type="text"
              placeholder="Enter phrase || Leave blank to generate new"
              onChange={(e) => setPhrase(e.target.value)}
            />
            <Button className="w-full" type="submit" onClick={generateWallet}>
              Generate Wallet
            </Button>
          </div>
        </div>
      ) : (
        <div className="Wallet p-2 w-full md:w-5/6  ">
          <div className="secretPhrase border-2 border-gray-800 p-6 rounded-lg">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-4xl  ">
                  Your Secret Phrase
                </AccordionTrigger>
                {phrase && (
                  <AccordionContent
                    className="w-full cursor-pointer"
                    onClick={() => {navigator.clipboard.writeText(phrase); toast({
                      title: "Copied to clipboard!",
                    });}}
                   
                  >
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 ">
                      {phrase.split(" ").map((word, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800  rounded-lg hover:bg-gray-900  p-4 cursor-pointer transition-all"
                        >
                          {word}
                        </div>
                      ))}
                      <div className="flex flex-row cursor-pointer  space-x-2">
                        <Copy color="#ffffff" />
                        <span>Click Anywhere To Copy</span>
                      </div>
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            </Accordion>
          </div>

          <div className="address  w-full mt-10 ">
            <div className="head w-full flex space-y-4  flex-col md:flex-row justify-between px-4">
              <div className="title w-full md:w-1/2  py-6 ">
                <span className="text-3xl md:text-4xl font-semibold capitalize">
                  solana wallet
                </span>
              </div>
              <div className="button w-full md:w-1/2 space-x-4 md:flex md:flex-row md:justify-end ">
                <Button variant={"default"} onClick={addWallet}>
                  Add Wallet
                </Button>
                <Button variant={"destructive"} onClick={clearWallet}>
                  Clear Wallet
                </Button>
              </div>
            </div>
            {address.map((item, index) => (
              <AddressID
                key={item.count}
                privateKey={item.publicKey}
                publicKey={item.privateKey}
                count={item.count}
                onDelete={handleDeleteWallet}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default page