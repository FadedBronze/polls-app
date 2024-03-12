import { useNavigate } from "react-router";
import getDocumentCookie from "../utils/cookie";

export default function Navbar() {
  const redirect = useNavigate();

  return (
    <nav className="w-full h-20 flex justify-between p-5">
      <div className="flex gap-5">
        <h2>Polls App</h2>
        <img src="#"></img>
      </div>
      <button
        onClick={() => {
          fetch("/api/", {
            headers: {
              "X-CSRF-Token": getDocumentCookie("csrfToken") ?? "",
            },
          })
            .then((res) => res.json())
            .then((message) => console.log(message));
        }}
      >
        Magical Login Powers!
      </button>
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
    </nav>
  );
}
