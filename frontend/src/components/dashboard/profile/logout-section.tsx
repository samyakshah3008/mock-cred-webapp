"use client";

import { Button } from "@/components/ui/button";
import ReusableDialog from "@/components/ui/common/dialog";
import { logoutUser } from "@/lib/store/features/user/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

const LogoutSection = () => {
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const confirmLogoutHandler = () => {
    setShow(false);
    dispatch(logoutUser());
    router.push("/signin");
  };

  return (
    <>
      <div className="flex flex-col gap-4 border-2 rounded-md p-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold">Do you want to logout??</h1>
            <div className="text-slate-500 text-sm">
              This will log you out, however you can always log in again with
              same credentials to be back in action! Proceed with caution
            </div>
          </div>
          <Button onClick={() => setShow(true)} variant="destructive" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <ReusableDialog
        isOpen={show}
        title="Confirm Logout"
        description="Are you sure you want to logout? This will log you out and you need to login with your email back with Two factor authentication again to access the dashboard."
        variant="destructive"
        onClose={() => setShow(false)}
        onConfirm={confirmLogoutHandler}
      />
    </>
  );
};

export default LogoutSection;
