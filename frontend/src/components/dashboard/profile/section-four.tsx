"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postWithToken } from "@/config/API";
import { editSocialLinksEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { fetchUserData } from "@/lib/store/features/user/userSlice";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import PeerlistLogo from "../../../../public/peerlist-logo.png";

const SectionFour = ({ prefilledLinks }: { prefilledLinks: any }) => {
  const [socialLinks, setSocialLinks] = useState(prefilledLinks);
  const [isEditSectionActive, setIsEditSectionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const changeSocialLinksHandler = (e: any) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value,
    });
  };

  const cancelEditHandler = () => {
    setSocialLinks(prefilledLinks);
    setIsEditSectionActive(false);
  };

  const saveSectionHandler = async () => {
    if (areDetailsSame(prefilledLinks, socialLinks)) {
      setIsEditSectionActive(false);
    } else {
      try {
        setLoading(true);
        await postWithToken(editSocialLinksEndpoint, { socialLinks });
        toast({ title: "Details saved successfully" });
        dispatch(fetchUserData());
      } catch (error: any) {
        toast({
          title: "Failed to save details",
          description: error?.data?.errorData,
          variant: "destructive",
        });
        setSocialLinks(prefilledLinks);
      } finally {
        setIsEditSectionActive(false);
        setLoading(false);
      }
    }
  };

  const areDetailsSame = (prefilledLinks: any, socialLinks: any) => {
    return JSON.stringify(prefilledLinks) === JSON.stringify(socialLinks);
  };

  if (Object.keys(socialLinks).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 gap-4 border-2 rounded-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold">My socials:</h1>
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
            <Button onClick={() => setIsEditSectionActive(true)}>Edit</Button>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <IconBrandLinkedin size={28} className="text-blue-500" />
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.linkedIn}
          name="linkedIn"
          onChange={changeSocialLinksHandler}
          className="flex-1"
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex gap-2 items-center">
        <IconBrandX size={28} className="" />
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.X}
          name="X"
          onChange={changeSocialLinksHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex items-center gap-2">
        <IconBrandInstagram size={28} className="text-orange-500" />
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.instagram}
          name="instagram"
          onChange={changeSocialLinksHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex items-center gap-2">
        <IconBrandGithub size={28} className="" />
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.github}
          name="github"
          onChange={changeSocialLinksHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex items-center gap-2">
        <Image src={PeerlistLogo} alt="peerlist" width={28} height={28} />
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.peerlist}
          name="peerlist"
          onChange={changeSocialLinksHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>
    </div>
  );
};

export default SectionFour;
