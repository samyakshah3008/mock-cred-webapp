import { IconClock, IconSearch } from "@tabler/icons-react";

const BookingInterviewContainer = async ({
  publicServiceCardItems,
  username,
}: any) => {
  if (!publicServiceCardItems?.length) {
    return (
      <div className="w-[700px] mt-4 flex flex-col gap-2 items-center text-sm justify-center m-auto text-center bg-white p-4 rounded-md border">
        <IconSearch size={30} />
        <p className="text-lg font-semibold text-gray-700">
          No events available.
        </p>
        <p className="text-gray-500">
          Please check back later for available events or contact support for
          more information.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-md border-subtle border w-[700px] m-auto bg-white mt-5"
      data-testid="event-types"
    >
      {publicServiceCardItems.map((option: any, index: any) => (
        <a
          key={index}
          style={{ display: "flex" }}
          className="bg-default border-subtle dark:bg-muted dark:hover:bg-emphasis hover:bg-muted group relative border-b transition first:rounded-t-md last:rounded-b-md last:border-b-0"
          data-testid="event-type-link"
          href={`/${username}/${option?.url}` || "#"}
        >
          <div className="block w-full p-5">
            <div className="flex flex-wrap items-center">
              <h2 className="text-default pr-2 text-sm font-semibold">
                {option?.title}
              </h2>
            </div>
            <div className="text-subtle">
              <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                <li>
                  <div className="font-medium inline-flex items-center justify-center rounded gap-x-1 bg-emphasis text-emphasis py-1 px-1.5 text-xs leading-3 bg-orange-400 text-white">
                    <IconClock size={16} />
                    {option?.duration}
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
