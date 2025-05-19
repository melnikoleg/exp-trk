import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { InputLabel } from "../components/InputLabel";
import { Button } from "../components/Button";
import styles from "../components/AuthLayout/index.module.css";
import { forgotPassword } from "../api/user";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ForgotPasswordInputs = {
  email: string;
};

const ForgotPassword = () => {
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setApiError("");
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
      setTimeout(
        () => navigate("/verification-code", { state: { email: data.email } }),
        1000,
      );
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Forgot Password</h2>
      {success ? (
        <div style={{ color: "green", marginBottom: 16 }}>
          Reset code sent! Redirecting...
        </div>
      ) : (
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
              disabled={isLoading}
            />
          </div>
          {apiError && (
            <div style={{ color: "red", marginBottom: 8 }}>{apiError}</div>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Code"}
          </Button>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <a
              href="/sign-in"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              Back to Sign In
            </a>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
