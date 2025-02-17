"use client";

import { timeSlots } from "@/app/dashboard/calendar/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAvailabilityDetailsService,
  updateAvailabilityService,
} from "@/services/availability.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AvailabilityContainer = () => {
  const [isFetching, setIsFetching] = useState(true);

  const [availability, setAvailability] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();

  const fetchAvailabilityDetails = async () => {
    try {
      const response = await fetchAvailabilityDetailsService();
      setAvailability(response?.data?.data);
    } catch (error) {
      toast({
        title: "Failed to fetch availability details, please try again later!",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const updateAvailability = async () => {
    try {
      const response = await updateAvailabilityService(availability);
      setAvailability(response?.data?.data);
      toast({ title: "Availability details updated successfully!" });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to save availability details, please try again!",
      });
    } finally {
    }
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setAvailability((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    fetchAvailabilityDetails();
  }, []);

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 flex-1">
      <div className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateAvailability();
                setIsEditing(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-4 text-sm">
        {Object?.keys(availability)?.map((day) => {
          if (day === "timeGap") return null;
          const isAvailable = availability[day]?.isAvailable;

          return (
            <div key={day} className="flex items-center mb-4 gap-4">
              <Switch
                checked={isAvailable}
                disabled={!isEditing}
                onCheckedChange={(checked) => {
                  handleAvailabilityChange(day, "isAvailable", checked);
                  if (!checked) {
                    handleAvailabilityChange(day, "startTime", "09:00");
                    handleAvailabilityChange(day, "endTime", "17:00");
                  }
                }}
              />
              <span className="w-24">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>
              {isAvailable && (
                <>
                  <Select
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      handleAvailabilityChange(day, "startTime", value)
                    }
                    value={availability[day]?.startTime || "09:00"}
                  >
                    <SelectTrigger className="w-32 text-sm">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots?.map((time) => (
                        <SelectItem className="text-sm" key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>-</span>
                  <Select
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      handleAvailabilityChange(day, "endTime", value)
                    }
                    value={availability[day]?.endTime || "17:00"}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots?.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-2 mb-4">
          <span className="w-48">Minimum gap before booking (minutes):</span>
          <Input
            type="number"
            disabled={!isEditing}
            value={availability?.timeGap}
            onChange={(e) =>
              setAvailability((prev: any) => ({
                ...prev,
                timeGap: parseInt(e.target.value, 10),
              }))
            }
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default AvailabilityContainer;
