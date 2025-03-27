<template>
  <div class="dataset-container">
    <div class="dataset-layout">
      <!-- 左侧数据集列表 -->
      <div class="dataset-list">
        <h2 class="section-title">{{ $t('dataset.title') }}</h2>
        
        <!-- 筛选条件 -->
        <div class="filter-section">
          <el-input
            v-model="filters.namePattern"
            :placeholder="$t('dataset.nameFilter')"
            clearable
            class="filter-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-input
            v-model="filters.pathPattern"
            :placeholder="$t('dataset.pathFilter')"
            clearable
            class="filter-input"
          >
            <template #prefix>
              <el-icon><FolderOpened /></el-icon>
            </template>
          </el-input>
        </div>

        <el-table
          :data="filteredDatasets"
          style="width: 100%"
          @row-click="handleDatasetSelect"
          :highlight-current-row="true"
          height="calc(100vh - 280px)"
          border
          fit
        >
          <el-table-column 
            prop="name" 
            :label="$t('dataset.columns.name')" 
            min-width="200"
            :show-overflow-tooltip="true"
            resizable
          >
            <template #default="{ row }">
              <div class="dataset-name-cell">
                <el-icon><Folder /></el-icon>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column 
            prop="path" 
            :label="$t('dataset.columns.path')" 
            min-width="180"
            :show-overflow-tooltip="true"
            resizable
          >
            <template #default="{ row }">
              <span class="text-muted">/datasets/classification/{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="size" 
            :label="$t('dataset.columns.size')" 
            min-width="100"
            sortable
            :sort-method="sortBySize"
            resizable
          >
            <template #default="{ row }">
              <span class="text-muted">{{ row.size }}</span>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 添加分割线 -->
        <div class="resizer"></div>
      </div>

      <!-- 右侧数据集详情 -->
      <div class="dataset-detail" v-if="selectedDataset">
        <div class="detail-header">
          <h2 class="detail-title">{{ $t('dataset.details.title') }}</h2>
          <div class="detail-actions">
            <el-dropdown @command="handleSync">
              <el-button type="primary" :icon="RefreshRight">
                {{ $t('dataset.actions.sync') }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item 
                    v-for="server in selectedDataset.servers" 
                    :key="server.location"
                    :command="server.location"
                  >
                    <div class="server-dropdown-item">
                      <div class="status-dot" :class="getStatusClass(server.status)"></div>
                      <span>{{ server.location }}</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="danger" :icon="Delete" @click="handleDelete">
              {{ $t('dataset.actions.delete') }}
            </el-button>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="section">
            <h4 class="section-title">{{ $t('dataset.details.basicInfo') }}</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">{{ $t('dataset.details.labels.size') }}</span>
                <span class="info-value">{{ selectedDataset.size }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('dataset.details.labels.updateTime') }}</span>
                <span class="info-value">{{ selectedDataset.updatedAt }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('dataset.details.labels.dataAmount') }}</span>
                <span class="info-value">{{ selectedDataset.metadata }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('dataset.details.labels.storagePath') }}</span>
                <span class="info-value text-muted">/datasets/classification/{{ selectedDataset.id }}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h4 class="section-title">{{ $t('dataset.details.serverStatus') }}</h4>
            <div class="server-grid">
              <div v-for="server in selectedDataset.servers" :key="server.location" class="server-status-item">
                <div class="status-info">
                  <div class="status-dot" :class="getStatusClass(server.status)"></div>
                  <span class="server-name">{{ server.location }}</span>
                </div>
                <span class="status-text">{{ $t(`dataset.status.${server.status}`) }}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h4 class="section-title">{{ $t('dataset.details.updateLogs') }}</h4>
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
      </div>
      
      <!-- 未选择数据集时的占位内容 -->
      <div class="dataset-detail empty-detail" v-else>
        <el-empty :description="$t('dataset.emptyText')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Folder, RefreshRight, Delete, Search, FolderOpened } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 数据集状态枚举
const DatasetStatus = {
  NOT_EXIST: 'not_exist',
  UP_TO_DATE: 'up_to_date',
  OUTDATED: 'outdated'
}

const selectedDataset = ref(null)

// 筛选条件
const filters = ref({
  namePattern: '',
  pathPattern: ''
})

// 生成随机数据集
const generateDatasets = (count) => {
  const datasets = []
  const types = ['Image', 'Text', 'Audio', 'Video']
  const tasks = ['Classification', 'Detection', 'Segmentation', 'Recognition']
  const sizes = ['1.2GB', '2.5GB', '3.8GB', '5.1GB', '8.3GB', '12.6GB', '15.9GB']
  const metadata = ['5000 images', '8000 texts', '10000 samples', '12000 records']
  
  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const task = tasks[Math.floor(Math.random() * tasks.length)]
    datasets.push({
      id: i,
      name: `${type} ${task} Dataset ${i}`,
      updatedAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      metadata: metadata[Math.floor(Math.random() * metadata.length)],
      servers: [
        { location: 'Location1', status: Object.values(DatasetStatus)[Math.floor(Math.random() * 3)] },
        { location: 'Location2', status: Object.values(DatasetStatus)[Math.floor(Math.random() * 3)] },
        { location: 'Location3', status: Object.values(DatasetStatus)[Math.floor(Math.random() * 3)] },
        { location: 'Location4', status: Object.values(DatasetStatus)[Math.floor(Math.random() * 3)] },
        { location: 'Location5', status: Object.values(DatasetStatus)[Math.floor(Math.random() * 3)] }
      ]
    })
  }
  return datasets
}

