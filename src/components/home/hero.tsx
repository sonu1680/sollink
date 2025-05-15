
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Send } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function Hero() {
  const session=useSession();
  const router=useRouter()
  const{publicKey}=useWallet()
  
  const redirectPage = () => {
    if (session.status == "authenticated") {
      router.replace("/wallet");
    } else if (publicKey) {
      router.replace("/create");
    } else {
      toast({
        title: "Please connect wallet or login with google to continue!",
        variant: "destructive",
      });
    }
  };
  useEffect(()=>{

    redirectPage();
  },[session,publicKey])


  return (
    <section id="home" className="relative overflow-hidden pt-28  pb-16 md:pb-24">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <motion.div 
              className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4 w-fit"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Web3 Made Simple
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="inline-block">Send Crypto With Just </span>
              <motion.span 
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                A Shareable Link
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-[600px] mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              SolLink enables you to send cryptocurrency via a simple link — no wallet required for recipients. Perfect for introducing friends and family to crypto.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Button size="lg" className="rounded-full" onClick={redirectPage}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                How It Works
              </Button>
            </motion.div>
            
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[380px] md:h-[480px] rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950/30 dark:to-purple-900/30 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-white dark:bg-black/80 rounded-xl shadow-xl p-6 w-[300px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Send className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-semibold">Send Crypto</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Step 1/2</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Amount</label>
                      <div className="flex items-center border rounded-lg p-2">
                        <span className="font-mono">0.05 SOL</span>
                        <span className="text-muted-foreground text-sm ml-2">≈ $5.00</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Generated Link</label>
                      <div className="flex items-center justify-between border rounded-lg p-2 bg-muted">
                        <span className="text-sm truncate">sollink.com/claim/x8w92...</span>
                        <Button variant="ghost" size="sm">Copy</Button>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full">Share Link</Button>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}