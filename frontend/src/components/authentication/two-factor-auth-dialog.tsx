"use client";

import { saveCredentialsToBrowserStorage } from "@/lib/browser-storage";
import { fetchUserData } from "@/lib/store/features/user/userSlice";
import {
  verifyExistingUserAndSendOTPService,
  verifyNewUserAndSendOTPService,
  verifyOTPAndSignInUserService,
  verifyOTPAndSignUpUserService,
} from "@/services/auth.service";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import Timer from "../ui/common/timer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

type FlowType = "signin" | "signup";

type TwoFactorAuthDialogProps = {
  isTwoFactorAuthenticationDialogOpen: boolean;
  onCloseTwoFactorAuthenticationDialog: () => void;
  credentials: any;
  flow: FlowType;
};

const TwoFactorAuthDialog = ({
  isTwoFactorAuthenticationDialogOpen,
  onCloseTwoFactorAuthenticationDialog,
  credentials,
  flow,
}: TwoFactorAuthDialogProps) => {
  const [disableResendOTP, setDisableResendOTP] = useState(true);
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(60);
  const [otpError, setOtpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();
  const { toast } = useToast();

  const handleTimerEnd = () => {
    setDisableResendOTP(false);
  };

  const onConfirmOTP = async () => {
    const payload = { userDetails: { ...credentials }, otp };
    try {
      setIsSubmitting(true);
      if (flow == "signup") {
        const {
          data: { accessToken, refreshToken, user },
        } = await verifyOTPAndSignUpUserService(payload);
        saveCredentialsToBrowserStorage(accessToken, refreshToken, user?._id);
        dispatch(fetchUserData());
        router.push("/onboarding");
      } else {
        const {
          data: { accessToken, refreshToken, user },
        } = await verifyOTPAndSignInUserService(payload);
        saveCredentialsToBrowserStorage(accessToken, refreshToken, user?._id);
        dispatch(fetchUserData());
        if (user?.isOnboardingComplete) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (error: any) {
      setOtpError(
        error?.data?.errorData ??
          "Something went wrong with our servers, please try again later."
      );
      toast({
        variant: "destructive",
        title: "OTP Verification failed",
        description:
          error?.data?.errorData ??
          "Something went wrong with our servers, please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetValues = () => {
    setDisableResendOTP(true);
    setTime(60);
    setOtpError("");
    setOtp("");
  };
  const onResendOTP = async () => {
    try {
      setIsResendingOTP(true);

      const payload = { userDetails: credentials };

      if (flow == "signup") {
        await verifyNewUserAndSendOTPService(payload);
      } else {
        await verifyExistingUserAndSendOTPService(payload);
      }
      toast({
        variant: "default",
        title: "OTP Resent to your inbox",
        description: `We've re-sent One Time Password to ${credentials.email}`,
      });
      resetValues();
    } catch (error: any) {
      console.error(error, "logged error");
      toast({
        variant: "destructive",
        title: "Unable to send otp",
        description:
          error?.errorData ??
          "Uh oh! Something is wrong with our server, please try again later.",
      });
    } finally {
      setIsResendingOTP(false);
    }
  };

  const onOTPChange = (otp: any) => {
    setOtp(otp);
    if (otpError) {
      setOtpError("");
    }
  };

  return (
    <Dialog
      open={isTwoFactorAuthenticationDialogOpen}
      onOpenChange={onCloseTwoFactorAuthenticationDialog}
    >
      <DialogContent>
        <DialogDescription />

        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
        </DialogHeader>

        <div className="text-sm">We have sent OTP to {credentials.email}</div>

        <InputOTP
          value={otp}
          onChange={(otp: any) => onOTPChange(otp)}
          maxLength={6}
          className="mb-10"
        >
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <InputOTPGroup key={i}>
                <InputOTPSlot index={i} />
                {i == 2 ? <InputOTPSeparator /> : null}
              </InputOTPGroup>
            ))}
        </InputOTP>

        {otpError ? (
          <div className="text-xs font-medium text-destructive">{otpError}</div>
        ) : null}

        <div className="text-sm mt-1">
          {disableResendOTP ? (
            <div>
              Resend OTP in{" "}
              <Timer
                showHours={false}
                showMinutes={true}
                showSeconds={true}
                onTimerEnd={handleTimerEnd}
                time={time}
                setTime={setTime}
              />
            </div>
          ) : null}
        </div>

        <DialogFooter className="mt-4">
          {!disableResendOTP ? (
            <Button
              type="button"
              disabled={isResendingOTP}
              variant="ghost"
              onClick={onResendOTP}
            >
              {isResendingOTP ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Re-send OTP
            </Button>
          ) : (
            ""
          )}
          <Button
            onClick={onConfirmOTP}
            disabled={isSubmitting || otp.length < 6}
          >
            {isSubmitting ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? "Verifying" : "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthDialog;
