import React, { useState } from "react";
import { FcCheckmark } from "react-icons/fc";
import { copyToClipboard, parseUrl } from "../../utils/misc";
import Tabs from "../../components/Tabs/Tabs";
import Typography from "../../components/IO/Typography";
import { HiDuplicate } from "react-icons/hi";
import { User } from "../../types/User";
import { useRouter } from "next/router";
import withAuth from "../../components/HOC/withAuth";
import { getUser, updateUser } from "../../components/User/api";
import { parseCookies } from "../../utils/auth";
import { authCookieName } from "../../components/Auth/apis/auth";
import Flex from "../../components/Layout/Flex";
import UserProfileTab from "../../components/User/UserProfileTab";
import cookieCutter from "cookie-cutter";
import useNotifier from "../../hooks/useNotifier";
import { messages } from "../../constants/messages";
import useAuth from "../../hooks/useAuth";
import UserNFTTab from "../../components/User/UserNFTTab";
import { GrTwitter, GrInstagram } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi";
import Image from "next/image";

interface UserProfilePageProps {
  authUser: User | null;
}

export async function getServerSideProps({ params, req }) {
  const { id } = params;
  const cookies = parseCookies(req);
  const token = cookies[authCookieName];
  if (id) {
    return getUser(id, token)
      .then((user) => {
        return {
          props: { authUser: user },
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          notFound: true,
        };
      });
  } else {
    return {
      notFound: true,
    };
  }
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  authUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotifier();
  const { logout } = useAuth();
  const router = useRouter();

  const { _id, name, wallet, twitter, instagram, portfolio } = authUser;

  console.log(wallet);

  React.useEffect(() => {}, []);

  const handleUserUpdate = async (
    data: Pick<User, "name" | "twitter" | "instagram" | "portfolio">
  ) => {
    setLoading(true);
    const token = cookieCutter.get(authCookieName);

    updateUser({ ...data, _id }, token)
      .then(() => {
        setLoading(false);
        notify(messages.savedChanges);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          logout();
          router.push("/");
          notify(messages.sessionExpired);
        } else {
          notify(messages.somethingWentWrong);
        }
      });
  };

  return (
    <div>
      <div
        className="w-screen h-80 relative bg-gray-100 dark:bg-gray-900"
        style={{ minHeight: "280px", height: "280px" }}
      ></div>
      <div
        className="rounded-full h-40 w-40 shadow-md p-2 ring-4 ring-afen-yellow  flex items-center justify-center relative overflow-hidden -mt-20 mb-8 mx-auto bg-gray-100"
        style={{ width: "160px", height: "160px", marginTop: "-80px" }}
      ></div>
      <div className="flex justify-center mx-auto text-center">
        <div className="text-center">
          <Typography size="large" bold>
            {name}
          </Typography>
          <Flex>
            <Typography sub truncate textWidth="w-60" bold>
              {authUser?.wallet}
            </Typography>
            {copied ? (
              <FcCheckmark className="ml-2 h-5 w-5" />
            ) : (
              <HiDuplicate
                onClick={() => copyToClipboard(authUser?.wallet, setCopied)}
                className={`ml-2 h-5 w-5 text-orange-300 group-hover:text-opacity-80 transition ease-in-out duration-150 cursor-pointer`}
                aria-hidden="true"
              />
            )}
          </Flex>
          <div className="mt-2">
            {twitter?.length && (
              <div>
                <a
                  className="inline-flex items-center"
                  href={twitter}
                  target="_blank"
                >
                  <GrTwitter className="text-md mr-1" />
                  <Typography sub size="small">
                    {parseUrl(twitter)}
                  </Typography>
                </a>
              </div>
            )}
            {instagram?.length && (
              <div>
                <a
                  className="inline-flex items-center"
                  href={instagram}
                  target="_blank"
                >
                  <GrInstagram className="text-md mr-1" />
                  <Typography sub size="small" style="ml-2">
                    {parseUrl(instagram)}
                  </Typography>
                </a>
              </div>
            )}
            {portfolio?.length && (
              <div>
                <a
                  className="inline-flex items-center"
                  href={portfolio}
                  target="_blank"
                >
                  <HiOutlineLink className="text-md mr-1" />
                  <Typography sub size="small">
                    {parseUrl(portfolio)}
                  </Typography>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto px-5 md:px-10 lg:px-16 overflow-x-hidden mt-0 mb-10">
        <div className="mt-16 mx-auto">
          <Tabs
            tabs={[
              {
                title: "Profile",
                body: (
                  <UserProfileTab
                    data={authUser}
                    loading={loading}
                    onSubmit={handleUserUpdate}
                  />
                ),
              },
              {
                title: "NFTs",
                body: <UserNFTTab wallet={wallet} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

UserProfilePage.displayName = "UserProfilePage";
export default withAuth(UserProfilePage);
