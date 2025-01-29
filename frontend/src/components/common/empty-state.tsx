import Image from "next/image";
import NotFoundItem from "../../../public/empty-state.png";

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
  if (!title || !description) return null;
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <Image src={NotFoundItem} alt="Not Found" className="w-40 h-40" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default EmptyState;
