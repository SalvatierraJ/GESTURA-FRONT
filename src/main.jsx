import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "@/App.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;

// Debug de configuración OAuth
console.log('=== CONFIGURACIÓN OAUTH ===');
console.log('Domain:', domain);
console.log('Client ID:', clientId);
console.log('Audience:', audience);
console.log('Redirect URI:', redirectUri);
console.log('Current Origin:', window.location.origin);
console.log('===========================');

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);
