"use client";

import { cn } from "@/lib/utils";
import { verifyNewUserAndSendOTPService } from "@/services/auth.service";
import { shallUserRedirectToSignin } from "@/utils/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../hooks/use-toast";
import TwoFactorAuthDialog from "../authentication/two-factor-auth-dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const ZSignInFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().optional(),
  otpCode: z.string().optional(),
});

export type TSignUpFormSchema = z.infer<typeof ZSignInFormSchema>;

export type SignUpFormProps = {
  className?: string;
};

const SignUpForm = ({ className }: SignUpFormProps) => {
  const [
    isTwoFactorAuthenticationDialogOpen,
    setIsTwoFactorAuthenticationDialogOpen,
  ] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const form = useForm<TSignUpFormSchema>({
    values: {
      email: "",
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(ZSignInFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onCloseTwoFactorAuthenticationDialog = () => {
    setIsTwoFactorAuthenticationDialogOpen(false);
  };

  const onFormSubmit = async ({
    email,
    firstName,
    lastName,
  }: TSignUpFormSchema) => {
    const credentials: Record<string, string> | any = {
      email,
      firstName,
      lastName,
    };
    if (!lastName?.length) {
      form.setValue("lastName", "");
    }
    const payload = { userDetails: credentials };
    try {
      const response = await verifyNewUserAndSendOTPService(payload);
      if (shallUserRedirectToSignin(response)) {
        router.replace(`/signin?email=${email}`);
      } else {
        setIsTwoFactorAuthenticationDialogOpen(true);
        toast({
          variant: "default",
          title: "Check your inbox",
          description: `We've sent One Time Password to ${email} .`,
        });
      }
    } catch (error: any) {
      console.error(error, "something went wrong");
      toast({
        variant: "destructive",
        title: "Unable to send otp",
        description:
          error?.message ??
          "Uh oh! Something is wrong with our server, please try again later.",
      });
    }
  };

  const preFillForm = () => {
    const email: any = searchParams.get("email");

    if (email?.length) {
      form.setValue("email", email);
      toast({
        variant: "default",
        title: "Account Doesn't exists",
        description: `Create a new account instead, chief!`,
      });
    }
  };

  useEffect(() => {
    preFillForm();
  }, []);

  return (
    <Form {...form}>
      <form
        className={cn("flex w-full flex-col gap-y-4", className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset
          className="flex w-full flex-col gap-y-4"
          disabled={isSubmitting}
        >
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>

                  <FormControl>
                    <Input type="string" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>

                  <FormControl>
                    <Input type="string" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="dark:hover:opacity-90"
          >
            {isSubmitting ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? "Sending you an OTP" : "Create New Account"}
          </Button>
        </fieldset>
      </form>

      <TwoFactorAuthDialog
        isTwoFactorAuthenticationDialogOpen={
          isTwoFactorAuthenticationDialogOpen
        }
        onCloseTwoFactorAuthenticationDialog={
          onCloseTwoFactorAuthenticationDialog
        }
        credentials={{
          email: form.getValues("email"),
          firstName: form.getValues("firstName"),
          lastName: form.getValues("lastName"),
        }}
        flow="signup"
      />
    </Form>
  );
};

export default SignUpForm;
