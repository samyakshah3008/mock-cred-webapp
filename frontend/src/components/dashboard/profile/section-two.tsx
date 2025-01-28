"use client";

import { IconUpload } from "@tabler/icons-react";
import { useRef } from "react";

interface SectionTwoProps {
  profilePicURL: string;
  avatarPreview: string | null;
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const SectionTwo = ({
  profilePicURL,
  avatarPreview,
  setAvatarPreview,
}: SectionTwoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if (file) {
    //   setAvatarPreview(URL.createObjectURL(file)); // Generate a preview URL
    //   setOnboardingDetailsObj({
    //     ...onboardingDetailsObj,
    //     stepTwo: { ...onboardingDetailsObj?.stepTwo, profilePicURL: file },
    //   });
    // }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm font-medium">Edit your picture!</div>
      <div
        className="rounded-full w-32 h-32 border-gray-300 border-2 flex items-center justify-center transition-transform duration-200 hover:bg-gray-200 hover:scale-105 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        style={{
          backgroundImage: avatarPreview
            ? `url(${avatarPreview || profilePicURL})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!avatarPreview && <IconUpload size={30} />}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        name="profilePic"
        onChange={handleAvatarChange}
      />
    </div>
  );
};

export default SectionTwo;
