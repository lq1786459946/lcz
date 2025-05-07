export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to.path);
  if (to.path === "/about") {
    // return navigateTo("/login");
    return true; //想让后面的中间件执行 写上true
  }
});
