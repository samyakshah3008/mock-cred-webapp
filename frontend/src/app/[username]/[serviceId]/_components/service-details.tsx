import { Calendar, Clock } from "lucide-react";
import { prepareAvailableDays } from "../helper";
import BookingForm from "./booking-form";

export default function ServiceDetails({ service }: any) {
  const {
    title = "",
    email,
    firstName,
    service: { duration, description },
    userAvaibility,
  } = service;

  const availableDays = prepareAvailableDays(userAvaibility, duration);
  return (
    <>
      <div className="p-10 lg:w-1/3 bg-white">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <div className="flex items-center mb-4">
          {/* <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar> */}
          <div>
            <h2 className="text-xl font-semibold">{firstName}</h2>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>
        <div className="flex items-center mb-2">
          <Clock className="mr-2" />
          <span>{duration} minutes</span>
        </div>
        <div className="flex items-center mb-4">
          <Calendar className="mr-2" />
          <span>Google Meet</span>
        </div>
        <p className="text-gray-700">{description}</p>
      </div>
      <BookingForm event={service} availability={availableDays} />
    </>
  );
}
