import React, { FormEvent } from "react";
import useAuth from "../../hooks/useAuth";
import { Dialog } from "../Dialog/Dialog";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Title from "../IO/Title";

interface LoginDialogProps {
  close: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ close }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await login({ email, password });
    setLoading(false);
  };

  return (
    <Dialog onCloseDialog={close}>
      <div className="md:w-80">
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <TextInput
              label="Email"
              placeholder="john@example.com"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <TextInput
              label="Placeholder"
              placeholder="john@example.com"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <Button block loading={loading} style="mt-6" inputType="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
