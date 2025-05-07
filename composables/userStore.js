import { defineStore } from "pinia";
export const userStore = defineStore(
  "userStore",
  () => {
    const token = ref("");
    const setToken = (newToken) => {
      token.value = newToken;
    };
    const getToken = () => {
      return token.value;
    };
    return { token, setToken, getToken };
  },
  {
    persist: {
      //   key:"userStore",//本地存储的key值
      storage: persistedState.localStorage, //本地存储的位置
    },
  }
);
