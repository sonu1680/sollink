"use client";

import React from "react";

import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { SignIn } from "@/components/home/sign-in";
import { TrustSection } from "@/components/home/trust-section";
import { Footer } from "@/components/home/footer";




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
