"use client";

import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchUsersForMockInterviewsService } from "@/services/user.service";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PeerlistLogo from "../../../../public/peerlist-logo.png";
import Filters from "./filters";

interface User {
  _id: string;
  profilePicURL: string;
  position: string;
  company: string;
  preferredTechnologies: string[];
  socialLinks: {
    linkedIn: string;
    github: string;
    X: string;
    instagram: string;
    peerlist: string;
  };
  username: string;
  firstName: string;
  lastName: string;
  yearsOfExperience: number;
}

interface FindMatchSectionProps {
  userRole: string;
  currentUser: any;
  changeActiveRole: any;
}

const FindMatchSection = ({
  userRole,
  currentUser,
  changeActiveRole,
}: FindMatchSectionProps) => {
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchByName, setSearchByName] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [searchByTech, setSearchByTech] = useState("");

  const { toast } = useToast();

  const router = useRouter();

  const fetchUsersForMockInterviews = async () => {
    let requiredRole =
      userRole === "interviewee" ? "interviewer" : "interviewee";
    try {
      const response = await fetchUsersForMockInterviewsService(requiredRole);
      setUsers(response?.data || []);
    } catch (error) {
      toast({
        title: "Failed to fetch users, please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    // Search by Name
    const matchesName =
      searchByName === "" ||
      user.firstName.toLowerCase().includes(searchByName.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchByName.toLowerCase());

    // Filter by Experience
    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "fresher" && user.yearsOfExperience === 0) ||
      (experienceFilter === "1-3" &&
        user.yearsOfExperience >= 1 &&
        user.yearsOfExperience <= 3) ||
      (experienceFilter === "3-5" &&
        user.yearsOfExperience > 3 &&
        user.yearsOfExperience <= 5) ||
      (experienceFilter === "5-10" &&
        user.yearsOfExperience > 5 &&
        user.yearsOfExperience <= 10) ||
      (experienceFilter === "10+" && user.yearsOfExperience > 10);

    // Search by Technology
    const matchesTech =
      searchByTech === "" ||
      user.preferredTechnologies.some((tech) =>
        tech.toLowerCase().includes(searchByTech.toLowerCase())
      );

    return matchesName && matchesExperience && matchesTech;
  });

  const changeRoleHandler = () => {
    router.push("/dashboard/profile");
  };

  const viewProfileHandler = (username: string) => {
    if (window) {
      window.open(
        `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${username}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    fetchUsersForMockInterviews();
  }, [userRole]);

  return (
    <div className="flex flex-col gap-6">
      <Filters
        currentUser={currentUser}
        userRole={userRole}
        changeActiveRole={changeActiveRole}
        searchByName={searchByName}
        setSearchByName={setSearchByName}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
        searchByTech={searchByTech}
        setSearchByTech={setSearchByTech}
        changeRoleHandler={changeRoleHandler}
      />

      {isFetching ? (
        <div className="h-32 flex items-center justify-center">
          <Loader className="mr-2 h-8 w-8 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title={`No ${
            userRole === "interviewee" ? "interviewers" : "interviewees"
          } found!`}
          description={`No ${
            userRole === "interviewee" ? "interviewers" : "interviewees"
          } are available with your applied filters, please come back later or try applying different filter.`}
        />
      ) : (
        <div className="flex flex-wrap w-[90%] gap-6 m-auto">
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl overflow-hidden w-[90%] md:w-[400px] border-2 border-solid p-4 flex flex-col gap-5">
                <div className="w-full flex flex-col gap-2 justify-center items-center">
                  <img
                    src={user.profilePicURL}
                    alt={user.username}
                    className="w-32 h-32 rounded-full object-contain border-2"
                  />
                  <div className="text-lg font-semibold underline">
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Position:</strong> {user.position} at {user.company}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    <strong>Years of Experience:</strong>{" "}
                    {user.yearsOfExperience === 0
                      ? "Fresher"
                      : user.yearsOfExperience}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    <strong>Tech Stack:</strong>{" "}
                    {user.preferredTechnologies.length > 0
                      ? user.preferredTechnologies.join(", ")
                      : "Not specified"}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-2 text-sm">
                    <strong className="text-muted-foreground">Connect:</strong>
                    {user.socialLinks.linkedIn && (
                      <a href={user.socialLinks.linkedIn} target="_blank">
                        <IconBrandLinkedin className="w-5 h-5 text-blue-500 hover:text-blue-800" />
                      </a>
                    )}
                    {user.socialLinks.github && (
                      <a href={user.socialLinks.github} target="_blank">
                        <IconBrandGithub className="w-5 h-5" />
                      </a>
                    )}
                    {user.socialLinks.X && (
                      <a href={user.socialLinks.X} target="_blank">
                        <IconBrandX className="w-5 h-5" />
                      </a>
                    )}
                    {user.socialLinks.instagram && (
                      <a href={user.socialLinks.instagram} target="_blank">
                        <IconBrandInstagram className="w-5 h-5 text-orange-500 hover:text-orange-800" />
                      </a>
                    )}
                    {user.socialLinks.peerlist && (
                      <a href={user.socialLinks.peerlist} target="_blank">
                        <Image
                          src={PeerlistLogo}
                          alt="peerlist"
                          className="w-5 h-5 text-green-600 hover:text-green-800"
                        />
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => viewProfileHandler(user?.username)}
                >
                  View Profile
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindMatchSection;
