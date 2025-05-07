import React from 'react'
import TipLinkForm from './tip-link-form';
import { useSession } from 'next-auth/react';

const page = () => {



  return (
    <div className='w-full flex flex-col justify-center items-center' >
      <div className="container w-full p-4 md:w-2/6 ">
      <TipLinkForm />
      </div>
    </div>
  );
}

export default page