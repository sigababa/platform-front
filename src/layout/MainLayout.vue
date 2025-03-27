<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-left">
        <el-button class="collapse-btn" text @click="toggleCollapse">
          <el-icon :size="20">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
        </el-button>
        <h2 class="title">AI Platform</h2>
      </div>
      <div class="header-right">
        <template v-if="!isLoggedIn">
          <el-button link type="primary" @click="handleLogin">Log In</el-button>
        </template>
        <template v-else>
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="user-info">
              {{ username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">Log Out</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </el-header>
    
    <el-container class="main-container">
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          background-color="#F5F6FF"
          text-color="#333"
          active-text-color="#4B5EFF"
          router
          :unique-opened="true"
        >
          <el-sub-menu index="/dataset">
            <template #title>
              <el-icon><Collection /></el-icon>
              <span>Datasets</span>
            </template>
            <el-menu-item index="/dataset/classification">分类数据集</el-menu-item>
            <el-menu-item index="/dataset/detection">检测数据集</el-menu-item>
            <el-menu-item index="/dataset/segmentation">分割数据集</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/experiments">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>Experiments</span>
            </template>
            <el-menu-item index="/experiments/running">进行中</el-menu-item>
            <el-menu-item index="/experiments/completed">已完成</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, Collection, Operation, Expand, Fold, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { login, logout } from '../api/auth'

const router = useRouter()
const isCollapse = ref(false)
const isLoggedIn = ref(false)
const username = ref('')
const dropdownVisible = ref(false)
const route = useRoute()

const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleLogin = async () => {
  try {
    const response = await login()
    username.value = response.data.username
    isLoggedIn.value = true
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error('登录失败')
  }
}

const handleLogout = async () => {
  try {
    await logout()
    username.value = ''
    isLoggedIn.value = false
    ElMessage.success('登出成功')
  } catch (error) {
    ElMessage.error('登出失败')
  }
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    await handleLogout()
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #F5F7FA;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #E4E7ED;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  color: #606266;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.aside {
  background-color: #F5F6FF;
  transition: width 0.3s;
  overflow: hidden;
  border-right: 1px solid #E4E7ED;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4B5EFF;
  font-size: 14px;
}

.user-info:hover {
  color: #6574FF;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.main-content {
  background-color: #F5F7FA;
  padding: 20px;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #E8EAFF !important;
  color: #4B5EFF !important;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #E8EAFF !important;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
}

:deep(.el-button.is-link) {
  font-size: 14px;
}

:deep(.el-button.is-link:hover) {
  color: #6574FF;
}
</style> 