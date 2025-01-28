"use client";

import { Input } from "@/components/ui/input";

const SectionOne = ({ email }: { email: string }) => {
  return (
    <div>
      Email:
      <Input value={email} />
    </div>
  );
};

export default SectionOne;
