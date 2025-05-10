"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCode({ value, size = 256, className }: QRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && qrRef.current) {
      const generateQR = async () => {
        const QRCodeStyling = (await import("qr-code-styling")).default;

        const qrCode = new QRCodeStyling({
          
          width: size,
          height: size,
          type: "svg",
          data: value,
          dotsOptions: {
            color: "#0284c7", // Blue color for dots
            type: "rounded",
          },
          cornersSquareOptions: {
            color: "#0284c7",
            type: "extra-rounded",
          },
          cornersDotOptions: {
            color: "#0284c7",
            type: "dot",
          },
          backgroundOptions: {
            color: "#ffffff",
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
          },
        });

        qrRef.current!.innerHTML = "";
        qrCode.append(qrRef.current!);
      };

      generateQR();
    }
  }, [value, size]);

  return <div ref={qrRef} className={cn("mx-auto", className)} />;
}
