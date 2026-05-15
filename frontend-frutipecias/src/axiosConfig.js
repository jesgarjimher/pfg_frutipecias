import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url.includes('/login');
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;