const datasets = ref(generateDatasets(100))

// 过滤数据集
const filteredDatasets = computed(() => {
  return datasets.value.filter(dataset => {
    let matchName = true
    let matchPath = true

    if (filters.value.namePattern) {
      try {
        const nameRegex = new RegExp(filters.value.namePattern)
        matchName = nameRegex.test(dataset.name)
      } catch (e) {
        matchName = true // 如果正则表达式无效，不进行过滤
      }
    }

    if (filters.value.pathPattern) {
      try {
        const pathRegex = new RegExp(filters.value.pathPattern)
        matchPath = pathRegex.test(`/datasets/classification/${dataset.id}`)
      } catch (e) {
        matchPath = true // 如果正则表达式无效，不进行过滤
      }
    }

    return matchName && matchPath
  })
})

// 排序方法
const sortBySize = (a, b) => {
  const sizeA = parseFloat(a.size)
  const sizeB = parseFloat(b.size)
  return sizeA - sizeB
}

const updateLogs = ref([
  {
    date: '2024-01-20 14:30',
    title: 'Dataset Update',
    description: 'Added 1000 new training images and optimized annotation quality'
  },
  {
    date: '2024-01-15 09:45',
    title: 'Annotation Guidelines Update',
    description: 'Updated image annotation guidelines to improve consistency'
  },
  {
    date: '2024-01-10 16:20',
    title: 'Initial Version',
    description: 'Created dataset and uploaded basic training data'
  }
])

const handleDatasetSelect = (row) => {
  selectedDataset.value = row
}

const handleSync = (location) => {
  ElMessage.success(`Syncing to ${location}`)
  // TODO: 实现同步逻辑
}

const handleDelete = () => {
  ElMessageBox.confirm(
    t('dataset.actions.deleteConfirm'),
    t('dataset.actions.deleteWarning'),
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('Dataset deleted successfully')
    selectedDataset.value = null
  }).catch(() => {
    // 取消删除
  })
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

// 添加宽度调整功能
const startListResize = (e) => {
  if (!e.target.classList.contains('resizer')) return;
  
  const list = document.querySelector('.dataset-list');
  const detail = document.querySelector('.dataset-detail');
  const container = document.querySelector('.dataset-layout');
  const resizer = e.target;
  
  const startWidth = list.offsetWidth;
  const startX = e.clientX;
  
  // 添加禁止选中类
  document.body.classList.add('resize-active');
  resizer.classList.add('dragging');
  
  const handleMouseMove = (e) => {
    e.preventDefault();
    requestAnimationFrame(() => {
      const newWidth = startWidth + (e.clientX - startX);
      const containerWidth = container.offsetWidth;
      
      if (newWidth >= 400 && newWidth <= (containerWidth - 400)) {
        list.style.width = `${newWidth}px`;
        list.style.flex = `0 0 ${newWidth}px`;
      }
    });
  };

  const handleMouseUp = () => {
    // 移除禁止选中类
    document.body.classList.remove('resize-active');
    resizer.classList.remove('dragging');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.body.style.cursor = 'col-resize';
};

// 修改模板中的事件监听
onMounted(() => {
  const container = document.querySelector('.dataset-layout');
  if (container) {
    container.addEventListener('mousedown', startListResize);
  }
});

onUnmounted(() => {
  const container = document.querySelector('.dataset-layout');
  if (container) {
    container.removeEventListener('mousedown', startListResize);
  }
});
</script>

<style>
/* 全局样式，防止文本选中 */
.resize-active {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  cursor: col-resize !important;
}
</style>

<style scoped>
.dataset-container {
  height: 100%;
  padding: 20px;
}

.dataset-layout {
  display: flex;
  height: calc(100vh - 120px);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  position: relative;
}

.dataset-list {
  flex: 0 0 50%;
  min-width: 400px;
  max-width: 800px;
  padding: 20px;
  overflow: auto;
  position: relative;
}

.dataset-detail {
  flex: 1;
  min-width: 400px;
  padding: 20px;
  overflow: auto;
  position: relative;
}

.empty-detail {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
  font-weight: 500;
}

.dataset-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-muted {
  color: #909399;
  font-size: 13px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.detail-title {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.server-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
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

.section {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  padding: 12px;
  background-color: #F5F7FA;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #909399;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
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

:deep(.el-table__row) {
  cursor: pointer;
}

.filter-section {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.filter-input {
  flex: 1;
}

:deep(.el-input__wrapper) {
  background-color: #F5F7FA;
}

:deep(.el-table) {
  --el-table-border-color: #e4e7ed;
  --el-table-header-bg-color: #F5F7FA;
  --el-table-row-hover-bg-color: #F5F7FA;
}

:deep(.el-table__header) {
  th {
    background-color: var(--el-table-header-bg-color);
    border-bottom: 1px solid var(--el-table-border-color);
    font-weight: 500;
    color: #606266;
  }
}

:deep(.el-table__header-wrapper) {
  border-bottom: 1px solid var(--el-table-border-color);
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__cell) {
  .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

:deep(.el-table__column-resize-proxy) {
  background-color: #409EFF;
}

/* 添加调整手柄样式 */
.resizer {
  width: 6px;
  cursor: col-resize;
  background-color: transparent;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -3px;
  transition: background-color 0.2s;
  z-index: 10;
  user-select: none;
  touch-action: none;
}

.resizer:hover,
.resizer.dragging {
  background-color: #409EFF;
}
</style> 