import React from "react";
import Image from "next/image";
import Typography from "../IO/Typography";
import { getInitials } from "../../utils/misc";

import classNames from "classnames";

export interface UserAvatarProps {
  image?: string;
  userId?: string;
  name: string;
  imageAlt?: string;
  verified?: boolean;
}

export default function UserAvatar({ name, image, imageAlt }: UserAvatarProps) {
  return (
    <div
      className={classNames(
        "w-7 h-7 bg-gray-200 relative overflow-hidden flex justify-center rounded-full mr-1"
      )}
    >
      {image ? (
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          alt={imageAlt}
        ></Image>
      ) : (
        <Typography bold>{getInitials(name)}</Typography>
      )}
    </div>
  );
}
