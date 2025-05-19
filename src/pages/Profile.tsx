import React, { useEffect, useState } from "react";
import { fetchUserProfile, UserProfile, logout } from "../api/user";
import styles from "./Profile.module.css";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/storeContext";
import { Layout } from "../components/Layout";
import { setUserContext, clearUserContext, trackUserAction, captureException } from "../utils/sentry";
import SentryTest from "../components/SentryTest";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useStore();

  useEffect(() => {
    if (user) {
      setUserContext(String(user.id), {
        email: user.email,
        name: user.name || 'Unknown'
      });
      trackUserAction('profile_viewed', { has_profile_info: !!user.name });
    }
    return () => {
      clearUserContext();
    };
  }, [user]);

  useEffect(() => {
    fetchUserProfile()
      .then((userData) => {
        setUser(userData);
        trackUserAction('profile_loaded_successfully');
      })
      .catch((err) => {
        const errorMessage = "Failed to load user profile: " + (err.message || "Unknown error");
        setError(errorMessage);
        captureException(err, {
          context: 'Profile component',
          action: 'fetchUserProfile'
        });
      })
      .finally(() => setLoading(false));
  }, []);
  
  const handleLogout = async () => {
    try {
      trackUserAction('logout_attempt');
      await logout();
      clearUserContext();
      setIsAuthenticated(false);
      navigate('/sign-in');
      trackUserAction('logout_successful');
    } catch (error) {
      console.error("Logout failed:", error);
      captureException(error as Error, { action: 'logout' });
    }
  };

  const renderContent = () => {
    if (loading) return <div className={styles.profileCard}>Loading...</div>;
    if (error) return <div className={styles.profileCard}>{error}</div>;
    if (!user) return <div className={styles.profileCard}>No user data available</div>;

    return (
      <div className={styles.profileCard}>
        <h2>My Profile</h2>
        <div className={styles.profileField}>
          <strong>Email:</strong> {user.email}
        </div>
        {user.name && (
          <div className={styles.profileField}>
            <strong>Name:</strong> {user.name}
          </div>
        )}
        <div className={styles.profileActions}>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
        
        {/* Only show the Sentry test component in development mode */}
        {import.meta.env.DEV && (
          <SentryTest />
        )}
      </div>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default Profile;
