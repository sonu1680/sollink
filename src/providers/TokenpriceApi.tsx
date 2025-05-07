import { TokenPriceAtom } from '@/recoil/tokenPrice';
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';


const TokenpriceApi = () => {
    const tokenPrice = useSetRecoilState(TokenPriceAtom);

    const getTokenPrice = async () => {
      try {
        const response = await fetch(
          "https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=SOL",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        const price = data.data[0].prices[0].value;
        tokenPrice(parseFloat(price));
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };

    useEffect(() => {
      getTokenPrice();
    }, []);

  return (
null  )
}

export default TokenpriceApi