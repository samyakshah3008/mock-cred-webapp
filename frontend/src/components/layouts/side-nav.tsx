"use client";

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
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";

const SideNav = () => {
  const navData = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: (
        <IconPhoneCalling className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My services",
      href: "/dashboard/services",
      icon: (
        <IconTableSpark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Availability",
      href: "/dashboard/availability",
      icon: (
        <IconClock className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Give mock interview with human",
      href: "/dashboard/mock-interview/human",
      icon: (
        <IconUserCode className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Give mock interview with AI",
      href: "/dashboard/mock-interview/ai",
      icon: (
        <IconRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Testimonials",
      href: "/dashboard/testimonials",
      icon: (
        <IconHeart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: (
        <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: (
        <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: (
        <IconChartDots className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconCat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "View my public page",
      href: "/samyakshah", // will be dynamic
      icon: (
        <IconLink className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [showConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false);

  return (
    <>
      {" "}
      <div
        className={cn(
          "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "md:h-screen sm:h-8 md:sticky top-0 h-screen"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {navData.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
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
                  href: "#",
                  icon: (
                    <IconBug className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
    </>
  );
};

export const Logo = () => {
  return (
    <Link
      href="#"
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
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconDeviceLaptop className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    </Link>
  );
};

export default SideNav;
