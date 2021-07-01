import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import { NotificationData } from "./NotificationProvider";
import classNames from "classnames";
import { Dialog } from "../Dialog/Dialog";

interface NotificationDialogProps {
  data: NotificationData;
  close: () => void;
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  data,
  close,
}) => (
  <Dialog onCloseDialog={close}>
    <div className="md:w-96">
      <Flex spaceBetween center style="mb-5">
        <Title
          style={classNames({
            "text-red-500": data.status && data.status === "error",
            "text-green-500": data.status && data.status === "success",
          })}
        >
          {data.title}
        </Title>
        <IoCloseSharp
          className="text-3xl text-gray-400 cursor-pointer"
          onClick={() => close()}
        />
      </Flex>
      <Typography sub bold style="mb-2">
        {data.text}
      </Typography>
    </div>
  </Dialog>
);

NotificationDialog.displayName = "NotificationDialog";
export default NotificationDialog;
