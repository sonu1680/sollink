"use client";
import React from "react";

import { useParams } from "next/navigation";
import ClaimView from "@/components/claimModal/ClaimView";

const page = () => {
  const params = useParams();


  return (
    <div className="w-full p-2 flex justify-center items-center">
      <ClaimView params={String(params.id)} />
    </div>
  );
};

export default page;
