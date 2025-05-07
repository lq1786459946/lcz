<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h2>后台管理系统</h2>
      <button @click="handleLogout">退出登录</button>
    </header>

    <div class="dashboard-main">
      <aside class="sidebar">
        <nav>
          <NuxtLink to="/dashboard/user">用户管理</NuxtLink>
          <NuxtLink to="/dashboard/content">内容管理</NuxtLink>
        </nav>
      </aside>

      <main class="content">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
const handleLogout = () => {
  localStorage.removeItem("isAuthenticated");
  navigateTo("/");
};
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  padding: 1rem;
  background: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-main {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 200px;
  background: #34495e;
  padding: 1rem;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar a {
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
}

.sidebar a:hover {
  background: #40576b;
}

.content {
  flex: 1;
  padding: 2rem;
  background: #f5f6fa;
}
</style>
