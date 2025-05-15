import { useEffect, useState } from "react";
import ClaimCard from "./ClaimCard";
import ClaimOptions from "./ClaimOption";
import { AnimatePresence, motion } from "motion/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { getLink } from "@/app/actions/createLink";
export default function ClaimView({params}:{params:string}) {
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const[balance,setBalance]=useState<any>();
 const { connection } = useConnection();
const [link,setLink]=useState(null)
  const handleStepChange = (newStep: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setIsAnimating(false);
    }, 300);
  };

useEffect(()=>{
   ( async()=> {
     setIsAnimating(true);
     const res = await getLink(params);

     //@ts-ignore
     setLink(res.data);
     //@ts-ignore

     const keypairBytes = bs58.decode(res.data);
     const sender = Keypair.fromSecretKey(keypairBytes);
     const bal = await connection.getBalance(sender.publicKey);
     setBalance(bal);
     setIsAnimating(false);
   })() ;;
},[])

  return (
    <div className="w-full md:w-1/2">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="claim-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ClaimCard balance={balance} onClaim={() => handleStepChange(2)} />
          </motion.div>
        ) : (
          <motion.div
            key="claim-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {link && (
              <ClaimOptions
                params={link}
                balance={balance}
                onBack={() => handleStepChange(1)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
