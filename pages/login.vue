<template>
  <div class="login-container">
    <h1>公司官方登录</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>账号：</label>
        <input v-model="form.username" type="text" required />
      </div>
      <div class="form-group">
        <label>密码：</label>
        <input v-model="form.password" type="password" required />
      </div>
      <button type="submit">登录后台</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {userStore} from '@/composables/userStore'
const form = ref({
  username: "",
  password: "",
});
//设置
let res = useState("count", () => {
  return 0;
});
res.value++;
// console.log(res.value, "res.value");
//获取
console.log(useState("useState").value);

const handleLogin = async () => {
  // 暂时模拟登录成功
  //   navigateTo("/dashboard");
  const res = await getApi("/api/oauth/token");
  console.log(res, "res");
  //pinia设置的token
  userStore().setToken("11111");
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
    }
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background: #0056b3;
    }
  }
}
</style>
