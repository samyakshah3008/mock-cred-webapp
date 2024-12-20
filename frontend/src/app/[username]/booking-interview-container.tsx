import { IconClock } from "@tabler/icons-react";

const meetingOptions = [
  {
    title: "ReactJS Screening Round",
    duration: "30m",
    href: "/samyaksshah/30min?nxtPuser=samyaksshah",
  },
  {
    title: "Intro call Round",
    duration: "15m",
    href: "/samyaksshah/15min?nxtPuser=samyaksshah",
  },
];

const BookingInterviewContainer = () => {
  return (
    <div
      className="rounded-md border-subtle border w-[700px] m-auto bg-white mt-5"
      data-testid="event-types"
    >
      {meetingOptions.map((option, index) => (
        <a
          key={index}
          style={{ display: "flex" }}
          className="bg-default border-subtle dark:bg-muted dark:hover:bg-emphasis hover:bg-muted group relative border-b transition first:rounded-t-md last:rounded-b-md last:border-b-0"
          data-testid="event-type-link"
          href={option.href}
        >
          <div className="block w-full p-5">
            <div className="flex flex-wrap items-center">
              <h2 className="text-default pr-2 text-sm font-semibold">
                {option.title}
              </h2>
            </div>
            <div className="text-subtle">
              <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                <li>
                  <div className="font-medium inline-flex items-center justify-center rounded gap-x-1 bg-emphasis text-emphasis py-1 px-1.5 text-xs leading-3 bg-orange-400 text-white">
                    <IconClock size={16} />
                    {option.duration}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default BookingInterviewContainer;
