"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ArrowRight, Facebook, Github, Instagram, Link, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Security", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Roadmap", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Support", href: "#" },
        { label: "API", href: "#" },
        { label: "Community", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Licenses", href: "#" },
      ],
    },
  ];
  
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-bold text-2xl mb-4">
              <span className="relative">
                <Link className="h-6 w-6 mr-1 inline-block" />SolLink
              </span>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              SolLink simplifies crypto transfers, making it easy to send cryptocurrency to anyone, even if they don't have a wallet.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:hello@sollink.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@sollink.com
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="font-medium">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SolLink. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Status
            </Button>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Documentation <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}