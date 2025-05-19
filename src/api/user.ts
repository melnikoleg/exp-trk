import api, { clearAccessToken } from "./axiosInstance";

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/users/me");
  return data;
}

// Password reset flow
export async function forgotPassword(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export interface RestorePasswordParams {
  email: string;
  code: string;
  password: string;
}

export async function restorePassword(
  params: RestorePasswordParams,
): Promise<void> {
  await api.post("/auth/restore-password", params);
}

// Logout function
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Error handling is done in finally block
  } finally {
    clearAccessToken();
  }
}
