export default defineNuxtRouteMiddleware((to, from) => {
  let passUrl = ["/user", "/login"];
  console.log(to.path, "to");

  if (!passUrl.includes(to.path)) {
    let token = "";
    //内置的环境
    if (import.meta.client) {
      token = localStorage.getItem("token");
    }
    if (!token) {
      ElMessage({
        message: "请先登录",
        type: "warning",
      });
      return navigateTo("/login");
    }
  }
});
