import axios from "axios";

let accessToken: string | null = null;

const storedToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
if (storedToken) {
  accessToken = storedToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

export function clearAccessToken() {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

const api = axios.create({
  baseURL: "http://0.0.0.0:8079/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshData = accessToken ? { refresh_token: accessToken } : {};
        const { data } = await axios.post(
          "http://0.0.0.0:8079/api/auth/token",
          refreshData,
          { 
            withCredentials: true,
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
          },
        );
        setAccessToken(data.access_token);
        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = "Bearer " + data.access_token;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }


    return Promise.reject(error);
  },
);

export default api;
