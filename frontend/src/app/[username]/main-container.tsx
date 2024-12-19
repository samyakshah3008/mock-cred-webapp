import Link from "next/link";
import BookingInterviewContainer from "./booking-interview-container";
import ProfileSection from "./profile-section";
import StatisticsGrid from "./statistics-grid";
import Testimonials from "./testimonials";

const navTabs = [
  { label: "View Samyak's Statistics", value: "statistics" },
  { label: "Book an interview", value: "schedule" },
  { label: "What people speak about Samyak", value: "testimonials" },
];

const MainContainer = ({
  publicServiceCardItems,
  user,
  tab,
  username,
}: any) => {
  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 pt-10">
      <div className="flex flex-col gap-4">
        <ProfileSection />
        <div className="flex gap-2 justify-center">
          {navTabs.map((navItem, index) => {
            return (
              <Link
                key={index}
                href={`/${user?.onboardingDetails?.stepOne?.username}?tab=${navItem.value}`}
                className={`border-2 text-sm ${
                  tab == navItem.value ? "border-orange-400" : ""
                } rounded-md p-2 cursor-pointer`}
              >
                {navItem.label}
              </Link>
            );
          })}
        </div>
        {tab === "statistics" && <StatisticsGrid />}
        {tab === "schedule" && <BookingInterviewContainer />}
        {tab === "testimonials" && <Testimonials />}
      </div>
    </div>
  );
};

export default MainContainer;
