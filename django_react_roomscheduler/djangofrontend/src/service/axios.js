import axios from "axios";

let isRefreshing = false;
let subscribers = [];

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function processQueue(error, token = null) {
  subscribers.forEach((callback) => callback(token));
  subscribers = []; // Clear queue after processing
}

function forceLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = '/login'; // Ensure this is the correct path for your login page
  isRefreshing = false;
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          forceLogout();
          return Promise.reject(error); // Immediately reject if no refresh token.
        }

        try {
          const refreshedResponse = await axios.post(
            "http://localhost:8000/login/refresh/",
            { refresh: refreshToken },
            { withCredentials: true }
          );

          const { access: newAccessToken, refresh: newRefreshToken } = refreshedResponse.data;

          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken);

          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return axios(originalRequest);
        } catch (error) {
          processQueue(error, null);
          forceLogout();
          return Promise.reject(error);
        }
      } else {
        // Return a new promise for the queued requests
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axios(originalRequest));
            } else {
              forceLogout();
              reject(error);
            }
          });
        });
      }
    } else if (response && response.status === 401) {
      // Handle other 401 cases where the request was already retried
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default axios;
