import React, { FormEvent, useState } from "react";
import { validateName, validateLink } from "../../utils/validation";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Typography from "../IO/Typography";
import { User } from "./types/User";

interface UserProfileTabProps {
  data: User;
  loading: boolean;
  onSubmit: (
    data: Pick<User, "name" | "twitter" | "instagram" | "portfolio">
  ) => void;
}

export default function UserProfileTab({
  data,
  loading,
  onSubmit,
}: UserProfileTabProps) {
  const [name, setName] = useState<string>(data?.name || "");
  const [instagram, setInstagram] = useState<string>(data?.instagram || "");
  const [twitter, setTwitter] = useState<string>(data?.twitter || "");
  const [portfolio, setPortfolio] = useState<string>(data?.portfolio || "");
  const [description, setDescription] = useState<string>(
    data?.description || ""
  );
  const [errors, setErrors] =
    React.useState<{ [key: string]: string | null }>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ name, instagram, twitter, portfolio });
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

  const handleTwitterInput = (twitter: string) => {
    setTwitter(twitter);
    setErrors({
      ...errors,
      twitter:
        twitter.length && validateLink(twitter)
          ? "Please ensure this is a valid link"
          : undefined,
    });
  };

  const handleInstagramInput = (instagram: string) => {
    setInstagram(instagram);
    setErrors({
      ...errors,
      instagram:
        instagram.length && validateLink(instagram)
          ? "Please ensure this is a valid link"
          : undefined,
    });
  };

  const handlePortfolioInput = (portfolio: string) => {
    setPortfolio(portfolio);
    setErrors({
      ...errors,
      portfolio:
        portfolio.length && validateLink(portfolio)
          ? "Please ensure this is a valid link"
          : undefined,
    });
  };

  const disabled =
    validateName(name) ||
    validateLink(twitter) ||
    validateLink(instagram) ||
    validateLink(portfolio) ||
    loading ||
    !!errors?.length;

  return (
    <div className="md:w-5/12 mt-5 w-full">
      <form onSubmit={handleSubmit}>
        <div className="mb-20">
          <div className="mb-5">
            <Typography size="large">Personal Information</Typography>
          </div>

          <TextInput
            label="Name"
            required
            disabled={loading}
            value={name}
            error={errors?.name}
            onChange={handleNameInput}
          ></TextInput>
          <div className="mx-auto md:mx-10"></div>

          <TextInput
            label="Description"
            disabled={loading}
            value={description}
            type="text"
            placeholder="A breif description about yourself"
            onChange={setDescription}
          ></TextInput>
        </div>
        <div>
          <div className="mb-5">
            <Typography size="large">Socials and Links</Typography>
            <Typography sub size="x-small">
              Connecting your socials could increase engagements.
            </Typography>
          </div>

          <TextInput
            label="Instagram"
            placeholder="@"
            disabled={loading}
            value={instagram}
            type="text"
            error={errors?.instagram}
            onChange={handleInstagramInput}
          ></TextInput>
          <div className="mx-auto md:mx-10"></div>
          <TextInput
            label="Twitter"
            value={twitter}
            disabled={loading}
            placeholder="@"
            type="text"
            error={errors?.twitter}
            onChange={handleTwitterInput}
          ></TextInput>

          <TextInput
            label="Link to Portfolio"
            value={portfolio}
            disabled={loading}
            type="text"
            error={errors?.portfolio}
            onChange={handlePortfolioInput}
          ></TextInput>
          <Button
            size="large"
            style="mt-4"
            block
            disabled={disabled}
            loading={loading}
            inputType="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
