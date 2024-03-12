import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import z from "zod";
import { useErrorModal } from "./Components/ErrorModal";

const LoginSchema = z.object({
  password: z.string(),
  email: z.string().email(),
});

const SignupSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
});

export default function Auth() {
  const [authMode, setAuthMode] = useState("Signup");
  const formRef = useRef<HTMLFormElement>(null);
  const redirect = useNavigate();

  const { createModal } = useErrorModal()

  const HandleLoginFromForm = async (formData: unknown) => {
    const authData = LoginSchema.safeParse(formData);

    if (!authData.success) throw new Error("invalid email or general format");

    const res = await fetch("/api/auth/login", {
      method: "POST", 
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData.data),
    });

    if (!res.ok) {
      throw new Error(await res.json());
    }
  };

  const HandleSignupFromForm = async (formData: unknown) => {
    const authData = SignupSchema.safeParse(formData);

    if (!authData.success) throw new Error("invalid email or general format");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData.data),
    });

    if (!res.ok) {
      throw new Error(await res.json());
    }

    return HandleLoginFromForm({
      email: authData.data.email,
      password: authData.data.password,
    });
  };

  const FormInput = (props: { value: string }) => (
    <label className="flex gap-2 flex-wrap text-xl">
      {props.value[0].toUpperCase() + props.value.substring(1)}:
      <input name={props.value} className="border-2 rounded border-gray-300 text-md"></input>
    </label>
  );

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col bg-gray-200">
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();

          if (formRef.current === null) return;
          const formData = new FormData(formRef.current);

          const res: Record<string, string> = {};

          for (const [key, value] of formData) {
            if (value instanceof File) {
              continue;
            }

            res[key] = value;
          }

          (async () => {
            try {
              if (authMode === "Login") {
                await HandleLoginFromForm(res)
                redirect("/")
                return;
              }

              await HandleSignupFromForm(res)
              redirect("/")
            } catch (error) {
              createModal((error as Error).message, "ERROR") 
            }
          })()
        }}

        className="sm:w-2/3 max-sm:w-full h-full flex flex-col justify-center bg-white p-5 gap-5"
      >
        <h1 className="text-4xl">{authMode}</h1>
        <div className="w-full h-0.5 bg-gray-300"></div>
        {authMode === "Signup" && <FormInput value="name"></FormInput>}
        <FormInput value="password"></FormInput>
        <FormInput value="email"></FormInput>
        <button type="submit" className="bg-blue-600 rounded-md text-white text-2xl h-12">
          {authMode}
        </button>
        <button
          type="button"
          onClick={() => setAuthMode((authMode) => (authMode === "Login" ? "Signup" : "Login"))}
        >
          {authMode === "Login" ? "Signup" : "Login"} instead?
        </button>
      </form>
    </div>
  );
}
