"use client";

import { postWithToken } from "@/config/API";
import { saveUserOnboardingDetails } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import PeerlistLogo from "../../../public/peerlist-logo.png";
import { Button } from "../ui/button";
import LucideLoader from "../ui/common/loader";
import { Input } from "../ui/input";

const StepFour = ({
  setOnboardingStep,
  onboardingDetailsObjSocialLinks,
}: any) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    linkedIn: onboardingDetailsObjSocialLinks?.linkedIn || "",
    github: onboardingDetailsObjSocialLinks?.github || "",
    X: onboardingDetailsObjSocialLinks?.X || "",
    instagram: onboardingDetailsObjSocialLinks?.instagram || "",
    peerlist: onboardingDetailsObjSocialLinks?.peerlist || "",
  });

  const saveFormAndNext = async () => {
    setLoading(true);
    try {
      const response = await postWithToken(saveUserOnboardingDetails, {
        stepCount: 4,
        detailsObj: { socialLinks },
      });
      setOnboardingStep(4);
    } catch (error) {
      toast({ title: "Failed to save details" });
    } finally {
      setLoading(false);
    }
  };

  const changeSocialLinksHandler = (e: any) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-[92vw] h-[83vh] md:w-[90vw] lg:w-[840px] lg:h-[560px] bg-white shadow-md rounded-3xl flex flex-col p-12">
      <div className="flex gap-2 flex-col">
        <div className="text-xl font-semibold">
          Almost there! Link your socials!
        </div>
        <div className="text-sm">
          Bonus tip: Linking more socials will help you to do networking across
          broad platforms.
        </div>
      </div>

      <div
        className="mt-10 flex flex-col flex-1 gap-4 overflow-y-scroll"
        id="creatorJourneySetup"
      >
        <div className="flex gap-2 items-center">
          <IconBrandLinkedin size={28} className="text-blue-500" />
          <Input
            type="url"
            placeholder="yourprofile.com"
            value={socialLinks.linkedIn}
            name="linkedIn"
            onChange={changeSocialLinksHandler}
            className="flex-1"
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
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm font-medium">STEP 4 OF 5</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOnboardingStep(2)}
          >
            {" "}
            <IconArrowLeft size="14" /> Previous step
          </Button>
          <Button
            disabled={loading || !socialLinks?.linkedIn}
            size="sm"
            onClick={saveFormAndNext}
          >
            {" "}
            {loading ? <LucideLoader className="mr-0" /> : null}
            Next step <IconArrowRight size="14" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
