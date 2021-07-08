import React, { Component } from "react";
import Container from "../Layout/Container";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import TextInput from "../IO/TextInput";
import TextArea from "../IO/TextArea";
import Flex from "../Layout/Flex";
import Button from "../IO/Button";
import Image from "next/image";
import { CreateFormResponse } from "../../pages/create";
import Router from "next/router";
import { UserDetails } from "../User/UserProvider";
// import MenuDropdown from "@/design-system/MenuDropdown";

export interface CreateFormInput {
  upload: File | null;
  bnbPrice: number;
  afenPrice: number;
  minimumBid?: number;
  startDate?: string;
  endDate?: string;
  title: string;
  description?: string;
  royalty?: number;
  currencySelected: "AFEN" | "BNB";
  properties?: {
    [key: string]: string;
  }[];
}

interface IProps {
  wallet: string;
  loading: boolean;
  user: UserDetails;
  message?: CreateFormResponse;
  onSubmit: (data: CreateFormInput) => void;
}

interface IState extends CreateFormInput {
  previewImage: string | null;
  errors?: { [key: string]: string | null };
}

enum NFTProperties {
  Height = "Height",
  Width = "Width",
  Depth = "Depth",
  Medium = "Medium",
}

export default class CreateFormPage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      upload: null,
      bnbPrice: 0,
      afenPrice: 0,
      minimumBid: 0,
      startDate: "",
      endDate: "",
      title: "",
      description: "",
      properties: [],
      currencySelected: "AFEN",
      errors: null,
      previewImage: null,
    };
  }

  onAddProperty = (property: string) => {
    if (this.state.properties.length < 5) {
      const properties = [...this.state.properties, { [property]: "" }];
      this.setState({ properties });
    }
  };

  onRemoveProperty = (index: number) => {
    const properties = [...this.state.properties];
    properties.splice(index, 1);
    this.setState({ properties });
  };

  handlePropertyChange = (index, property, value) => {
    const properties = [...this.state.properties];
    properties[index] = { [property]: value };
    this.setState({ properties });
  };

  isPropertyDisabled = (key: string) => {
    return !!this.state.properties.find(
      (property) => Object.keys(property)[0].toLowerCase() === key.toLowerCase()
    );
  };

  properties = () =>
    Object.values(NFTProperties).map((value) => ({
      label: value,
      value: value.toLowerCase(),
      disabled: this.isPropertyDisabled(value),
      onClick: (data) => this.onAddProperty(data as string),
    }));

  canSubmit = () => {
    return (
      this.state.upload &&
      this.state.title.length &&
      (this.state.afenPrice > 0 || this.state.bnbPrice > 0) &&
      this.state.royalty <= 20 &&
      this.state.description?.length
    );
  };

  handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      upload: e.target.files[0],
    });
    if (e.target.files[0]) {
      this.setState({
        previewImage: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  handleRoyaltyInput = (data: string) => {
    const value = parseFloat(data);
    if (value > 20) {
      this.setState({
        errors: {
          ...this.state.errors,
          royalty: "Your royalty cannot be greater than 20% 😅",
        },
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          royalty: null,
        },
      });
    }

    this.setState({
      royalty: parseFloat(data),
    });
  };

  handlePriceSelection = (input: "AFEN" | "BNB") => {
    this.setState({ currencySelected: input });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.canSubmit()) {
      this.props.onSubmit({ ...this.state });
    }
  };

  render() {
    return (
      <Container style="mt-10 w-full md:mt-20 h-full md:w-10/12 xl:w-2/3">
        <Flex start>
          <div className="lg:pr-10 w-full md:w-1/2 lg:w-3/5">
            <Title>Create NFT</Title>
            <Typography sub style="md:w-3/4">
              Start your NFT journey by creating your first NFT. Notifications
              will be sent to you on status of your listed collectible. Royalty
              is capped at 20%.
            </Typography>

            <form onSubmit={this.handleSubmit}>
              <div className="mt-10">
                <div>
                  <Typography bold size="small">
                    Image
                    <span className="text-black dark:text-white"> *</span>
                  </Typography>
                  <div className="mt-5 lg:col-span-2 mb-0 sm:mb-10">
                    <div className="sm:overflow-hidden">
                      <div className="space-y-6 sm:pb-6">
                        <div>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={1}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="text-center mt-2 text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className={`relative cursor-pointer px-5 py-2 mb-2 rounded-full font-medium focus:outline-none focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-afen-yellow ${
                                    this.state.upload
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-100 dark:bg-white"
                                  }`}
                                >
                                  <span className="px-2">
                                    {this.state.upload
                                      ? "File Uploaded"
                                      : "Upload a file"}
                                  </span>
                                  <input
                                    id="file-upload"
                                    name="fileUpload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={this.handleImageInput}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500 mt-4">
                                PNG, JPG, GIF only up to 30MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 sm:mt-0">
                <div>
                  <div className="mt-2 lg:col-span-2 mb-0 sm:mb-5">
                    <div className="overflow-hidden">
                      <div className=" sm:pb-6">
                        <div className="grid grid-cols-12 gap-6">
                          <div
                            className={`col-span-6 pb-4 ${
                              this.state.currencySelected === "AFEN"
                                ? "border-afen-yellow  border-b-2"
                                : ""
                            } cursor-pointer`}
                            onClick={() => this.handlePriceSelection("AFEN")}
                          >
                            <Image src="/logo.png" width="30" height="30" />
                            <Typography bold>AFEN</Typography>
                            <Typography sub size="small">
                              Your NFT would be listed using the AFEN token.
                            </Typography>
                          </div>

                          <div
                            className={`col-span-6 cursor-pointer ${
                              this.state.currencySelected === "BNB"
                                ? "border-afen-yellow  border-b-2"
                                : ""
                            }`}
                            onClick={() => this.handlePriceSelection("BNB")}
                          >
                            <Image src="/bnb.png" width="30" height="30" />
                            <Typography bold>BNB</Typography>
                            <Typography sub size="small">
                              Your NFT would be listed using BNB.
                            </Typography>
                          </div>

                          <div className="col-span-12">
                            <TextInput
                              label={`${
                                this.state.currencySelected === "AFEN"
                                  ? "AFEN"
                                  : "BNB"
                              } Price`}
                              min={0}
                              required
                              value={
                                this.state.currencySelected === "AFEN"
                                  ? this.state.afenPrice
                                  : this.state.bnbPrice
                              }
                              type="number"
                              placeholder="0"
                              // description="Price cannot be 0"
                              append={
                                <Image
                                  src={
                                    this.state.currencySelected === "AFEN"
                                      ? "/logo.png"
                                      : "/bnb.png"
                                  }
                                  width="30"
                                  height="30"
                                />
                              }
                              onChange={(data) => {
                                this.state.currencySelected === "AFEN"
                                  ? this.setState({ afenPrice: data })
                                  : this.setState({ bnbPrice: data });
                              }}
                            />
                          </div>
                          <div className="col-span-full">
                            <TextInput
                              label={"Royalty"}
                              min={0}
                              max={20}
                              required
                              error={this.state.errors?.royalty}
                              value={this.state.royalty}
                              type="number"
                              description="Percentage paid to you as the creator anytime any a transation is made on this art (Post Sale)"
                              append={"%"}
                              onChange={this.handleRoyaltyInput}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-0">
                <div>
                  <div className="mt-2 lg:col-span-2">
                    <div className="overflow-hidden">
                      <div className="pb-5 space-y-6 lg:pb-6">
                        <div className="col-span-full">
                          <TextInput
                            label={"Title"}
                            value={this.state.title}
                            type="text"
                            required
                            description="This is important because it would appear everywhere your art does"
                            onChange={(data) => this.setState({ title: data })}
                          />
                        </div>

                        <div className="col-span-full">
                          <TextArea
                            required
                            label={"Description"}
                            value={this.state.description}
                            onChange={(data) =>
                              this.setState({ description: data })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="relative">
                    <div className="px-4 sm:pb-6">
                      <Flex spaceBetween style="mb-2 h-auto">
                        <div>
                          <Typography>Properties</Typography>
                          <Typography sub size="x-small">
                            Set properties like size, medium, type, etc.
                          </Typography>
                        </div>
                        <div className="absolute right-0 z-20">
                          <MenuDropdown
                            variant="add"
                            button={{
                              label: "Add",
                              icon: (
                                <AiOutlinePlus
                                  style={{ fill: "green" }}
                                  className="ml-2"
                                />
                              ),
                            }}
                            items={this.properties()}
                          />
                        </div>
                      </Flex>
                      {this.state.properties.map((property, index) => (
                        <div
                          className="grid grid-cols-12 gap-6 justify-items-stretch items-center"
                          key={index}
                        >
                          <div className="col-span-11 w-full">
                            <TextInput
                              label={
                                Object.keys(this.state.properties[index])[0]
                              }
                              value={Object.values(property)[0]}
                              type="text"
                              required
                              onChange={(data) =>
                                this.handlePropertyChange(
                                  index,
                                  Object.keys(this.state.properties[index])[0],
                                  data as string
                                )
                              }
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              type="plain"
                              icon
                              onClick={() => this.onRemoveProperty(index)}
                            >
                              <AiOutlineDelete className="text-2xl" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div> */}
                  </div>
                </div>

                <Flex style="mb-2 lg:mb-10">
                  <Button
                    loading={this.props.loading}
                    type="primary"
                    block
                    size="large"
                    inputType="submit"
                    disabled={!this.canSubmit()}
                  >
                    {this.props.message?.status === "success"
                      ? this.props.message?.text
                      : "Create"}
                  </Button>
                </Flex>
              </div>
            </form>
          </div>
          <div className="hidden md:block md:w-1/2 lg:w-2/5 lg:min-h-screen overflow-hidden md:pl-5 lg:pl-0">
            <div className="relative h-2/3 w-full border-2 dark:border-gray-500 rounded-xl md:p-8 lg:p-10">
              {this.state.previewImage ? (
                <img
                  src={this.state.previewImage}
                  className="h-full w-full object-cover shadow-2xl"
                />
              ) : (
                <Flex col center>
                  <div className="text-center my-auto">
                    <Typography>Image Preview</Typography>
                    <Typography sub size="x-small">
                      Image uploaded will show here
                    </Typography>
                  </div>
                </Flex>
              )}
            </div>
            <div className="mt-3">
              <div>
                <div className="">
                  <Title style="text-xl font-semibold truncate overflow-ellipsis overflow-hidden">
                    {this.state?.title || "---"}
                  </Title>
                  <div>
                    <div
                      className="flex items-center mt-1 cursor-pointer"
                      onClick={() =>
                        Router.push({ pathname: `/user/${this.props.wallet}` })
                      }
                    >
                      <div className="overflow-hidden rounded-full mr-1">
                        {/* {this.props.user?.avatar && (
                          <Image
                            src={this.props.user?.avatar || "/logo.png"}
                            layout="fixed"
                            width="30"
                            height="30"
                            objectFit="cover"
                            className="rounded-full"
                          ></Image>
                        )} */}
                      </div>
                      <Typography
                        textWidth="max-w-60"
                        truncate
                        style="text-gray-500"
                      >
                        {this.props.user?.user?.name}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <Typography bold sub size="x-small">
                    Price
                  </Typography>
                  <Typography bold style="text-xl">
                    {this.state?.currencySelected === "AFEN"
                      ? this.state.afenPrice.toString()
                      : this.state.bnbPrice.toString()}{" "}
                    {this.state.currencySelected}
                  </Typography>
                </div>
              </div>
              <div className="mt-5">
                <Typography bold sub size="x-small">
                  Description
                </Typography>
                <Typography style="md:text-sm">
                  {this.state.description || "---"}
                </Typography>
              </div>
            </div>
          </div>
        </Flex>
      </Container>
    );
  }
}
