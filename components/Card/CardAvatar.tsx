import React from "react";
import Image from "next/image";

export interface CardAvatarProps {
  image?: string;
  imageAlt?: string;
  verified?: boolean;
}

export default function CardAvatar({ image, imageAlt }: CardAvatarProps) {
  return (
    <div className="w-4 h-4 relative overflow-hidden rounded-full mr-1">
      <Image src={image} layout="fill" objectFit="cover" alt={imageAlt}></Image>
    </div>
  );
}
