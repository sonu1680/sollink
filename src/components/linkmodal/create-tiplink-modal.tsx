"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Loader2, ArrowRightIcon, CheckIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreatedTipLinkModal from "./created-tiplink-moda";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTipLinkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTipLinkModal({
  open,
  onClose,
}: CreateTipLinkModalProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [tipLinkCreated, setTipLinkCreated] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      currency: "SOL",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setStep("processing");

    // Simulate API call to create TipLink
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onClose();
        setTipLinkCreated(true);
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    // Reset form on close
    setTimeout(() => {
      form.reset();
      setStep("form");
    }, 300);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a TipLink</DialogTitle>
            <DialogDescription>
              Set an amount to share via a secure link
            </DialogDescription>
          </DialogHeader>

          {step === "form" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="0.001"
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            {...field}
                          />
                          <Select
                            value={form.watch("currency")}
                            onValueChange={(value) =>
                              form.setValue("currency", value)
                            }
                            defaultValue="SOL"
                          >
                            <SelectTrigger className="w-[90px]">
                              <SelectValue placeholder="SOL" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SOL">SOL</SelectItem>
                              <SelectItem value="ETH">ETH</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Estimated value:{" "}
                        {form.watch("amount") &&
                        !isNaN(parseFloat(form.watch("amount")))
                          ? `~$${(
                              parseFloat(form.watch("amount")) * 150
                            ).toFixed(2)} USD`
                          : "$0.00 USD"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create SolLink
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
              <p className="text-muted-foreground text-center">
                Creating your SolLink...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-center font-medium">
                SolLink created successfully!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

   
    </>
  );
}
