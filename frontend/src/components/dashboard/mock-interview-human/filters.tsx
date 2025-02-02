"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FiltersProps {
  currentUser: any;
  changeActiveRole: any;
  userRole: any;
  searchByName: string;
  setSearchByName: any;
  experienceFilter: string;
  setExperienceFilter: any;
  searchByTech: string;
  setSearchByTech: any;
  changeRoleHandler: any;
}

const Filters = ({
  currentUser,
  userRole,
  changeActiveRole,
  searchByName,
  setSearchByName,
  experienceFilter,
  setExperienceFilter,
  searchByTech,
  setSearchByTech,
  changeRoleHandler,
}: FiltersProps) => {
  const { toast } = useToast();

  const resetFilters = () => {
    if (
      searchByName === "" &&
      experienceFilter === "all" &&
      searchByTech === ""
    )
      return;

    setSearchByName("");
    setExperienceFilter("all");
    setSearchByTech("");

    toast({
      title: "Filters Reset ✅",
      description: "All filters have been reset",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Role Filter */}
      <div className="flex justify-center gap-4">
        {currentUser?.role === "allrounder" ? (
          <div className="flex items-center gap-4">
            <div className="text-sm">Choose the role you want to be -</div>
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
            <div className="text-sm">Choose the role you want to be -</div>
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
          className="text-sm underline text-orange-500 font-bold cursor-pointer text-center mt-2"
        >
          Want to change role?
        </div>
      )}

      {/* Additional Filters */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {/* Search by Name */}
        <input
          type="text"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
          placeholder="Search by name..."
          className="border border-gray-300 px-3 py-2 rounded-lg w-[200px] text-sm"
        />

        {/* Filter by Experience */}
        <div className="flex gap-2 items-center">
          <div className="text-sm">Years of experience - </div>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Years of Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="fresher">Fresher</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search by Technology */}
        <input
          type="text"
          value={searchByTech}
          onChange={(e) => setSearchByTech(e.target.value)}
          placeholder="Search by technology..."
          className="border border-gray-300 px-3 py-2 rounded-lg w-[200px] text-sm"
        />

        {/* Reset Filters Button */}
        <Button onClick={resetFilters} variant="secondary">
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;
