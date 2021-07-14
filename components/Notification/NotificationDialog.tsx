import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import { NotificationData } from "./NotificationProvider";
import classNames from "classnames";
import { Dialog } from "../Dialog/Dialog";
import Button from "../IO/Button";

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
      <Flex spaceBetween center style="mb-3">
        <Title
          style={classNames({
            "text-red-500": data.status && data.status === "error",
            "text-green-500": data.status && data.status === "success",
            "text-blue-500": data.status && data.status === "info",
          })}
        >
          {data.title}
        </Title>
        <div>
          <IoCloseSharp
            className="text-3xl text-gray-400 cursor-pointer"
            onClick={() => close()}
          />
        </div>
      </Flex>
      <Typography sub bold style="mb-2">
        {data.text}
      </Typography>
      {data.action && (
        <Button
          block
          style="mt-3"
          type={data.action.buttonType || "outlined"}
          onClick={() => {
            data.action.onClick();
            close();
          }}
        >
          {data.action.text}
        </Button>
      )}
    </div>
  </Dialog>
);

NotificationDialog.displayName = "NotificationDialog";
export default NotificationDialog;
