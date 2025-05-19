import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "./index.module.css";

const AuthLayout: React.FC = () => {
  const location = useLocation();

  const isPage = (path: string) => location.pathname.includes(path);

  const getSubtitle = (): string | null => {
    if (isPage("sign-in"))
      return "Welcome back! Sign in to manage your expenses";
    if (isPage("sign-up"))
      return "Create a new account to start tracking expenses";
    if (isPage("forgot-password"))
      return "Enter your email to reset your password";
    if (isPage("verification-code")) return "Enter the code sent to your email";
    if (isPage("restore-password")) return "Create a new secure password";
    if (isPage("success")) return null;
    return null;
  };

  const subtitle = getSubtitle();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <header className={styles.header}>
          <Link to="/" className={styles.logo}>
            <h1 className={styles.title}>Expense Tracker</h1>
          </Link>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
