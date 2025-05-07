'use client'
import { Eye, EyeOff, Trash } from 'lucide-react';
import React, { useState } from 'react'
type data = {
  privateKey: String;
  publicKey: String;
  count: number;
  onDelete: (index:number) => void;
};

const AddressID = ({
  privateKey,
  publicKey,
  count,
  onDelete,
}: data) => {
  const [hide, setHide] = useState<boolean>(true);
  
  return (
    <div className="conatiner w-full mt-4   rounded-xl border-2 border-gray-800 ">
      <div className="head flex justify-between py-4">
        <div className="name text-3xl md:text-4xl font-semibold capitalize px-6 py-4">
          wallet{count}
        </div>
        <div className="delete pr-4 cursor-pointer  " onClick={() => onDelete(count)}>
          <Trash color="#ff0000" />
        </div>
      </div>
      <div className="keypair rounded-xl bg-gray-800/50 p-2  px-6 space-y-8">
        <div className="publickey flex flex-col ">
          <span className="title capitalize font-semibold text-xl  ">
            publicKey
          </span>
          <span className="key text-lg  overflow-hidden text-ellipsis font-thin whitespace-nowrap ">
            {publicKey}
          </span>
        </div>
        <div className="privateKey flex flex-col  ">
          <span className="title capitalize font-semibold text-xl ">
            privateKey
          </span>
          <div className="flex justify-between font-thin ">
            <span className="key text-lg  overflow-hidden text-ellipsis whitespace-nowrap ">
              {hide ? privateKey : "••••••••••••••••••••••••••••••••••••••••••"}
            </span>
            <span className="hide cursor-pointer ">
              {hide ? (
                <EyeOff onClick={() => setHide(false)} />
              ) : (
                <Eye onClick={() => setHide(true)} />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressID