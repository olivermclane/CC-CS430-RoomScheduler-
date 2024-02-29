import axios from "axios";

let isRefreshing = false;
let subscribers = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            window.location.href = '/login'; // Redirect to login (if token unavailable)
          }

          const refreshedResponse = await axios.post(
            "http://localhost:8000/login/refresh/",
            { refresh: refreshToken },
            { withCredentials: true }
          );

          const { access: newAccessToken, refresh: newRefreshToken } = refreshedResponse.data;

          // Update tokens in local storage
          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken);

          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest._retry = true;
          subscribers.forEach((callback) => callback(newAccessToken));
          isRefreshing = false;

          // Trigger a function to reload table data or perform any other necessary actions
          reloadTableData();

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

// Function to reload table data (replace this with your actual implementation)
function reloadTableData() {
  // Replace this with code to reload table data
  console.log('Table data reloaded');
}

export default axios;
