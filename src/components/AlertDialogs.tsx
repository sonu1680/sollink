import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  balance: string;
  balanceUsd: string;
};

export const AlertDialogs = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  balance,
  balanceUsd,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>

          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Amount (USD):</span>
              <span>{balanceUsd}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-medium">Amount (Solana):</span>
              <span>{balance}</span>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogs;
