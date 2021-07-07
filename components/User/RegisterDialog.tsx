import React, { FormEvent } from "react";
import { Dialog } from "../Dialog/Dialog";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import { User } from "./types/User";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";
import { Message, MessageProps } from "../Message/Message";
import Image from "next/image";
import useUser from "../../hooks/useUser";
import { GrCheckmark } from "react-icons/gr";
import { MdContentCopy } from "react-icons/md";
import { copyToClipboard } from "../../utils/misc";
import classNames from "classnames";
import { IoCloseSharp } from "react-icons/io5";
import Flex from "../Layout/Flex";

interface RegisterDialogProps {
  isOpen?: boolean;
  message?: MessageProps;
  toggle: () => void;
  onRegister: (
    data: Pick<User, "name" | "email" | "password" | "wallet">
  ) => Promise<void>;
  onOpenLoginDialog: () => void;
}

export const RegisterDialog: React.FC<RegisterDialogProps> = ({
  isOpen,
  message,
  toggle,
  onRegister,
  onOpenLoginDialog,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [wallet, setWallet] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] =
    React.useState<{ [key: string]: string | null }>(null);
  const [copied, setCopied] = React.useState(false);

  const { user, isConnectingWallet, connectWallet, disconnectWallet } =
    useUser();

  React.useEffect(() => {
    if (user?.address) {
      setWallet(user?.address);
    }
  }, [user?.address]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onRegister({ name, email, password, wallet });
    setLoading(false);
  };

  const handleNameInput = (name: string) => {
    setName(name);
    setErrors({
      name:
        name.length && validateName(name)
          ? "Please ensure this is your name"
          : undefined,
    });
  };

  const handleEmailInput = (email: string) => {
    setEmail(email);
    setErrors({
      ...errors,
      email:
        email.length && validateEmail(email)
          ? "Please input a valid email address"
          : undefined,
    });
  };

  const handlePasswordInput = (password: string) => {
    setPassword(password);
    setErrors({
      ...errors,
      password:
        password.length && validatePassword(password)
          ? "Please input a valid password"
          : undefined,
    });
  };

  const walletConnected = !!user?.address;

  const disabled =
    validateName(name) ||
    validateEmail(email) ||
    validatePassword(password) ||
    !wallet;

  return (
    <Dialog isOpen={isOpen} onCloseDialog={toggle}>
      <div className="md:w-80">
        <Flex spaceBetween center style="mb-3">
          <Title>Register</Title>
          <IoCloseSharp
            className="text-3xl text-gray-400 cursor-pointer"
            onClick={() => toggle()}
          />
        </Flex>
        <Typography size="small" style="mb">
          Already have an account?{" "}
          <Button
            type="plain"
            size="small"
            style="underline"
            onClick={onOpenLoginDialog}
          >
            Login
          </Button>
        </Typography>
        <form onSubmit={handleSubmit}>
          {message?.data.text && (
            <Message
              data={message.data}
              dismissable={message.dismissable}
              onDismiss={message.onDismiss}
              style="mt-4"
            />
          )}
          <div className="mt-4">
            <Button
              type="secondary"
              block
              icon
              style={classNames("mb-4", {
                "border-green-500 mb-0": walletConnected,
              })}
              inputType="button"
              loading={isConnectingWallet}
              disabled={isConnectingWallet}
              onClick={user?.address ? undefined : connectWallet}
            >
              {walletConnected ? (
                <>
                  <Typography style="mr-2 text-green-500">
                    Wallet Connected
                  </Typography>
                  <IoCloseSharp
                    className="text-2xl mr-2"
                    onClickCapture={disconnectWallet}
                  />
                  {copied ? (
                    <GrCheckmark className="text-xl" />
                  ) : (
                    <MdContentCopy
                      className="text-xl"
                      onClickCapture={() =>
                        copyToClipboard(user.address, setCopied)
                      }
                    />
                  )}
                </>
              ) : (
                <>
                  <Typography style="mr-2">Connect Wallet</Typography>
                  <Image
                    src="/metamask.svg"
                    width={24}
                    height={24}
                    layout="fixed"
                  />
                </>
              )}
            </Button>

            <TextInput
              label="Name"
              type="text"
              required
              value={name}
              success={!errors?.name && name.length > 0}
              error={errors?.name}
              onChange={handleNameInput}
            />
            <TextInput
              label="Email"
              type="email"
              required
              success={!errors?.email && email.length > 0}
              value={email}
              error={errors?.email}
              onChange={handleEmailInput}
            />
            <TextInput
              label="Password"
              type="password"
              required
              value={password}
              description={
                "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
              }
              success={!errors?.password && password.length > 0}
              error={errors?.password}
              persistDescription={true}
              onChange={handlePasswordInput}
            />
            <Button
              block
              loading={loading}
              style="mt-8"
              inputType="submit"
              disabled={disabled}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
