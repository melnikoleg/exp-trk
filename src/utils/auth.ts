import { clearAccessToken, setAccessToken } from "../api/axiosInstance";
import { fetchUserProfile } from "../api/user";

export async function initAuth(): Promise<boolean> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    clearAccessToken();
    return false;
  }

  try {
    setAccessToken(token);

    await fetchUserProfile();

    return true;
  } catch (error) {
    console.error("Auth validation failed:", error);
    clearAccessToken();
    return false;
  }
}
