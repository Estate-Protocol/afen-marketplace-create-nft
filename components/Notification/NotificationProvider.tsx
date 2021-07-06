import React, { useState } from "react";

export enum NotificationDataStatusEnum {
  "ERROR" = "error",
  "SUCCESS" = "success",
  "INFO" = "info",
}
export interface NotificationData {
  status?: "error" | "success" | "info" | null;
  title?: string;
  text: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export interface INotifcationContext {
  data: NotificationData | null;
  notify: (value: NotificationData) => void;
  close: () => void;
}

export const NotifcationContext = React.createContext<INotifcationContext>({
  data: null,
  notify: undefined,
  close: undefined,
});

export const NotificationProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<NotificationData | null>(null);

  const notify = (data: NotificationData) => {
    setData(data);
  };

  const close = () => {
    setData(null);
  };

  return (
    <NotifcationContext.Provider
      value={{
        data,
        notify,
        close,
      }}
    >
      {children}
    </NotifcationContext.Provider>
  );
};

NotifcationContext.displayName = "NotifcationContext";
export const Notifcation = NotifcationContext.Consumer;
export default Notifcation;
