import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Input } from "../components/Input";
import { InputLabel } from "../components/InputLabel";
import { Button } from "../components/Button";
import styles from "../components/AuthLayout/index.module.css";
import api, { setAccessToken } from "../api/axiosInstance";
import { useStore } from "../store/storeContext";
import { trackUserAction, captureException } from "../utils/sentry";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type SignInInputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInputs>({
    resolver: yupResolver(schema),
  });

  // Get the path user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // On mount, check for token in localStorage and set auth state
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      navigate(from, { replace: true });
    }
  }, [setIsAuthenticated, navigate, from]);

  const onSubmit = async (data: SignInInputs) => {
    setApiError("");
    trackUserAction("sign_in_attempt", { email: data.email });

    try {
      const response = await api.post("/auth/login", data);
      setAccessToken(response.data.access_token);
      setIsAuthenticated(true);
      trackUserAction("sign_in_success", { email: data.email });
      navigate(from, { replace: true });
    } catch (err) {
      // Type assertion to Error to satisfy captureException requirements
      const error = err as Error & {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      setApiError(errorMessage);

      // Track login failures for security monitoring
      captureException(error, {
        context: "Authentication",
        action: "sign_in",
        errorType: error.response?.status || "unknown",
        errorMessage,
      });

      trackUserAction("sign_in_failed", {
        email: data.email,
        reason: errorMessage,
        statusCode: error.response?.status || 0,
      });
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </div>
        <div className={styles.field}>
          <Link
            to="/forgot-password"
            className={styles.link}
            style={{ fontSize: "0.9rem" }}
          >
            Forgot password?
          </Link>
        </div>
        {apiError && (
          <div style={{ color: "red", marginBottom: 16 }}>{apiError}</div>
        )}
        <Button type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
          Sign In
        </Button>
      </form>
      <div className={styles["form-footer"]}>
        Don't have an account?{" "}
        <Link to="/sign-up" className={styles.link}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
