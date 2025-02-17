import { IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";

const TestimonialCard = ({
  index,
  testimonial,
}: {
  index: number;
  testimonial: any;
}) => {
  return (
    <div
      key={index}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
    >
      {/* Rating */}
      <div className="flex items-center mb-2 text-orange-400">
        {Array(5)
          .fill(0)
          .map((_, i) =>
            testimonial?.rating >= i + 1 ? (
              <IconStarFilled key={i} size={20} />
            ) : (
              <IconStar key={i} size={20} />
            )
          )}
        <span className="ml-2 text-sm font-semibold">
          {testimonial?.rating}/5
        </span>
      </div>

      {/* Testimonial Text */}
      <p className="flex-1 text-gray-700 mb-4">
        {testimonial?.testimonialText}
      </p>

      {/* Name and Date */}
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <span className="font-medium">
          Given by:{" "}
          <Link
            target="_blank"
            className="underline"
            href={testimonial?.testimonialGiverPublicProfile}
          >
            {testimonial?.testimonialGiverName}
          </Link>
        </span>
        <span>{testimonial?.date}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
