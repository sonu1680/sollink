import Balance from '@/components/wallet/balance'
import React from 'react'

const page = () => {
  return (
 <div className="main w-full  ">
      <div className="contaner w-full flex flex-col  justify-center items-center  ">

        <div className="wallet w-full p-2 md:w-3/6 ">
          <Balance />
        </div>
        {/* <div className="wallet w-full p-2 md:w-3/6 ">
          <TokenContainer />
        </div> */}
      </div>
    </div>
      )
}

export default page