import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { InputLabel } from "../components/InputLabel";
import { Button } from "../components/Button";
import styles from "../components/AuthLayout/index.module.css";

const schema = yup.object().shape({
  code: yup
    .string()
    .required("Code is required")
    .length(4, "Code must be 4 characters"),
});

type CodeInputs = {
  code: string;
};

const VerificationCode = () => {
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // Redirect if email is not provided
  React.useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CodeInputs) => {
    setApiError("");
    setIsLoading(true);

    try {
      navigate("/restore-password", { state: { email, code: data.code } });
    } catch {
      setApiError("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Enter Verification Code</h2>
      <p style={{ textAlign: "center", marginBottom: 16 }}>
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <InputLabel htmlFor="code">Code</InputLabel>
          <Input
            id="code"
            type="text"
            maxLength={4}
            {...register("code")}
            error={!!errors.code}
            helperText={errors.code?.message}
            autoFocus
            disabled={isLoading}
          />
        </div>
        {apiError && (
          <div style={{ color: "red", marginBottom: 8 }}>{apiError}</div>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Continue"}
        </Button>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link
            to="/forgot-password"
            style={{ color: "var(--primary-color)", textDecoration: "none" }}
          >
            Back to Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerificationCode;
