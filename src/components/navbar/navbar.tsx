"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { Button } from "@/components/ui/button";
import { LayoutGroup } from "motion/react";
import MobileMenu from "./mobile-menu";
import { Switch } from "../ui/switch";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const WalletButton=dynamic(()=>import('../WalletButtons'))
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, theme } = useTheme();
const session=useSession()
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        scrolled
          ? "h-16 bg-background/80 backdrop-blur-md shadow-sm"
          : "h-20 bg-transparent"
      )}
    >
      <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-xl transition-colors hover:text-primary"
        >
          SolLink
        </Link>

        <div className="flex items-center gap-2">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />

          <WalletButton />
          {session.status == "authenticated" ? (
            <div className="flex flex-row gap-2 justify-between items-center bg-secondary px-2 rounded-sm ">
              <Image
                src={session.data.user?.image || ""}
                height={30}
                width={30}
                alt={"img"}
                className="rounded-full"
              />
              <MobileMenu />
            </div>
          ) : (
            <Button
              className="bg-secondary"
              onClick={async () => await signIn()}
            >
              <FcGoogle className="w-12 h-12 " />

              <span className="font-bold text-primary ">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
