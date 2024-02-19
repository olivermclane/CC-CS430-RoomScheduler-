import axios from "axios";

let isRefreshing = false;
let subscribers = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            window.location.href = '/login'; // Redirect to login (if not using callback)
          }

          const refreshedResponse = await axios.post(
            "http://localhost:8000/login/refresh/",
            { refresh: refreshToken },
            { withCredentials: true }
          );

          const { access: newAccessToken, refresh: newRefreshToken } = refreshedResponse.data;

          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken);

          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          subscribers.forEach((callback) => callback(newAccessToken));
          subscribers = [];
          isRefreshing = false;

          return axios(originalRequest);
        } catch (error) {
          isRefreshing = false;
          return Promise.reject(error);
        }
      } else {
        return new Promise((resolve) => {
          subscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);
