import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconLink,
} from "@tabler/icons-react";
// import FallbackAvatar from "../../../public/fallback-avatar.jpg";

const ProfileSection = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-300">
        {/* <Image
          src={FallbackAvatar}
          alt="fallback-avatar"
          className="w-32 h-32 object-contain"
        /> */}
      </div>

      <div className="text-3xl font-semibold">Samyak Shah</div>
      <p className="text-center mt-2">
        Hello there, I am a Software Engineer who loves to build cool and usable
        products.
      </p>

      {/* Social Links */}
      <div className="flex gap-2 pt-4">
        <IconBrandLinkedin className="text-blue-400 cursor-pointer" size={30} />
        <IconBrandX size={30} className="cursor-pointer" />
        <IconBrandInstagram size={30} className="cursor-pointer" />
        <IconBrandGithub size={30} className="cursor-pointer" />
        <IconLink size={30} className="text-orange-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default ProfileSection;
