"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PublicServiceCard = ({ key, service, username }: any) => {
  const { title, duration, description, bookingCount = 0, _id } = service;

  const handleCardClick = (e: any) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "SVG") {
      window?.open(`${window?.location.origin}/${username}/${_id}`, "_blank");
    }
  };

  return (  
    <Card
      className="flex flex-col justify-between cursor-pointer"
      onClick={handleCardClick}
      key={key}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>{duration} mins | Public</span>

          <span>{bookingCount | 0} Bookings</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default PublicServiceCard;
