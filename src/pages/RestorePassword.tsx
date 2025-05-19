import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { InputLabel } from "../components/InputLabel";
import { Button } from "../components/Button";
import styles from "../components/AuthLayout/index.module.css";
import { restorePassword } from "../api/user";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[0-9]/, "Password must contain a number"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

type RestorePasswordInputs = {
  password: string;
  confirmPassword: string;
};

const RestorePassword = () => {
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestorePasswordInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RestorePasswordInputs) => {
    setApiError("");
    setIsLoading(true);
    try {
      await restorePassword({
        email,
        code,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/success"), 1000);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Set New Password</h2>
      {success ? (
        <div style={{ color: "green", marginBottom: 16 }}>
          Password reset! Redirecting...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <InputLabel htmlFor="password">New Password</InputLabel>
            <Input
              id="password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className={styles.field}>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
            />
          </div>
          {apiError && (
            <div style={{ color: "red", marginBottom: 8 }}>{apiError}</div>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Link
              to="/verification-code"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              Back to Verification Code
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default RestorePassword;
