"use client";

import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Image from "next/image";
import PeerlistLogo from "../../../public/peerlist-logo.png";

const ProfileSection = ({ user }: any) => {
  const navigateToSocialLink = (link: string) => {
    if (window) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-300">
        <img
          src={user?.onboardingDetails?.stepTwo?.profilePicURL}
          alt="fallback-avatar"
          width={128}
          height={128}
          className="w-32 h-32 object-contain"
        />
      </div>

      <div className="text-3xl font-semibold">
        {" "}
        {user?.firstName + " " + user?.lastName}{" "}
      </div>
      <p className="text-center mt-2">
        {user?.onboardingDetails?.stepTwo?.aboutText}
      </p>

      {/* Social Links */}
      <div className="flex gap-2 pt-4">
        {user?.onboardingDetails?.stepFour?.socialLinks?.linkedIn && (
          <IconBrandLinkedin
            className="text-blue-400 cursor-pointer"
            size={28}
            onClick={() =>
              navigateToSocialLink(
                user?.onboardingDetails?.stepFour?.socialLinks?.linkedIn
              )
            }
          />
        )}

        {user?.onboardingDetails?.stepFour?.socialLinks?.github && (
          <IconBrandGithub
            className="cursor-pointer  text-gray-800"
            size={28}
            onClick={() =>
              navigateToSocialLink(
                user?.onboardingDetails?.stepFour?.socialLinks?.github
              )
            }
          />
        )}

        {user?.onboardingDetails?.stepFour?.socialLinks?.instagram && (
          <IconBrandInstagram
            className="cursor-pointer text-orange-400"
            size={28}
            onClick={() =>
              navigateToSocialLink(
                user?.onboardingDetails?.stepFour?.socialLinks?.instagram
              )
            }
          />
        )}

        {user?.onboardingDetails?.stepFour?.socialLinks?.X && (
          <IconBrandX
            className="cursor-pointer"
            size={28}
            onClick={() =>
              navigateToSocialLink(
                user?.onboardingDetails?.stepFour?.socialLinks?.X
              )
            }
          />
        )}

        {user?.onboardingDetails?.stepFour?.socialLinks?.peerlist && (
          <Image
            className="cursor-pointer"
            src={PeerlistLogo}
            alt="peerlist"
            onClick={() =>
              navigateToSocialLink(
                user?.onboardingDetails?.stepFour?.socialLinks?.peerlist
              )
            }
            width={28}
            height={28}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
