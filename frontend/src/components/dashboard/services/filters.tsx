"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface FiltersProps {
  currentUser: any;
  changeActiveRole: any;
  userRole: any;
  setIsCreateEventSidesheetOpen: any;
}

const Filters = ({
  currentUser,
  changeActiveRole,
  userRole,
  setIsCreateEventSidesheetOpen,
}: FiltersProps) => {
  const router = useRouter();

  const changeRoleHandler = () => {
    router.push("/dashboard/profile");
  };

  return (
    <div>
      <div className="flex justify-center gap-4">
        {currentUser?.role == "allrounder" ? (
          <div className="flex items-center gap-4">
            <div className="text-sm">Register yourself as -</div>
            <Select value={userRole} onValueChange={changeActiveRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interviewee">Interviewee</SelectItem>
                <SelectItem value="interviewer">Interviewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <div className="text-sm">Register yourself as -</div>

            <Select value={userRole} onValueChange={changeActiveRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={userRole}>
                  {userRole == "interviewee" ? "Interviewee" : "Interviewer"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <Button onClick={() => setIsCreateEventSidesheetOpen(true)}>
          <IconPlus size={16} /> Add a new event
        </Button>
      </div>
      {currentUser?.role !== "allrounder" && (
        <div
          onClick={changeRoleHandler}
          className="text-sm underline text-orange-500 font-bold cursor-pointer text-center mt-4"
        >
          Want to change role?
        </div>
      )}
    </div>
  );
};

export default Filters;
