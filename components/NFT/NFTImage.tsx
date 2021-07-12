import React from "react";
import Image from "next/image";

interface NFTImageProps {
  image: string;
}

export const NFTImage: React.FC<NFTImageProps> = ({ image }) => {
  return (
    <div className="mb-5 lg:mb-0 w-full mt-10 py-10 md:mt-0 md:py-0 md:h-screen md:w-3/5 lg:w-4/6 pt-16 flex flex-col items-center justify-between bg-gray-100 dark:bg-gray-500">
      <div className="h-96 px-8 md:px-0 md:h-5/6 md:pt-10 w-full md:w-5/6 my-auto">
        <div className="relative h-full w-full">
          <Image
            loading="eager"
            priority={true}
            src={image}
            layout="fill"
            className="overflow-hidden shadow-lg"
            objectFit="contain"
            objectPosition="fill"
          ></Image>
        </div>
      </div>
    </div>
  );
};
