import React, { FormEvent } from "react";
import { Dialog } from "../Dialog/Dialog";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import { User } from "./types/User";
import Link from "next/link";

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onRegister({ name, email, password });
    setLoading(false);
  };

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
              placeholder="john@example.com"
              type="text"
              value={name}
              onChange={setName}
            />
            <TextInput
              label="Email"
              placeholder="john@example.com"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <TextInput
              label="Password"
              placeholder="john@example.com"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <Button block loading={loading} style="mt-6" inputType="submit">
              Register
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
