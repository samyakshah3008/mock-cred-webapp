"use client";

import { timeSlots } from "@/app/dashboard/calendar/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "../ui/switch";

const OnboardingAvailabilityForm = ({ availability, setAvailability }: any) => {
  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setAvailability((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-1 mt-4 text-sm">
      {Object.keys(availability).map((day) => {
        if (day === "timeGap") return null; // Skip `timeGap` for daily mapping
        const isAvailable = availability[day]?.isAvailable;

        return (
          <div key={day} className="flex items-center mb-4 gap-4">
            <Switch
              checked={isAvailable}
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
                  onValueChange={(value) =>
                    handleAvailabilityChange(day, "startTime", value)
                  }
                  value={availability[day].startTime}
                >
                  <SelectTrigger className="w-32 text-sm">
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem className="text-sm" key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  onValueChange={(value) =>
                    handleAvailabilityChange(day, "endTime", value)
                  }
                  value={availability[day].endTime}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
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
          value={availability.timeGap}
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
  );
};

export default OnboardingAvailabilityForm;
