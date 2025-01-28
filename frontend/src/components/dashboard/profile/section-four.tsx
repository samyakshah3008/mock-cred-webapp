"use client";

import { Input } from "@/components/ui/input";

const SectionFour = ({ socialLinks }: { socialLinks: any }) => {
  const changeSocialLinksHandler = (e: any) => {
    // setSocialLinks({
    //   ...socialLinks,
    //   [e.target.name]: e.target.value,
    // });
  };
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Linkedin</div>
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.linkedIn}
          name="linkedIn"
          onChange={changeSocialLinksHandler}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">X</div>
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.X}
          name="X"
          onChange={changeSocialLinksHandler}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Instagram</div>
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.instagram}
          name="instagram"
          onChange={changeSocialLinksHandler}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">GitHub</div>
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.github}
          name="github"
          onChange={changeSocialLinksHandler}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Peerlist</div>
        <Input
          type="url"
          placeholder="yourprofile.com"
          value={socialLinks.peerlist}
          name="peerlist"
          onChange={changeSocialLinksHandler}
        />
      </div>
    </div>
  );
};

export default SectionFour;
