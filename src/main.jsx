// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "@/App.jsx";
import "@/index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri = (import.meta.env.VITE_REDIRECT_URI || window.location.origin);

// Wrapper recomendado por Auth0 para usar navigate en onRedirectCallback
function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate();
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,              // Debe coincidir EXACTO con Callback URL
        audience: audience,                     // Para obtener access token de tu API
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"              // Estabiliza PKCE/silent auth
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || "/", { replace: true });
      }}
    >
      {children}
    </Auth0Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
