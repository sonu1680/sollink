"use client";

import React, { useState } from "react";
import Balance from "@/components/wallet/balance";
import TokenContainer from "@/components/token/TokenContainer";
import ReceivePaymentQr from "@/components/ReceivePaymentQr";
import { Dialog, DialogContent } from "@/components/ui/dialog";



const Page = () => {
  
  return (
    <div className="main w-full  ">
      <div className="contaner w-full flex flex-col  justify-center items-center  ">
        {/* <Dialog open={true}>
          <DialogContent className="w-full p-4">
          </DialogContent>
        </Dialog> */}
        <div className="wallet w-full p-2 md:w-3/6 ">
          <Balance />
        </div>
        <div className="wallet w-full p-2 md:w-3/6 ">
          <TokenContainer />
        </div>
      </div>
    </div>
  );
};

export default Page;
