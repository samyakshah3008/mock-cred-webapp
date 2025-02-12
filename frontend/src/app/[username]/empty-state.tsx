import { IconSearch } from "@tabler/icons-react";

const EmptyState = () => {
  return (
    <div className="w-[700px] mt-4 flex flex-col gap-2 items-center text-sm justify-center m-auto text-center bg-white p-4 rounded-md border">
      <IconSearch size={30} />
      <p className="text-lg font-semibold text-gray-700">
        No events available.
      </p>
      <p className="text-gray-500">
        Please check back later for available events or contact support for more
        information.
      </p>
    </div>
  );
};

export default EmptyState;
