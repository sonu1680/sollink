"use client";

import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Wallet, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Connect & Send",
      description: "Connect your wallet, decide how much crypto to send, and generate a secure link.",
      icon: <Wallet className="h-8 w-8" />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Share Link",
      description: "Share the generated link with anyone - they don't need a crypto wallet to receive funds.",
      icon: <Link className="h-8 w-8" />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "One-Click Claim",
      description: "Recipients visit the link and sign in with Google to claim their crypto instantly.",
      icon: <Zap className="h-8 w-8" />,
      color: "from-amber-500 to-amber-700",
    },
  ];

  const parentVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
            Easy Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How SolLink Works</h2>
          <p className="text-lg text-muted-foreground max-w-[800px]">
            SolLink simplifies sending crypto to non-crypto users through these three easy steps
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-3 mt-8"
          variants={parentVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={childVariants} className="flex">
              <Card className="w-full group hover:shadow-lg transition-all duration-200 overflow-hidden border border-border">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br text-white shadow-sm border border-white/10 dark:border-white/5"
                    style={{
                      background: `linear-gradient(to bottom right, var(--${index === 0 ? 'blue' : index === 1 ? 'purple' : 'amber'}-500), var(--${index === 0 ? 'blue' : index === 1 ? 'purple' : 'amber'}-600))`
                    }}
                  >
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    Step {index + 1}: {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 p-6 md:p-8 bg-muted rounded-xl border relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Why Choose SolLink?</h3>
            <p className="text-muted-foreground mb-6">
              SolLink is built to simplify the crypto experience for everyone, especially for those who are new to the world of Web3.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "No recipient wallet required",
                "Simple and secure onboarding",
                "Fast and reliable transactions",
                "Perfect for crypto beginners",
              ].map((feature) => (
                <div key={feature} className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}