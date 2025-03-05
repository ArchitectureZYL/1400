import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.error('请求拦截器出错:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    const {
      authorization
    } = response.headers;
    if (authorization) {
      localStorage.setItem("token", authorization);
    }
    return response;
  },
  function (error) {
    const {
      status
    } = error.response || {};
    if (status === 401) {
      localStorage.removeItem("token");
      // 这里可以添加跳转到登录页的逻辑
      console.log('未授权，跳转到登录页');
    }
    console.error('响应拦截器出错:', error);
    return Promise.reject(error);
  }
);

export default axios;