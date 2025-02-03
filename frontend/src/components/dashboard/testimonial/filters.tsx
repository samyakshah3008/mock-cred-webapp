"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  currentUser: any;
  changeActiveRole: any;
  userRole: any;
  changeRoleHandler: any;
}

const Filters = ({
  currentUser,
  userRole,
  changeActiveRole,
  changeRoleHandler,
}: FiltersProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Role Filter */}
      <div className="flex justify-center gap-4">
        {currentUser?.role === "allrounder" ? (
          <div className="flex items-center gap-4">
            <div className="text-sm">See testimonials of you as an -</div>
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
            <div className="text-sm">See testimonials of you as an -</div>
            <Select value={userRole} onValueChange={changeActiveRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={userRole}>
                  {userRole === "interviewee" ? "Interviewee" : "Interviewer"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {currentUser?.role !== "allrounder" && (
        <div
          onClick={changeRoleHandler}
          className="text-sm underline text-green-500 font-bold cursor-pointer text-center mt-2"
        >
          Want to change role?
        </div>
      )}
    </div>
  );
};

export default Filters;
