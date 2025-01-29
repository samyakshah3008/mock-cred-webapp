import Image from "next/image";

interface HeaderProps {
  img: any;
  alt: string;
  headerText: string;
  headerHighlightText: string;
  description: string;
}

const Header = ({
  img,
  alt,
  headerText,
  headerHighlightText,
  description,
}: HeaderProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-64 m-auto">
        <Image src={img} alt={alt} />
      </div>
      <div className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold text-center">
        {headerText}{" "}
        <span className="text-orange-500">{headerHighlightText}</span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center mt-3 lg:w-[800px]">
        {description}
      </p>
    </div>
  );
};

export default Header;
