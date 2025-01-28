import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div>First Name: </div>
        <Input value={firstName} />
      </div>

      <div className="flex gap-2">
        <div>Last Name: </div>
        <Input value={lastName} />
      </div>

      <div className="flex gap-2">
        <div> Username: </div>
        <Input value={username} />
      </div>

      <div className="flex gap-2">
        <div> Bio (for public profile) </div>
        <Input value={aboutText} />
      </div>

      <RadioGroup value={role}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="interviewer" id="r1" />
          <Label className="font-normal" htmlFor="r1">
            Take mock interviews
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="interviewee" id="r2" />
          <Label className="font-normal" htmlFor="r2">
            Give mock interviews
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="allrounder" id="r3" />
          <Label className="font-normal" htmlFor="r3">
            Both give and take mock interviews
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SectionThree;
