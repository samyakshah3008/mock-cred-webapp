import CardHoverEffect from "@/components/common/card-hover-effect";
import { quickStartLinks } from "./constants";

const QuickStart = () => {
  return (
    <div className="flex flex-col align-center justify-center">
      <div className="text-2xl font-bold text-center">
        Quick Starter links for you! 🧡
      </div>
      <div>
        <CardHoverEffect cardItems={quickStartLinks} />
      </div>
    </div>
  );
};

export default QuickStart;
