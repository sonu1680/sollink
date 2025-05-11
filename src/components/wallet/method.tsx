import React, { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ReceivePaymentQr from "../ReceivePaymentQr";
import { useRecoilValue } from "recoil";
import { WalletAtom } from "@/recoil/wallet";
import Dialogs from "@/app/wallet/Dialogs";

const options = [
  { title: "send/pay", icon: "Send", link: "" },
  { title: "Receiver", icon: "ArrowDown", link: "" },
  { title: "Share Link", icon: "Link", link: "create" },
];

const Method = () => {
  const {publickey}=useRecoilValue(WalletAtom);
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
const link = publickey?.toBase58();
  const handleClick = (option: (typeof options)[number]) => {
    if (option.title.toLowerCase() === "receiver") {
      setShowQR(true);
    } else if (option.link) {
      router.push(option.link);
    }

    if(option.title=="send/pay"){
      setShowDialog(true);
  };
  }
  return (
    <div className="flex flex-row gap-4 w-full">
      <Dialogs onClose={()=>setShowDialog(false)} open={showDialog} />
      <ReceivePaymentQr
        link={link || ""}
        open={showQR}
        onClose={() => setShowQR(false)}
      />

      {options.map((option, idx) => {
        const Icon = Icons[option.icon as keyof typeof Icons] as LucideIcon;

        return (
          <div
            key={idx}
            onClick={() => handleClick(option)}
            className="flex w-full cursor-pointer items-center justify-evenly flex-col space-y-2"
          >
            <span className="w-14 h-14 rounded-full bg-gray-900 flex justify-center items-center">
              <Icon className="w-5 h-5 text-blue-500" />
            </span>
            <span className="capitalize text-xs sm:text-sm font-medium">
              {option.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Method;
