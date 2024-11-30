"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  useEffect(() => {
    if (!currentUser?._id) return;
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <div>Main Container</div>;
};

export default MainContainer;
