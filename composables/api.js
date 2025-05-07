export const apiCore = (url, options) => {
  const config = useRuntimeConfig();
  const nuxtapp = useNuxtApp();
  console.log(config, "config");

  return useFetch(url, {
    baseURL: config.public.baseURL,
    /**
     * 请求发送前的钩子函数，可用于修改请求选项
     * @param {Object} param0 - 包含请求选项的对象
     * @param {Object} param0.options - 请求的配置选项
     */
    onRequest({ options }) {
      // 可在此处添加修改请求选项的逻辑
      let token;
      if (import.meta.client) {
        token = localStorage.getItem("token");
      }
      options.headers = {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };
    },
    //正确错误都行执行onResponse
    onResponse({ response }) {
      if (response.status >= 200 && response.status < 300) {
        if (response._data.code !== 200) {
          //客户端访问
          if (import.meta.client) {
            ElMessage({
              message: `${response._data.code}${response._data.msg}`,
              type: "error",
            });
          } else {
            nuxtapp.runWithContext(() => {
              navigateTo({
                path: "/myError",
                query: { code: response._data.code, msg: response._data.msg },
              });
            });
          }
        }
      }
    },
    //只要错误了执行onResponseError
    onResponseError({ response }) {
      console.log(response, "response");
      //客户端访问
      if (import.meta.client) {
        ElMessage({
          message: `${response._data.code}${response._data.msg}`,
          type: "error",
        });
      } else {
        nuxtapp.runWithContext(() => {
          navigateTo({
            path: "/myError",
            query: { code: response._data.code, msg: response._data.msg },
          });
        });
      }
    },
    ...options,
  });
};
export const getApi = (url, options) => {
  return new Promise((resolve, reject) => {
    apiCore(url, {
      method: "get",
      ...options,
    })
      .then((res) => {
        resolve(res.data.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
