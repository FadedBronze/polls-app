import { useState } from "react";
import { AuthData } from "./AuthContext";

export default function Profile(props: Omit<AuthData, "authHeader">) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>{props.name}</button>
      {open && (
        <div className="absolute p-4 rounded-md bg-white shadow-md -bottom-10 translate-y-full right-0">
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
          <button onClick={() => {
            
          }}>Logout</button>
        </div>
      )}
    </div>
  );
}
