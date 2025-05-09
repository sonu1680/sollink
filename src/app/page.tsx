"use client";

import React, { useEffect, useState } from "react";
import Balance from "@/components/wallet/balance";
import TokenContainer from "@/components/token/TokenContainer";
import ReceivePaymentQr from "@/components/ReceivePaymentQr";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { SignIn } from "@/components/home/sign-in";
import { TrustSection } from "@/components/home/trust-section";
import { Footer } from "@/components/home/footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";




const Page = () => {

  return (
  
    <main className="flex min-h-screen flex-col">
      <Hero />
      <HowItWorks />
      <SignIn />
      <TrustSection />
      <Footer />
    </main>
  );
};

export default Page;
