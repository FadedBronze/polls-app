import { useState } from "react";
import { AuthData } from "./AuthContext";
import { useErrorModal } from "./ErrorModal";
import { useNavigate } from "react-router";

export default function Profile(props: AuthData) {
  const [open, setOpen] = useState(false);
  const { createModal } = useErrorModal();
  const redirect = useNavigate();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>{props.name}</button>
      {open && (
        <div className="absolute z-10 p-4 rounded-md bg-white bg-opacity-40 backdrop-blur-md shadow-md -bottom-2 translate-y-full right-0">
          <h3>Hello {props.name}</h3>
          <span>{props.email}</span>
          <span>{props.created}</span>
          <button
            onClick={() => {
              console.log("delete");
            }}
          >
            Delete Account
          </button>
          <button
            onClick={() => {
              fetch("/api/auth/logout", {
                method: "DELETE",
                headers: {
                  ...props.authHeader,
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  createModal(data, "SUCCESS");
                  redirect("/auth");
                })
                .catch((err: Error) => createModal(err.message, "ERROR"));
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
