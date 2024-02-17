import axios from "axios";

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
  if (error.response.status === 401 && !refresh) {
    refresh = true;

    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return Promise.reject(error);
      }

      const response = await axios.post('http://localhost:8000/login/refresh/', {
        refresh: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        return axios(error.config);
      } else {
        return Promise.reject(error);
      }
    } catch (err) {
      return Promise.reject(error);
    } finally {
      refresh = false;
    }
  }

  return Promise.reject(error);
});