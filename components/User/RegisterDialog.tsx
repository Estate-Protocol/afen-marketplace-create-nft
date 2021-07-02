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

interface RegisterDialogProps {
  isOpen?: boolean;
  toggle: () => void;
  onRegister: (
    data: Pick<User, "name" | "email" | "password">
  ) => Promise<void>;
  onOpenLoginDialog: () => void;
}

export const RegisterDialog: React.FC<RegisterDialogProps> = ({
  isOpen,
  toggle,
  onRegister,
  onOpenLoginDialog,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] =
    React.useState<{ [key: string]: string | null }>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onRegister({ name, email, password });
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

  const disabled =
    validateName(name) || validateEmail(email) || validatePassword(password);

  return (
    <Dialog isOpen={isOpen} onCloseDialog={toggle}>
      <div className="md:w-80">
        <Title>Register</Title>
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
          <div className="mt-4">
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
              style="mt-6"
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
