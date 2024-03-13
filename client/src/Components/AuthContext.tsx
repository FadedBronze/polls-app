import { createContext, useEffect, useState } from "react";

type AuthData = {
  name: string;
  email: string;
  authHeader: {
    "X-CSRF-Token": string;
  };
};

const AuthContext = createContext<
  | { data: AuthData; setData: React.Dispatch<React.SetStateAction<AuthData>>; ready: true }
  | { ready: false }
>({ ready: false });

export default function AuthContextProvider(props: { children: React.JSX.Element }) {
  const [authData, setAuthData] = useState();

  useEffect(() => {}, []);

  return <AuthContext.Provider>{props.children}</AuthContext.Provider>;
}
