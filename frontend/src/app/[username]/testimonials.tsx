import { IconStar, IconStarFilled } from "@tabler/icons-react";

const testimonialsData = [
  {
    rating: 4,
    text: "Samyak's guidance has been invaluable. He provided insightful feedback and practical advice that significantly improved my approach.",
    name: "John Doe",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career. ",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
  {
    rating: 4,
    text: "Working with Samyak was a transformative experience. His expertise and support helped me achieve new heights in my career.",
    name: "Jane Smith",
    date: "2nd Oct, 2023",
  },
];

const Testimonials = () => {
  return (
    <>
      <div className="bg-[#f3f4f6] min-h-screen p-10 text-sm">
        <h2 className="text-center text-2xl font-bold mb-6">
          What people say about Samyak as an Interviewee
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              {/* Rating */}
              <div className="flex items-center mb-2 text-orange-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) =>
                    i <= 3 ? (
                      <IconStarFilled key={i} size={20} />
                    ) : (
                      <IconStar key={i} size={20} />
                    )
                  )}
                <span className="ml-2 text-sm font-semibold">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="flex-1 text-gray-700 mb-4">{testimonial.text}</p>

              {/* Name and Date */}
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span className="font-medium">{testimonial.name}</span>
                <span>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f3f4f6] min-h-screen p-10 text-sm">
        <h2 className="text-center text-2xl font-bold mb-6">
          What people say about Samyak as an Interviewer
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              {/* Rating */}
              <div className="flex items-center mb-2 text-orange-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) =>
                    i <= 3 ? (
                      <IconStarFilled key={i} size={20} />
                    ) : (
                      <IconStar key={i} size={20} />
                    )
                  )}
                <span className="ml-2 text-sm font-semibold">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="flex-1 text-gray-700 mb-4">{testimonial.text}</p>

              {/* Name and Date */}
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span className="font-medium">{testimonial.name}</span>
                <span>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonials;
