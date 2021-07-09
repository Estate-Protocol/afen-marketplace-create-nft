import React, { FormEvent } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { validateEmail, validatePassword } from "../../utils/validation";
import { LoginInput } from "../Auth";
import { Dialog } from "../Dialog/Dialog";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import { Message, MessageProps } from "../Message/Message";

interface LoginDialogProps {
  isOpen?: boolean;
  message?: MessageProps;
  toggle: () => void;
  onLogin: (data: LoginInput) => Promise<void>;
  onOpenRegisterDialog: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({
  isOpen,
  message,
  toggle,
  onLogin,
  onOpenRegisterDialog,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] =
    React.useState<{ [key: string]: string | null }>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onLogin({ email, password });
    setLoading(false);
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

  const disabled = !email.length || !password.length;

  return (
    <Dialog onCloseDialog={toggle} isOpen={isOpen}>
      <div className="md:w-80">
        <Flex spaceBetween center style="mb-3">
          <Title>Login</Title>
          <IoCloseSharp
            className="text-3xl text-gray-400 cursor-pointer"
            onClick={() => toggle()}
          />
        </Flex>

        <Typography size="small">
          Don't have an account?{" "}
          <Button
            type="plain"
            size="small"
            style="underline"
            onClick={onOpenRegisterDialog}
          >
            Register
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
            <TextInput
              label="Email"
              type="email"
              required
              value={email}
              error={errors?.email}
              onChange={handleEmailInput}
            />
            <TextInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={handlePasswordInput}
            />

            <Button
              block
              loading={loading}
              style="my-3"
              inputType="submit"
              disabled={disabled}
            >
              Login
            </Button>
            <div className="text-center">
              <Typography size="small" sub>
                Forgot your password?
              </Typography>
            </div>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
