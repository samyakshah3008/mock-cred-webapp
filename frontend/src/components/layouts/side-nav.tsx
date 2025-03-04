"use client";

import { logoutUser } from "@/lib/store/features/user/userSlice";
import { cn } from "@/lib/utils";
import {
  IconBug,
  IconCalendar,
  IconCat,
  IconChartBar,
  IconChartDots,
  IconClock,
  IconDeviceLaptop,
  IconHeart,
  IconHome,
  IconLink,
  IconLogout2,
  IconPhoneCalling,
  IconRobot,
  IconTableSpark,
  IconUserCode,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableDialog from "../ui/common/dialog";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";

const SideNav = () => {
  const [open, setOpen] = useState(false);
  const [showConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const dispatch = useDispatch();
  const router = useRouter();

  const username = useSelector(
    (state: any) =>
      state?.user?.mockCredUser?.onboardingDetails?.stepOne?.username
  );

  const confirmLogoutHandler = () => {
    setShowConfirmLogoutModal(false);
    dispatch(logoutUser());
    router.push("/signin");
  };

  const navData = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconHome
          className={` ${
            activeTab == "Dashboard" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: (
        <IconPhoneCalling
          className={` ${
            activeTab == "Bookings" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "My events",
      href: "/dashboard/services",
      icon: (
        <IconTableSpark
          className={` ${
            activeTab == "My events" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Availability",
      href: "/dashboard/availability",
      icon: (
        <IconClock
          className={` ${
            activeTab == "Availability" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Mock interview with human",
      href: "/dashboard/mock-interview/human",
      icon: (
        <IconUserCode
          className={` ${
            activeTab == "Mock interview with human"
              ? "text-orange-500"
              : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },

    {
      label: "Give mock interview with AI",
      href: "/dashboard/mock-interview/ai",
      icon: (
        <IconRobot
          className={` ${
            activeTab == "Give mock interview with AI"
              ? "text-orange-500"
              : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Testimonials",
      href: "/dashboard/testimonials",
      icon: (
        <IconHeart
          className={` ${
            activeTab == "Testimonials" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },

    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconCat
          className={` ${
            activeTab == "Profile" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "View my public page",
      href: `/${username}?tab=statistics`,
      icon: (
        <IconLink
          className={`text-neutral-700  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: (
        <IconCalendar
          className={` ${
            activeTab == "Calendar" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: (
        <IconChartBar
          className={` ${
            activeTab == "Leaderboard" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: (
        <IconChartDots
          className={` ${
            activeTab == "Analytics" ? "text-orange-500" : "text-neutral-700"
          }  dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
        />
      ),
    },
  ];

  useEffect(() => {
    if (pathname == "/dashboard") {
      setActiveTab("Dashboard");
    } else if (pathname == "/dashboard/bookings") {
      setActiveTab("Bookings");
    } else if (pathname == "/dashboard/services") {
      setActiveTab("My events");
    } else if (pathname == "/dashboard/availability") {
      setActiveTab("Availability");
    } else if (pathname == "/dashboard/mock-interview/human") {
      setActiveTab("Mock interview with human");
    } else if (pathname == "/dashboard/mock-interview/ai") {
      setActiveTab("Give mock interview with AI");
    } else if (pathname == "/dashboard/testimonials") {
      setActiveTab("Testimonials");
    } else if (pathname == "/dashboard/calendar") {
      setActiveTab("Calendar");
    } else if (pathname == "/dashboard/profile") {
      setActiveTab("Profile");
    } else if (pathname == "/leaderboard") {
      setActiveTab("Leaderboard");
    } else if (pathname == "/dashboard/analytics") {
      setActiveTab("Analytics");
    } else if (pathname == "/report-bug") {
      setActiveTab("Report a bug");
    }
  }, [pathname]);

  return (
    <>
      {" "}
      <div
        className={cn(
          "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "md:h-screen sm:h-8 md:sticky top-0"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {navData?.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    labelTextColor={
                      link?.label == activeTab
                        ? "text-orange-500"
                        : "text-neutral-700"
                    }
                    target={
                      link?.label == "View my public page" ? "_blank" : ""
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#",
                  icon: (
                    <IconLogout2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                  onClick: () => {
                    setShowConfirmLogoutModal(true);
                  },
                }}
              />

              <SidebarLink
                link={{
                  label: "Report a bug",
                  href: "/report-bug",

                  icon: (
                    <IconBug
                      className={`${
                        activeTab == "Report a bug"
                          ? "text-orange-500"
                          : "text-neutral-700"
                      } dark:text-neutral-200 h-5 w-5 flex-shrink-0`}
                    />
                  ),
                }}
                labelTextColor={
                  "Report a bug" == activeTab
                    ? "text-orange-500"
                    : "text-neutral-700"
                }
              />
            </div>
          </SidebarBody>
        </Sidebar>

        <ReusableDialog
          isOpen={showConfirmLogoutModal}
          title="Confirm Logout"
          description="Are you sure you want to logout? This will log you out and you need to login with your email back with Two factor authentication again to access the dashboard."
          variant="destructive"
          onClose={() => setShowConfirmLogoutModal(false)}
          onConfirm={confirmLogoutHandler}
        />
      </div>
    </>
  );
};

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconDeviceLaptop className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        MockCred
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconDeviceLaptop className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    </Link>
  );
};

export default SideNav;
