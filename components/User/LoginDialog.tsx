import React, { FormEvent } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";
import { LoginInput } from "../Auth";
import { Dialog } from "../Dialog/Dialog";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Title from "../IO/Title";
import Typography from "../IO/Typography";

interface LoginDialogProps {
  isOpen?: boolean;
  toggle: () => void;
  onLogin: (data: LoginInput) => Promise<void>;
  onOpenRegisterDialog: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({
  isOpen,
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
      password: password.length && validatePassword(password)
        ? "Please input a valid password"
        : undefined,
    });
  };

  const disabled = validateEmail(email) || validatePassword(password);

  return (
    <Dialog onCloseDialog={toggle} isOpen={isOpen}>
      <div className="md:w-80">
        <Title>Login</Title>
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
