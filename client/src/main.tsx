import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Auth from "./Auth.tsx";
import ErrorModal from "./Components/ErrorModal.tsx";
import { PostContextProvider } from "./Components/PostContext.tsx";
import AuthContextProvider from "./Components/AuthContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthContextProvider>
        <PostContextProvider>
          <App></App>
        </PostContextProvider>
      </AuthContextProvider>
    ),
  },
  {
    path: "/auth",
    element: <Auth></Auth>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorModal>
      <RouterProvider router={router}></RouterProvider>
    </ErrorModal>
  </React.StrictMode>
);
