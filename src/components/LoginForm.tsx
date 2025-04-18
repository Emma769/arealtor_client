import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { PiSignInBold } from "react-icons/pi";
import Spinner from "./ui/Spinner";
import { validate } from "../utils/validator";
import { api } from "../api";
import useAuth from "../hooks/useAuth";
import { type LoginParam, loginParamSchema } from "../schemas/auth";

type FetchState = "IDLE" | "SUBMITTING" | "FAIL" | "FULFILL";

export default function LoginForm() {
  const { setPayload, payload, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(payload.token);
  }, []);

  const [fetchState, setFetchState] = useState<FetchState>("IDLE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<keyof LoginParam, string>
  >({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({ email: "", password: "" });

    const param = {
      email,
      password,
    };

    const { errors } = validate(param, loginParamSchema);
    if (errors) {
      setValidationErrors(errors);
      return;
    }

    try {
      setFetchState("SUBMITTING");
      const resp = await api.post("/api/auth/login", param, {
        withCredentials: true,
      });
      setPayload(resp.data);
      navigate(location.state?.from?.pathname || "/");
      setFetchState("FULFILL");
      setEmail("");
      setPassword("");
    } catch (err) {
      setFetchState("FAIL");
      if (isAxiosError(err) && err.status !== 422) {
        const message =
          err.response?.data?.error || err.response?.data?.data || err.message;
        setError(message);
        return;
      }
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("something went wrong");
    }
  };

  return (
    <div className="sm:pt-12">
      <div className="flex flex-col justify-center items-center">
        <PiSignInBold className="text-2xl" />
        <p className="text-2xl font-semibold py-1 text-center">Sign In</p>
        <small className="opacity-70 text-xs text-center">
          Welcome, provide your details to sign in
        </small>
      </div>
      {error && (
        <div className="text-center my-0.5">
          <small className="text-xs text-red-400 capitalize">{error}!</small>
        </div>
      )}
      <form className="text-sm pt-2" onSubmit={handleSubmit}>
        <div className="my-4">
          <label htmlFor="email_id" className="text-xs font-semibold">
            Email:
          </label>
          <input
            type="email"
            className="border border-gray-200 outline-gray-300 bg-gray-100 rounded p-3 w-full"
            id="email_id"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {validationErrors && validationErrors.email && (
            <small className="text-red-400 text-xs block capitalize">
              {validationErrors.email}
            </small>
          )}
        </div>
        <div className="my-4">
          <label htmlFor="password_id" className="text-xs font-semibold">
            Password:
          </label>
          <input
            type="password"
            className="border border-gray-200 bg-gray-100 outline-gray-300 rounded p-3 w-full"
            id="password_id"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {validationErrors.password && (
            <small className="text-red-400 text-xs block capitalize">
              {validationErrors.password}
            </small>
          )}
        </div>
        <div className="mt-4">
          <button
            className="border border-[#6c63ff] flex items-center justify-center w-full p-3 rounded cursor-pointer bg-[#6c63ff] hover:bg-[#3f3d56] hover:border-[#3f3d56] text-white font-semibold transition-colors"
            disabled={fetchState === "SUBMITTING"}
          >
            {fetchState === "SUBMITTING" ? <Spinner /> : <span>Login</span>}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-1">
          <input
            type="checkbox"
            id="remember-id"
            checked={persist}
            onChange={() => setPersist(!persist)}
          />
          <label htmlFor="remember-id" className="text-xs">
            Remember me?
          </label>
        </div>
      </form>
    </div>
  );
}
