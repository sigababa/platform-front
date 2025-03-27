<template>
  <div class="dataset-container">
    <div class="header">
      <h2>Datasets</h2>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        New Dataset
      </el-button>
    </div>
    
    <el-row :gutter="20" class="dataset-list">
      <el-col :span="8" v-for="dataset in datasets" :key="dataset.id">
        <el-card class="dataset-card" shadow="hover">
          <div class="card-content">
            <h3 class="dataset-name">{{ dataset.name }}</h3>
            <div class="info-item update-time">
              <span>更新于 {{ dataset.updatedAt }}</span>
            </div>
            <div class="info-item server-info">
              <el-icon><Location /></el-icon>
              <span>{{ dataset.server }}</span>
            </div>
            <div class="tags">
              <el-tag size="small" :type="dataset.type === '分类' ? 'info' : 'warning'" effect="plain">
                {{ dataset.type }}
              </el-tag>
              <el-tag size="small" type="success" effect="plain">公开</el-tag>
            </div>
          </div>
          <div class="card-action">
            <el-button link type="primary">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Calendar, Location, ArrowRight } from '@element-plus/icons-vue'

const datasets = ref([
  {
    id: 1,
    name: '图像分类数据集',
    type: '分类',
    updatedAt: '2024-01-20',
    server: '阿里云-杭州'
  },
  {
    id: 2,
    name: '目标检测数据集',
    type: '检测',
    updatedAt: '2024-01-18',
    server: '腾讯云-上海'
  },
  {
    id: 3,
    name: '语义分割数据集',
    type: '分割',
    updatedAt: '2024-01-15',
    server: '华为云-北京'
  }
])
</script>

<style scoped>
.dataset-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.dataset-list {
  margin-top: 20px;
}

.dataset-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  display: flex;
  align-items: stretch;
}

.card-content {
  flex: 1;
  padding: 16px;
}

.dataset-name {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.info-item {
  margin-bottom: 8px;
  color: #909399;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.card-action {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-left: 1px solid #F0F2F5;
}

:deep(.el-card__body) {
  padding: 0;
  display: flex;
}

:deep(.el-tag) {
  border-radius: 4px;
}

:deep(.el-button.is-link) {
  color: #4B5EFF;
}

:deep(.el-button.is-link:hover) {
  color: #6574FF;
}
</style> 