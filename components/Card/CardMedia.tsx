import React from "react";
import Image from "next/image";

interface CardMediaProps {
  src: string;
  alt?: string;
}

export default function CardMedia({ src, alt }: CardMediaProps) {
  return (
    <div className="h-96 relative bg-gray-200 z-0 overflow-hidden">
      {src && (
        <Image
          src={src || ""}
          layout="fill"
          objectFit="cover"
          alt={alt}
        ></Image>
      )}
    </div>
  );
}
