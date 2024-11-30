import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const LucideLoader = ({ className }: { className?: string }) => {
  return <Loader className={cn(`mr-2 h-4 w-4 animate-spin`, className)} />;
};
export default LucideLoader;
