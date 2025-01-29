import Image from "next/image";
import AvailabilityHeader from "../../../../public/availability-header.png";

const Header = () => {
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="w-64 m-auto">
        <Image src={AvailabilityHeader} alt="goals checklist" />
      </div>
      <div className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold text-center">
        Configure Your <span className="text-orange-500">Availability</span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center mt-3 lg:w-[800px]">
        Configure times when you are available for bookings.
      </p>
    </div>
  );
};

export default Header;
