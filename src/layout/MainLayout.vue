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
        <el-dropdown @command="handleLanguageChange" trigger="click">
          <el-button link>
            {{ currentLanguage === 'zh' ? '中文' : 'English' }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <template v-if="!isLoggedIn">
          <el-button link @click="handleLogin">{{ $t('nav.login') }}</el-button>
        </template>
        <template v-else>
          <el-dropdown @command="handleCommand">
            <el-button link>
              {{ username }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">{{ $t('nav.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </el-header>
    
    <el-container class="main-container">
      <el-aside :width="isCollapse ? '64px' : '210px'" class="aside" style="position: relative;">
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
              <span>{{ $t('menu.datasets.title') }}</span>
            </template>
            <el-menu-item index="/dataset/classification">{{ $t('menu.datasets.classification') }}</el-menu-item>
            <el-menu-item index="/dataset/detection">{{ $t('menu.datasets.detection') }}</el-menu-item>
            <el-menu-item index="/dataset/segmentation">{{ $t('menu.datasets.segmentation') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/experiments">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>{{ $t('menu.experiments.title') }}</span>
            </template>
            <el-menu-item index="/experiments/running">{{ $t('menu.experiments.running') }}</el-menu-item>
            <el-menu-item index="/experiments/completed">{{ $t('menu.experiments.completed') }}</el-menu-item>
          </el-sub-menu>
        </el-menu>
        <div 
          class="resize-handle"
          v-if="!isCollapse"
          @mousedown="startResize"
        ></div>
      </el-aside>
      
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Monitor, Collection, Operation, Expand, Fold, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { login, logout } from '../api/auth'

const router = useRouter()
const isCollapse = ref(false)
const isLoggedIn = ref(false)
const username = ref('')
const dropdownVisible = ref(false)
const route = useRoute()
const { t, locale } = useI18n()
const currentLanguage = computed(() => locale.value)

const activeMenu = computed(() => route.path)

const isDragging = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  const aside = document.querySelector('.aside')
  if (aside) {
    aside.style.width = isCollapse.value ? '64px' : '210px'
  }
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

const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

const startResize = (e) => {
  const aside = e.target.parentElement
  const startWidth = aside.offsetWidth
  const startX = e.clientX
  isDragging.value = true
  e.target.classList.add('dragging')
  
  const handleMouseMove = (e) => {
    e.preventDefault()
    requestAnimationFrame(() => {
      const newWidth = Math.round((startWidth + (e.clientX - startX)) / 10) * 10
      if (newWidth >= 210 && newWidth <= 400) {
        aside.style.width = `${newWidth}px`
      }
    })
  }

  const handleMouseUp = () => {
    isDragging.value = false
    e.target.classList.remove('dragging')
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'col-resize'
}

watch(route, () => {
  const aside = document.querySelector('.aside')
  if (aside && isCollapse.value) {
    aside.style.width = '64px'
  }
})
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
  gap: 16px;
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.aside {
  background-color: #F5F6FF;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-right: 1px solid #E4E7ED;
  position: relative;
  user-select: none;
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
  width: 100% !important;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 100% !important;
}

:deep(.el-menu) {
  width: 100% !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  padding: 0 40px 0 16px !important;
  min-width: unset !important;
  width: 100% !important;
  position: relative;
}

:deep(.el-sub-menu__title) {
  display: flex !important;
  align-items: center !important;
}

:deep(.el-sub-menu__title .el-icon) {
  margin-right: 8px !important;
  flex-shrink: 0 !important;
}

:deep(.el-sub-menu__title span) {
  flex: 1 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

:deep(.el-sub-menu__arrow) {
  position: absolute !important;
  right: 20px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  transform-origin: center center !important;
  transition: transform 0.3s !important;
  margin: 0 !important;
  z-index: 1 !important;
}

:deep(.el-icon.el-sub-menu__icon-arrow) {
  width: 12px !important;
  height: 12px !important;
}

:deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__arrow) {
  transform: translateY(-50%) rotateZ(180deg) !important;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: unset !important;
  width: 100% !important;
  padding: 0 20px 0 40px !important;
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
  color: #606266;
}

:deep(.el-button.is-link:hover) {
  color: #409EFF;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.2s;
  z-index: 100;
}

.resize-handle:hover,
.resize-handle.dragging {
  background-color: #409EFF;
}
</style> 