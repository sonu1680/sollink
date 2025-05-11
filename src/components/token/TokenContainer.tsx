"use client"
import React, { useEffect, useState } from 'react'
import NFT from './NFT';
import NoToken from './NoToken';
import NoActivity from './NoActivity';
import { useConnection } from '@solana/wallet-adapter-react';
import { useRecoilValue } from 'recoil';
import { WalletAtom } from '@/recoil/wallet';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';


const data = [{ title: "tokens" }, { title: "NFT" }  ,  {title:'activity'}
];

const TokenContainer = () => {
    const [activeIndex, setActiveIndex] =useState(0);

  return (
    <div className="w-full min-w-[300px] md:p-8  rounded-sm p-2 ">
      <div className="navigation flex flex-row gap-x-4  ">
        {data.map((item, index) => (
          <div
            className={` cursor-pointer border-2 border-transparent capitalize ${
              activeIndex == index ? "  border-b-foreground" : null
            }`}
            key={index}
            onClick={() => setActiveIndex(index)}
          >
            {item.title}
          </div>
        ))}
      </div>
      {activeIndex == 0 ? (
        <NoToken />
      ) : activeIndex == 1 ? (
        <NFT />
      ) : (
        <NoActivity />
      )}
    </div>
  );
}

export default TokenContainer