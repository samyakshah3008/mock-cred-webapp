"use client";

import { Button } from "@/components/ui/button";
import { postWithToken } from "@/config/API";
import { editProfilePicEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { fetchUserData } from "@/lib/store/features/user/userSlice";
import { IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

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
  const [formData, setFormData] = useState<any>({
    profilePicURL,
    avatarPreview,
  });
  const [isEditSectionActive, setIsEditSectionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        profilePicURL: file,
        avatarPreview: URL.createObjectURL(file),
      });
    }

    setIsEditSectionActive(true);
  };

  const cancelEditHandler = () => {
    setFormData({ profilePicURL, avatarPreview });
    setIsEditSectionActive(false);
  };

  const saveSectionHandler = async () => {
    if (profilePicURL === formData.avatarPreview) {
      setIsEditSectionActive(false);
    } else {
      try {
        setLoading(true);
        const payloadformData: any = new FormData();

        payloadformData.append("profilePic", formData?.profilePicURL);
        await postWithToken(editProfilePicEndpoint, payloadformData);
        toast({ title: "Details saved successfully" });
        dispatch(fetchUserData());
      } catch (error: any) {
        toast({
          title: "Failed to save details",
          description: error?.data?.errorData || "Please try again later.",
          variant: "destructive",
        });
        setFormData({ profilePicURL, avatarPreview });
      } finally {
        setIsEditSectionActive(false);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-10 items-center border-2 rounded-md p-4 justify-center">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-sm font-medium">Edit your picture!</div>
        <div
          className="rounded-full w-32 h-32 border-gray-300 border-2 flex items-center justify-center transition-transform duration-200 hover:bg-gray-200 hover:scale-105 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          style={{
            backgroundImage: formData?.avatarPreview
              ? `url(${formData?.avatarPreview})`
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

      <div className="flex gap-2">
        {isEditSectionActive ? (
          <Button onClick={cancelEditHandler} variant="secondary">
            Cancel
          </Button>
        ) : null}
        {isEditSectionActive ? (
          <Button disabled={loading} onClick={saveSectionHandler}>
            {loading ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default SectionTwo;
