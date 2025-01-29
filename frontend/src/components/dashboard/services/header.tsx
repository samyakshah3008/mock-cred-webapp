import Image from "next/image";
import ServicesHeader from "../../../../public/services-header.png";

const Header = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-64 m-auto">
        <Image src={ServicesHeader} alt="goals checklist" />
      </div>
      <div className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold text-center">
        Create <span className="text-orange-500">Events</span> for people to
        book!
      </div>
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center mt-3 lg:w-[800px]">
        Create events to share for people to book on your calendar.
      </p>
    </div>
  );
};

export default Header;
