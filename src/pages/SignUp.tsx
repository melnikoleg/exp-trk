import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../components/Input";
import { InputLabel } from "../components/InputLabel";
import { Button } from "../components/Button";
import styles from "../components/AuthLayout/index.module.css";
import api from "../api/axiosInstance";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number"),
});

export type SignUpInputs = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignUpInputs) => {
    setApiError("");
    try {
      await api.post("/auth/register", data);
      setSuccess(true);
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (err) {
      const error = err as Error & {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };
      const errorMessage = error.response?.data?.message || "Registration failed";
      setApiError(errorMessage);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Sign Up</h2>
      {success ? (
        <div style={{ color: "green", marginBottom: 16 }}>
          Registration successful! Redirecting...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
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
          {apiError && (
            <div style={{ color: "red", marginBottom: 16 }}>{apiError}</div>
          )}
          <Button type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
            Sign Up
          </Button>
        </form>
      )}
      <div className={styles["form-footer"]}>
        Already have an account?{" "}
        <Link to="/sign-in" className={styles.link}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
