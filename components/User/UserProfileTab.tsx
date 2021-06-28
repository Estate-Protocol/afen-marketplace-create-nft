import React, { useState } from "react";
import Button from "../IO/Button";
import TextInput from "../IO/TextInput";
import Typography from "../IO/Typography";
import { User } from "./types/User";

interface UserProfileTabProps {
  data: User;
}

export default function UserProfileTab({ data }: UserProfileTabProps) {
  const [name, setName] = useState<string>(data?.name || "");
  const [email, setEmail] = useState<string>(data?.email || "");
  const [instagram, setInstagram] = useState<string>(data?.instragram || "");
  const [twitter, setTwitter] = useState<string>(data?.twitter || "");
  const [portfolioLink, setPortfolioLink] = useState<string>(
    data?.portfolio || ""
  );
  const [description, setDescription] = useState<string>(
    data?.description || ""
  );

  return (
    <div className="mt-5 w-full">
      <div className="mb-20">
        <div className="mb-5">
          <Typography size="large">Personal Information</Typography>
        </div>
        {/* <Flex wrap> */}
        <TextInput label="Name" value={name} onChange={setName}></TextInput>
        <div className="mx-auto md:mx-10"></div>
        <TextInput
          label="Email"
          value={email}
          type="text"
          onChange={setEmail}
        ></TextInput>
        {/* </Flex> */}
        <TextInput
          label="Description"
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
        {/* <Flex spaceBetween wrap> */}
        <TextInput
          label="Instagram"
          placeholder="@"
          value={instagram}
          type="text"
          // description="Laborum nulla dolor excepteur veniam pariatur et."
          onChange={setInstagram}
        ></TextInput>
        <div className="mx-auto md:mx-10"></div>
        <TextInput
          label="Twitter"
          value={twitter}
          placeholder="@"
          // description="Laborum nulla dolor excepteur veniam pariatur et."
          type="text"
          onChange={setTwitter}
        ></TextInput>
        {/* </Flex> */}
        <TextInput
          label="Link to Portfolio"
          value={portfolioLink}
          type="text"
          onChange={setPortfolioLink}
        ></TextInput>
        <Button size="large" style="mt-4">
          Save
        </Button>
      </div>
    </div>
  );
}
