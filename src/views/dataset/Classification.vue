<template>
  <div class="dataset-container">
    <h1 class="page-title">Datasets</h1>
    <el-row :gutter="20" class="dataset-list">
      <el-col :span="8" v-for="dataset in datasets" :key="dataset.id">
        <el-card 
          class="dataset-card" 
          shadow="hover"
          @click="handleCardClick(dataset)"
        >
          <div class="card-content">
            <h3 class="dataset-name">{{ dataset.name }}</h3>
            <div class="info-item update-time">
              <span>更新于 {{ dataset.updatedAt }}</span>
            </div>
            <div class="server-list">
              <div v-for="server in dataset.servers" :key="server.location" class="server-item">
                <div class="status-dot" :class="getStatusClass(server.status)"></div>
                <span class="server-name">{{ server.location }}</span>
              </div>
            </div>
            <div class="tags">
              <el-tag size="small" type="info" effect="plain">分类</el-tag>
              <el-tag size="small" type="success" effect="plain">公开</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer
      v-model="drawerVisible"
      title="数据集详情"
      size="500px"
      :with-header="true"
    >
      <template #header>
        <h3 class="drawer-title">
          {{ selectedDataset?.name }}
          <div class="drawer-tags">
            <el-tag size="small" type="info" effect="plain">分类</el-tag>
            <el-tag size="small" type="success" effect="plain">公开</el-tag>
          </div>
        </h3>
      </template>
      
      <div class="drawer-content">
        <div class="section">
          <h4 class="section-title">服务器状态</h4>
          <div class="server-grid">
            <div v-for="server in selectedDataset?.servers" :key="server.location" class="server-status-item">
              <div class="status-info">
                <div class="status-dot" :class="getStatusClass(server.status)"></div>
                <span class="server-name">{{ server.location }}</span>
              </div>
              <span class="status-text">{{ getStatusText(server.status) }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h4 class="section-title">更新日志</h4>
          <el-timeline>
            <el-timeline-item
              v-for="log in updateLogs"
              :key="log.date"
              :timestamp="log.date"
              placement="top"
            >
              <div class="log-content">
                <h5 class="log-title">{{ log.title }}</h5>
                <p class="log-description">{{ log.description }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Location } from '@element-plus/icons-vue'

// 数据集状态枚举
const DatasetStatus = {
  NOT_EXIST: 'not_exist',
  UP_TO_DATE: 'up_to_date',
  OUTDATED: 'outdated'
}

const drawerVisible = ref(false)
const selectedDataset = ref(null)

const datasets = ref([
  {
    id: 1,
    name: '图像分类数据集',
    updatedAt: '2024-01-20',
    servers: [
      { location: 'Location1', status: DatasetStatus.UP_TO_DATE },
      { location: 'Location2', status: DatasetStatus.OUTDATED },
      { location: 'Location3', status: DatasetStatus.NOT_EXIST },
      { location: 'Location4', status: DatasetStatus.UP_TO_DATE },
      { location: 'Location5', status: DatasetStatus.NOT_EXIST }
    ]
  },
  {
    id: 2,
    name: '文本分类数据集',
    updatedAt: '2024-01-18',
    servers: [
      { location: 'Location1', status: DatasetStatus.OUTDATED },
      { location: 'Location2', status: DatasetStatus.UP_TO_DATE },
      { location: 'Location3', status: DatasetStatus.UP_TO_DATE },
      { location: 'Location4', status: DatasetStatus.NOT_EXIST },
      { location: 'Location5', status: DatasetStatus.OUTDATED }
    ]
  }
])

const updateLogs = ref([
  {
    date: '2024-01-20 14:30',
    title: '数据集更新',
    description: '添加了1000张新的训练图片，优化了标注质量'
  },
  {
    date: '2024-01-15 09:45',
    title: '标注规范更新',
    description: '更新了图像标注规范，提高了标注一致性'
  },
  {
    date: '2024-01-10 16:20',
    title: '初始版本',
    description: '创建数据集，上传了基础的训练数据'
  }
])

const handleCardClick = (dataset) => {
  selectedDataset.value = dataset
  drawerVisible.value = true
}

const getStatusClass = (status) => {
  switch (status) {
    case DatasetStatus.UP_TO_DATE:
      return 'status-up-to-date'
    case DatasetStatus.OUTDATED:
      return 'status-outdated'
    case DatasetStatus.NOT_EXIST:
    default:
      return 'status-not-exist'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case DatasetStatus.UP_TO_DATE:
      return '最新'
    case DatasetStatus.OUTDATED:
      return '已过时'
    case DatasetStatus.NOT_EXIST:
    default:
      return '不存在'
  }
}
</script>

<style scoped>
.dataset-container {
  padding: 20px;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 32px;
  color: #303133;
  font-weight: 500;
}

.dataset-list {
  margin-top: 20px;
}

.dataset-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s;
}

.dataset-card:hover {
  transform: translateY(-2px);
}

.card-content {
  padding: 16px;
}

.dataset-name {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.info-item {
  margin-bottom: 12px;
  color: #909399;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.server-list {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.server-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-up-to-date {
  background-color: #67C23A;
}

.status-outdated {
  background-color: #E6A23C;
}

.status-not-exist {
  background-color: #909399;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-tag) {
  border-radius: 4px;
}

/* Drawer styles */
.drawer-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.drawer-tags {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.drawer-content {
  padding: 20px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.server-grid {
  display: grid;
  gap: 12px;
}

.server-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #F5F7FA;
  border-radius: 4px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.server-name {
  font-size: 14px;
  color: #606266;
}

.status-text {
  font-size: 12px;
  color: #909399;
}

.log-content {
  margin-bottom: 16px;
}

.log-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #303133;
}

.log-description {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

:deep(.el-timeline-item__node) {
  background-color: #4B5EFF;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 12px;
}
</style> 