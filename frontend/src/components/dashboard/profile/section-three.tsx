"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { postWithToken } from "@/config/API";
import { editBasicDetailsEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { fetchUserData } from "@/lib/store/features/user/userSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface SectionThreeProps {
  firstName: string;
  lastName: string;
  username: string;
  aboutText: string;
  role: string;
}

const SectionThree = ({
  firstName,
  lastName,
  username,
  aboutText,
  role,
}: SectionThreeProps) => {
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    username,
    aboutText,
    role,
  });
  const [isEditSectionActive, setIsEditSectionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const changeHandler = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cancelEditHandler = () => {
    setFormData({ firstName, lastName, username, aboutText, role });
    setIsEditSectionActive(false);
  };

  const saveSectionHandler = async () => {
    if (
      JSON.stringify({ firstName, lastName, username, aboutText, role }) ===
      JSON.stringify(formData)
    ) {
      setIsEditSectionActive(false);
    } else {
      try {
        setLoading(true);
        await postWithToken(editBasicDetailsEndpoint, { ...formData });
        toast({ title: "Details saved successfully" });
        dispatch(fetchUserData());
      } catch (error: any) {
        console.log(error, "error");
        toast({
          title: "Uh oh!, Failed to save details",
          description: error?.data?.errorData,
          variant: "destructive",
        });
        setFormData({ firstName, lastName, username, aboutText, role });
      } finally {
        setIsEditSectionActive(false);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 border-2 rounded-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold">Basic Details:</h1>
        <div className="flex gap-2">
          {isEditSectionActive ? (
            <Button onClick={cancelEditHandler} variant="secondary">
              Cancel
            </Button>
          ) : null}
          {isEditSectionActive ? (
            <Button disabled={loading} onClick={saveSectionHandler}>
              {loading ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button onClick={() => setIsEditSectionActive(true)}>Edit</Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <Label>First Name:</Label>
        <Input
          name="firstName"
          value={formData?.firstName}
          onChange={changeHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex flex-col gap-2 ">
        <Label>Last Name:</Label>
        <Input
          name="lastName"
          value={formData?.lastName}
          onChange={changeHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex gap-2 flex-col ">
        <Label>Username:</Label>
        <Input
          name="username"
          value={formData?.username}
          onChange={changeHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <div className="flex gap-2 flex-col ">
        <Label>Bio (for public profile):</Label>
        <Textarea
          name="aboutText"
          value={formData?.aboutText}
          onChange={changeHandler}
          disabled={!isEditSectionActive || loading}
        />
      </div>

      <RadioGroup
        value={formData?.role}
        onValueChange={(value) => setFormData({ ...formData, role: value })}
      >
        <div className="flex flex-col gap-4">
          <Label>Your current Role:</Label>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="interviewer"
              id="r1"
              disabled={!isEditSectionActive || loading}
            />
            <Label className="font-normal" htmlFor="r1">
              Take mock interviews
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="interviewee"
              id="r2"
              disabled={!isEditSectionActive || loading}
            />
            <Label className="font-normal" htmlFor="r2">
              Give mock interviews
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="allrounder"
              id="r3"
              disabled={!isEditSectionActive || loading}
            />
            <Label className="font-normal" htmlFor="r3">
              Both give and take mock interviews
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SectionThree;
