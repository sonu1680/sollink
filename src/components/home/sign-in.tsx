"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { ExternalLink, Send, Wallet } from "lucide-react";

export function SignIn() {
  return (
    <section id="sign-in" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              Get Started
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Send Your First Crypto Link?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're new to crypto or a seasoned pro, SolLink makes it easy to share crypto with anyone, even if they don't have a wallet.
            </p>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {[
                {
                  title: "Connect with Google",
                  description: "Use your Google account for a seamless experience",
                  icon: <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">G</span>,
                },
                {
                  title: "Connect Your Wallet",
                  description: "Securely connect to send crypto via shareable links",
                  icon: <Wallet className="h-6 w-6 text-blue-500" />,
                },
                {
                  title: "Start Sending",
                  description: "Generate links and share with friends and family",
                  icon: <Send className="h-6 w-6 text-green-500" />,
                },
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.4 }}
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-muted">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl -z-10 transform -rotate-2" />
            <Card className="border border-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center py-6">
                  <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                    <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sign In to SolLink</h3>
                  <p className="text-muted-foreground mb-8 max-w-[320px]">
                    Connect with your preferred method to start sending crypto via shareable links
                  </p>
                  
                  <div className="space-y-4 w-full max-w-[320px]">
                    <Button className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 dark:bg-white/90 dark:text-black dark:hover:bg-white/80 border border-gray-200 dark:border-white/20">
                      <span className="text-xl font-medium">G</span>
                      <span>Continue with Google</span>
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs text-muted-foreground">
                        <span className="bg-card px-2">or</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Wallet className="h-5 w-5" />
                      <span>Connect Wallet</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-8">
                    By continuing, you agree to the SolLink Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}