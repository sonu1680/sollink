"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "motion/react";
import { Lock, Shield, UserCheck } from "lucide-react";

export function TrustSection() {
  const faqItems = [
    {
      question: "How does SolLink ensure the security of my crypto?",
      answer: "SolLink uses advanced encryption and security protocols to protect your assets. We never store your private keys, and all transactions are verified on the blockchain for maximum security."
    },
    {
      question: "Do recipients need a crypto wallet to receive funds?",
      answer: "No, that's the beauty of SolLink! Recipients don't need a crypto wallet to receive funds. They simply click on the link you share and sign in with their Google account to claim the crypto."
    },
    {
      question: "What happens if the recipient doesn't claim the crypto?",
      answer: "If the recipient doesn't claim the crypto within the specified timeframe (default is 7 days), the funds are automatically returned to your wallet, ensuring you never lose your assets."
    },
    {
      question: "What cryptocurrencies does SolLink support?",
      answer: "SolLink currently supports Solana (SOL) and several SPL tokens. We're actively working on expanding to support more cryptocurrencies and chains in the near future."
    },
    {
      question: "Are there any fees for using SolLink?",
      answer: "SolLink charges a small convenience fee for each transaction to cover operational costs. The fee is transparently displayed before you confirm your transaction."
    }
  ];

  return (
    <section id="trust" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
            Built with Trust
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Security You Can Count On</h2>
          <p className="text-lg text-muted-foreground max-w-[800px]">
            SolLink prioritizes the security of your assets with state-of-the-art protection
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {[
            {
              icon: <Shield className="h-8 w-8 text-blue-500" />,
              title: "Advanced Encryption",
              description: "All data is encrypted end-to-end to ensure maximum security for your transactions"
            },
            {
              icon: <Lock className="h-8 w-8 text-purple-500" />,
              title: "Non-Custodial",
              description: "We never store your private keys - you maintain full control of your assets at all times"
            },
            {
              icon: <UserCheck className="h-8 w-8 text-amber-500" />,
              title: "Verified Recipients",
              description: "All recipients are verified through Google Sign-In to prevent unauthorized access"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-card p-6 rounded-xl border border-border"
            >
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="bg-card rounded-xl border">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}