import { createContext, useContext, useEffect, useState } from "react";
import getDocumentCookie from "../utils/cookie";
import z from "zod";

const ClientUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  created: z.string(),
});

type ClientUser = z.infer<typeof ClientUserSchema>;

export type AuthData = ClientUser & {
  readonly authHeader: {
    "X-CSRF-Token": string;
  };
};

type AuthContextType =
  | { data: AuthData; setData: React.Dispatch<React.SetStateAction<AuthData>>; authed: true }
  | { authed: false };

const AuthContext = createContext<AuthContextType>({ authed: false });

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider(props: { children: React.JSX.Element }) {
  const [authData, setAuthData] = useState<AuthData>();

  useEffect(() => {
    const csrfToken = getDocumentCookie("csrfToken");

    const authHeader = {
      "X-CSRF-Token": csrfToken ?? "",
    };

    fetch("/api/user/", {
      method: "GET",
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((body) => {
        const clientUserData = ClientUserSchema.parse(body);

        setAuthData({ ...clientUserData, authHeader });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const value: AuthContextType =
    authData !== undefined
      ? {
          authed: true,
          setData: setAuthData as React.Dispatch<React.SetStateAction<AuthData>>,
          data: authData,
        }
      : {
          authed: false,
        };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
