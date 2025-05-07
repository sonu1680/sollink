import React, { useState } from 'react'
import QRCode from './ui/qrcode';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CheckIcon, Copy } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';

type props = {
  link:string,
  open:boolean,

  onClose:()=>void
};
const ReceivePaymentQr = ({ link, open, onClose }:props) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Scan below to to receive payment!
          </p>

          <div className="bg-muted/30 p-4 rounded-lg">
            <QRCode value={link} className="max-w-[240px] mx-auto" />
          </div>

          <div className="flex gap-2 items-center bg-muted/50 p-2 rounded-md">
            <Input
              value={link}
              readOnly
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className={cn(
                "h-8 w-8",
                copied ? "text-green-500" : "text-muted-foreground"
              )}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceivePaymentQr