import Image from "next/image";
import AIMockImg from "../../../public/landing-page/ai-mock-interview.png";
import AvailabilityImg from "../../../public/landing-page/availability.png";
import BookingImg from "../../../public/landing-page/bookings.png";
import Dashboard from "../../../public/landing-page/dashboard.png";
import EventsImg from "../../../public/landing-page/events.png";
import HumanMockImg from "../../../public/landing-page/find-mate.png";
import PublicBookingImg from "../../../public/landing-page/public-page-booking.png";
import PublicStatsImg from "../../../public/landing-page/public-page-stats.png";
import PublicTestimonialsImg from "../../../public/landing-page/public-page-testimonials.png";
import TestimonialImg from "../../../public/landing-page/testimonials.png";

const Features = () => {
  return (
    <div className="flex flex-col m-auto gap-5 p-4 w-full lg:w-[90%] mt-10">
      <div className="text-center text-orange-500 font-bold text-xl underline">
        Sneak Peak to our Features
      </div>
      <div className="flex flex-col gap-10 bg-gray-50 p-5">
        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <Image
            src={Dashboard}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px] "
          />
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Witchy Dashboard
            </div>
            <div className="text-center w-[90%]">
              Witch lives here, she will daily greet you and let you how many
              days are left before year ends;)
            </div>
          </div>
        </div>

        {/* 2nd  */}

        <div className="flex flex-col-reverse lg:flex-row gap-5 items-center">
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Showcasable Public Profile
            </div>
            <div className="text-center w-[90%]">
              Your public profile is your visibility. Instead of silent hard
              work behind your
              <span className="font-semibold"> job hunt</span>, let your profile
              speak for you how well you are putting efforts in your job hunt
              journey!
            </div>
          </div>

          <Image
            src={PublicStatsImg}
            alt="super-focus-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <Image
            src={PublicBookingImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Book Interviews!
            </div>
            <div className="text-center w-[90%]">
              Book interviews according to your role - interviewee/interviewer
              and enjoy the seamless experience of mock interviews.
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-5 items-center">
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Let your testimonials speak for you!
            </div>
            <div className="text-center w-[90%]">
              Testimonials are the best way to showcase your mock interview
              feedbacks and to prove that you are constantly trying to improve
              instead of complaining of market situation or no fresher jobs!
            </div>
          </div>

          <Image
            src={PublicTestimonialsImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <Image
            src={BookingImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Manage your bookings!
            </div>
            <div className="text-center w-[90%]">
              You can manage your bookings, reschedule or cancel them as per
              your convenience here. Also you can approve your mate's booking
              and give testimonials from here to ensure that you are not missing
              any feedbacks!
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-5 items-center">
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Give Mock Interview with AI! 🤖
            </div>
            <div className="text-center w-[90%]">
              AI will help you to take mock interviews. It will give you the
              questions and record your responses to give you feedback on your
              responses. It will also give you the score based on your
              responses.
            </div>
          </div>

          <Image
            src={AIMockImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <Image
            src={AvailabilityImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Set your availability!
            </div>
            <div className="text-center w-[90%]">
              Set your availability for the mock interviews. You can set your
              availability for the upcoming days and time slots. You can also
              set your availability for the upcoming weeks.
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-5 items-center">
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Manage your testimonials
            </div>
            <div className="text-center w-[90%]">
              You can manage your testimonials, approve or reject them as per
              your convenience. You can also give testimonials to your mates
              from here.
            </div>
          </div>

          <Image
            src={TestimonialImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <Image
            src={EventsImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Create events for people to book!
            </div>
            <div className="text-center w-[90%]">
              Create events to share for people to book on your calendar.
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-5 items-center">
          <div className="flex-1 flex flex-col gap-2 justify-center items-center">
            <div className="text-2xl font-bold text-center">
              Find your mate!
            </div>
            <div className="text-center w-[90%]">
              Find your mate who is also looking for a mock interview. You can
              book them for a mock interview and help each other to grow in your
              career. 🚀 You can choose your role and find accordingly. Our
              filters will help you find the perfect match!
            </div>
          </div>

          <Image
            src={HumanMockImg}
            alt="dashboard-img"
            className="flex-1 rounded-lg w-full md:w-[80%] lg:w-[400px] xl:w-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
