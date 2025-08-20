import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { login, fetchProfile } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import ErrorModal from "@/components/errorModal";
const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || window.location.origin;

const LoginForm = () => {
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    isAuthenticated,
    user,
    getIdTokenClaims,
    isLoading,
  } = useAuth0();
  const loginWithOauth = useAuthStore((s) => s.loginWithOauth);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [socialLoading, setSocialLoading] = useState(false);
  const ranOnceRef = useRef(false);
  useEffect(() => {
    if (isLoading || !isAuthenticated || ranOnceRef.current) return;
    ranOnceRef.current = true;
    (async () => {
      try {
        const access_token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        });

        const id_token = (await getIdTokenClaims())?.__raw;
        if (!id_token || !access_token) throw new Error("Tokens faltantes");

        const { success } = await loginWithOauth({ id_token, access_token });
        if (!success) throw new Error("Backend rechazó OAuth");

        const userProfile = await fetchProfile();
        setAuth(userProfile, access_token);
        const roles = (userProfile.roles || []).map((r) =>
          (r.Nombre || "").trim().toLowerCase()
        );
        navigate(
          roles.length === 1 && roles[0] === "estudiante"
            ? "/estudiante"
            : "/home"
        );
      } catch (e) {
        setSocialLoading(false);
        setErrorModal(true);
      }
    })();
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (window.location.search.includes("error")) {
      const params = new URLSearchParams(window.location.search);
      console.error(
        "OAuth error:",
        params.get("error"),
        params.get("error_description")
      );
      alert(
        "OAuth error: " +
          params.get("error") +
          " - " +
          params.get("error_description")
      );
    }
  }, []);
  const handleMicrosoftLogin = () => {
    console.log("=== INICIANDO LOGIN MICROSOFT ===");
    console.log("Current URL:", window.location.href);
    console.log("Expected redirect:", REDIRECT_URI);
    console.log("===================================");
    loginWithRedirect({
      authorizationParams: {
        prompt: "login",
        connection: "AzureADv2",
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      },
    });
  };

  const handleLoginLocal = async (e) => {
    e.preventDefault();
    try {
      const { access_token } = await login({
        username: email,
        password: pwd,
      });
      localStorage.setItem("access_token", access_token);

      const userProfile = await fetchProfile();
      setAuth(userProfile, access_token);

      const roles =
        userProfile.roles?.map((r) => (r.Nombre || "").trim().toLowerCase()) ||
        [];

      if (roles.length === 1 && roles[0] === "estudiante") {
        navigate("/estudiante");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setErrorModal(true);
    }
  };

  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const errorMessage = "Usuario o contraseña incorrecta";
  const passwordRef = useRef(null);
  const handleEmailKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };
  if (socialLoading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
        <svg
          className="animate-spin h-10 w-10 text-red-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <span className="text-red-700 text-xl font-bold">
          Cargando sesión...
        </span>
      </div>
    );
  } else {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-6xl w-full bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-10">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-center">
              {
                <img
                  src="/UTEPSA.png"
                  alt="Universidad Tecnológica Privada de Santa Cruz"
                  className="h-16"
                />
              }
            </div>
            <form onSubmit={handleLoginLocal}>
              {/* Form Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Ingresar
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                Inicia sesion para comenzar…
              </p>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyDown={handleEmailKeyDown}
                />
              </div>

              {/* Password */}
              <div className="mb-2 ">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Password
                </label>
                <Password
                  id="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full mb-4"
                  inputClassName="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 "
                  toggleMask
                  feedback={false}
                  tabIndex={2}
                  inputRef={passwordRef}
                />
              </div>
              <br />
              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm mb-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    inputId="remember"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="remember" className="text-gray-700">
                    Recordarme
                  </label>
                </div>
                <a href="#" className="text-red-600 font-medium">
                  Olvidaste tu Constrasena?
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                label="Login"
                className="w-full bg-red-700 hover:bg-red-800 border-none text-white font-semibold py-2 rounded-md transition"
                style={{ fontWeight: 400, background: "#ff0000" }}
              />
            </form>
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">
                O Iniciars Session Con
              </span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="flex space-x-4 items-center justify-center">
              <Button
                type="button"
                className="flex items-center justify-center border border-red-500 text-red-500 w-full py-2 rounded-md hover:bg-red-50 transition font-normal "
                style={{ fontWeight: 40, color: "#ff0000" }}
                icon={<i className={`fab fa-microsoft mr-2`} />}
                text
                onClick={handleMicrosoftLogin}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-10 relative">
            <img src=".." alt="UTEPSA" className="max-h-[400px]" />
            {/* Pagination Dots */}
            <div className="absolute bottom-5 flex space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
        </div>
        <ErrorModal
          show={errorModal}
          onClose={() => setErrorModal(false)}
          message={errorMessage}
        />
      </div>
    );
  }
};

export default LoginForm;
