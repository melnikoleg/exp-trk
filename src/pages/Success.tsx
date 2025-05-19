import { Link } from "react-router-dom";
import styles from "../components/AuthLayout/index.module.css";
import { Button } from "../components/Button";

const Success = () => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Password Reset Successful</h2>
      <p style={{ textAlign: "center", marginBottom: 24 }}>
        Your password has been successfully reset. You can now sign in with your
        new password.
      </p>
      <Link to="/sign-in" style={{ textDecoration: "none" }}>
        <Button style={{ width: "100%" }}>Sign In</Button>
      </Link>
    </div>
  );
};

export default Success;
