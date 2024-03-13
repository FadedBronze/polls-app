import { createContext, useContext, useState } from "react";

type ErrorData = {
  createModal: (text: string, success: "ERROR" | "SUCCESS") => void;
};

const ErrorContext = createContext<ErrorData>({} as ErrorData);

// eslint-disable-next-line react-refresh/only-export-components
export const useErrorModal = () => useContext(ErrorContext);

export default function ErrorModal(props: { children: JSX.Element }) {
  const [modalUp, setModalUp] = useState(false);
  const [modalText, setModalText] = useState("");
  const [success, setSuccess] = useState(false);

  const createModal = (text: string, success: "ERROR" | "SUCCESS") => {
    setModalUp(true);
    setModalText(text);
    setSuccess(success === "SUCCESS");
    setTimeout(() => {
      setModalUp(false);
    }, 5000);
  };

  const color1 = success ? "#33ff6d" : "#fc685d";
  const color2 = success ? "#74fc9b" : "#ff8c8c";

  return (
    <>
      {modalUp && (
        <div
          className="fixed right-3 top-3 z-50 w-60 rounded-lg p-4 transition-opacity"
          style={{
            background: `repeating-linear-gradient(
          45deg,
          ${color1},
          ${color1} 10px,
          ${color2} 10px,
          ${color2} 20px
        )`,
          }}
        >
          <h3 className="font-bold">{success ? "SUCCESS" : "ERROR"}</h3>
          <p>{modalText}</p>
        </div>
      )}
      <ErrorContext.Provider value={{ createModal }}>
        {props.children}
      </ErrorContext.Provider>
    </>
  );
}
