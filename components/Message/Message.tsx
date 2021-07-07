import React from "react";
import { NotificationData } from "../Notification";
import classnames from "classnames";
import Typography from "../IO/Typography";
import { BaseComponent } from "../../types/BaseComponent";
import Flex from "../Layout/Flex";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../IO/Button";

export interface MessageProps extends BaseComponent {
  data: NotificationData;
  dismissable?: boolean;
  onDismiss?: () => void;
}

export const Message: React.FC<MessageProps> = ({
  data,
  style,
  dismissable = true,
  onDismiss,
}) => {
  const messageType = () => {
    let messageColors;
    switch (data.status) {
      case "error":
        messageColors = "bg-red-500 text-white";
        break;
      case "success":
        messageColors = "bg-green-500 text-white";
        break;
      case "info":
      default:
        messageColors = "bg-blue-500 text-white";
    }

    return messageColors;
  };

  return (
    <div className={classnames(messageType(), "py-2 px-4 rounded-xl", style)}>
      <Flex spaceBetween center>
        <Typography>{data.text}</Typography>
        {dismissable && (
          <Button type="plain" onClick={onDismiss} inputType="button">
            <IoCloseSharp className="text-xl" />
          </Button>
        )}
      </Flex>
    </div>
  );
};
