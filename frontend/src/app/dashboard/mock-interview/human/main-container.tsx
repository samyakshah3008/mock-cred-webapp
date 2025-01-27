"use client";
import { fetchListService } from "@/services/user.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<any>([]);
  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const fetchList = async () => {
    let requiredRole;
    if (currentUser?.role === "interviewer") {
      requiredRole = "interviewee";
    } else if (currentUser?.role === "interviewee") {
      requiredRole = "interviewer";
    } else {
      requiredRole = "allrounder";
    }
    try {
      const response = await fetchListService(requiredRole);
      setList(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    fetchList();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (currentUser?.role === "allrounder") {
    return <div>Allrounder</div>;
  }

  return <div>Main Container from</div>;
};

export default MainContainer;
