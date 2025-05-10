"use client"
import React, { useState } from 'react'
import NFT from './NFT';
import NoToken from './NoToken';
import NoActivity from './NoActivity';


const data = [{ title: "tokens" }, { title: "NFT" }  ,  {title:'activity'}
];
const TokenContainer = () => {
    const [activeIndex, setActiveIndex] =useState(0);
  return (
    <div className="w-full min-w-[300px] md:p-8 bg-primary-foreground rounded-sm p-2 ">
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