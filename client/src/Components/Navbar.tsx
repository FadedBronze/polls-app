import { useNavigate } from "react-router";
import { useAuthContext } from "./AuthContext";
import Profile from "./Profile";

export default function Navbar() {
  const redirect = useNavigate();
  const auth = useAuthContext();

  return (
    <nav className="w-full text-sm h-fit flex justify-between p-3 pb-0">
      <div className="flex gap-5 items-center">
        <h2>Polls App</h2>
        <img src="#"></img>
      </div>
      <button
        onClick={() => {
          if (!auth.authed) return;

          fetch("/api/", {
            headers: {
              ...auth.data.authHeader,
            },
          })
            .then((res) => res.json())
            .then((message) => console.log(message));
        }}
      >
        Magical Login Powers!
      </button>
      {!auth.authed && (
        <div className="flex gap-5">
          <button
            onClick={() => {
              redirect("/auth");
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              redirect("/auth");
            }}
          >
            Sign Up
          </button>
        </div>
      )}
      {auth.authed && <Profile {...auth.data}></Profile>}
    </nav>
  );
}
