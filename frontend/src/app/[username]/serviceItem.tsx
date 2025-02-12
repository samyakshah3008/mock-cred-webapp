import { IconArrowRight, IconClock } from "@tabler/icons-react";

const ServiceItem = ({ index, username, option }: any) => {
  return (
    <a
      key={index}
      className="flex bg-default border-subtle dark:bg-muted dark:hover:bg-emphasis hover:bg-muted group relative border-b transition first:rounded-t-md last:rounded-b-md last:border-b-0 items-center"
      data-testid="event-type-link"
      href={`/${username}/${option?.url}` || "#"}
      target="_blank"
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
                {option?.duration}m
              </div>
            </li>
          </ul>
        </div>
      </div>
      <IconArrowRight size={16} className="mr-8" />
    </a>
  );
};

export default ServiceItem;
