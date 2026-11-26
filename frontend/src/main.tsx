
  import { createRoot } from "react-dom/client";
  import { GoogleOAuthProvider } from '@react-oauth/google';
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/antd-custom.css";

  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId="425418224600-gdcmb7h6rq49nuc08frjrr5bosjgolo1.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  );
  