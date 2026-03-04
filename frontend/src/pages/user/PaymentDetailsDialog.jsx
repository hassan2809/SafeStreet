import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, AlertCircle } from "lucide-react";

const PaymentDetailsDialog = ({
  isOpen,
  onOpenChange,
  onPaymentSubmit,
  isSubmitting = false,
  existingPaymentDetails = null,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      accountName: "",
      bsb: "",
      accountNumber: "",
    },
  });

  const formatBSB = (value) => {
    // Remove all non-digits and limit to 6 digits
    const digits = value.replace(/\D/g, "").substring(0, 6);
    // Add hyphen after 3rd digit
    if (digits.length > 3) {
      return `${digits.substring(0, 3)}-${digits.substring(3)}`;
    }
    return digits;
  };

  const onSubmit = (data) => {
    // Clean BSB before submitting (remove hyphen)
    const cleanedData = {
      ...data,
      bsb: data.bsb.replace(/\D/g, ""),
    };
    onPaymentSubmit(cleanedData);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // Set existing payment details when dialog opens or when existingPaymentDetails changes
  useEffect(() => {
    if (isOpen && existingPaymentDetails?.data) {
      const { accountName, bsb, accountNumber } = existingPaymentDetails.data;
      reset({
        accountName: accountName || "",
        bsb: bsb ? formatBSB(bsb) : "",
        accountNumber: accountNumber || "",
      });
    } else if (isOpen && !existingPaymentDetails) {
      // Reset to empty values if no existing data
      reset({
        accountName: "",
        bsb: "",
        accountNumber: "",
      });
    }
  }, [isOpen, existingPaymentDetails, reset]);

  const isEditing = existingPaymentDetails && existingPaymentDetails.data;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            {isEditing ? "Update Payment Details" : "Add Payment Details"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your payment details below. These will be used for future compensation payments."
              : "Please enter your payment details. These will be securely saved to your profile and used for future payments."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Controller
              name="accountName"
              control={control}
              rules={{
                required: "Account Name is required",
                minLength: {
                  value: 2,
                  message: "Account Name must be at least 2 characters",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="accountName"
                  type="text"
                  placeholder="Enter your account name"
                  className={errors.accountName ? "border-red-300" : ""}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.accountName && (
              <p className="text-sm text-red-600">{errors.accountName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bsb">BSB</Label>
            <Controller
              name="bsb"
              control={control}
              rules={{
                required: "BSB is required",
                validate: (value) => {
                  const digits = value.replace(/\D/g, "");
                  return digits.length === 6 || "BSB must be 6 digits";
                },
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  id="bsb"
                  type="text"
                  placeholder="123-456"
                  value={value}
                  onChange={(e) => onChange(formatBSB(e.target.value))}
                  className={errors.bsb ? "border-red-300" : ""}
                  disabled={isSubmitting}
                  maxLength={7}
                />
              )}
            />
            {errors.bsb && (
              <p className="text-sm text-red-600">{errors.bsb.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Controller
              name="accountNumber"
              control={control}
              rules={{
                required: "Account number is required",
                validate: (value) => {
                  const digits = value.replace(/\D/g, "");
                  return (
                    (digits.length >= 4 && digits.length <= 10) ||
                    "Account number must be 4-10 digits"
                  );
                },
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  id="accountNumber"
                  type="text"
                  placeholder="Enter your account number"
                  value={value}
                  onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
                  className={errors.accountNumber ? "border-red-300" : ""}
                  disabled={isSubmitting}
                  maxLength={10}
                />
              )}
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-600">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please correct the errors above to continue.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Details" : "Save Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsDialog;