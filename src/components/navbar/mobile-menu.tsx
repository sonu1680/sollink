"use client";

import { useState } from "react";
import { LogOut, Menu, Settings, Unlink, Wallet } from "lucide-react";
import { NavLinks } from "./nav-links";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import WalletButtons from "../WalletButtons";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle Menu"
        onClick={toggleMenu}
        className="relative z-50"
      >
        <div className="flex h-5 w-6 flex-col justify-between">
          <span
            className={cn(
              "h-[2px] w-full bg-foreground transition-all duration-300",
              isOpen && "translate-y-[9px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-[2px] w-full bg-foreground transition-all duration-300",
              isOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "h-[2px] w-full bg-foreground transition-all duration-300",
              isOpen && "translate-y-[-9px] -rotate-45"
            )}
          />
        </div>
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-full md:max-w-md bg-background p-6 shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex w-full h-full flex-col justify-between">
          <div className="mt-12">
            {session.data?.user && (
              <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={session.data.user?.image || ""}
                      alt={session.data.user.name || "User"}
                    />
                    <AvatarFallback>
                      {session.data.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.data.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.data.user.email}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="container flex flex-row justify-evenly items-center">
              <Button>
                <Wallet />
                wallet address
              </Button>
              <Button>
                <Unlink />
                crowd funding link
              </Button>
            </div>
            <div className="walletid w-full p-2 flex justify-center items-center mt-2 ">
              <WalletButtons></WalletButtons>
            </div>

            {/* <NavLinks mobile onClick={() => setIsOpen(false)} /> */}
          </div>

          <div className="py-4">
            <Button
              className="w-full bg-destructive text-primary-foreground hover:bg-destructive/90"
              size="lg"
              onClick={async () => {
                await signOut();
                toast({ title: "logout" });
              }}
            >
              <LogOut />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
