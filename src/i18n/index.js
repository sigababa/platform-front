import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      datasets: 'Datasets',
      experiments: 'Experiments',
      login: 'Log in',
      logout: 'Log out'
    },
    menu: {
      datasets: {
        title: 'Datasets',
        classification: 'Classification Datasets',
        detection: 'Detection Datasets',
        segmentation: 'Segmentation Datasets'
      },
      experiments: {
        title: 'Experiments',
        running: 'Running',
        completed: 'Completed'
      }
    },
    dataset: {
      title: 'Classification Datasets',
      nameFilter: 'Enter dataset name regex',
      pathFilter: 'Enter path regex',
      emptyText: 'Please select a dataset to view details',
      columns: {
        name: 'Name',
        path: 'Path',
        size: 'Size'
      },
      details: {
        title: 'Dataset Details',
        basicInfo: 'Basic Information',
        serverStatus: 'Server Status',
        updateLogs: 'Update Logs',
        labels: {
          size: 'Dataset Size',
          updateTime: 'Update Time',
          dataAmount: 'Data Amount',
          storagePath: 'Storage Path'
        }
      },
      status: {
        up_to_date: 'Up to date',
        outdated: 'Outdated',
        not_exist: 'Not exist'
      },
      actions: {
        sync: 'Sync',
        delete: 'Delete',
        deleteConfirm: 'Are you sure to delete this dataset? This action cannot be undone.',
        deleteWarning: 'Warning'
      }
    }
  },
  zh: {
    nav: {
      datasets: '数据集',
      experiments: '实验',
      login: '登录',
      logout: '登出'
    },
    menu: {
      datasets: {
        title: '数据集',
        classification: '分类数据集',
        detection: '检测数据集',
        segmentation: '分割数据集'
      },
      experiments: {
        title: '实验',
        running: '进行中',
        completed: '已完成'
      }
    },
    dataset: {
      title: '分类数据集',
      nameFilter: '输入数据集名称正则表达式',
      pathFilter: '输入路径正则表达式',
      emptyText: '请选择一个数据集查看详情',
      columns: {
        name: '名称',
        path: '路径',
        size: '大小'
      },
      details: {
        title: '数据集详情',
        basicInfo: '基本信息',
        serverStatus: '服务器状态',
        updateLogs: '更新日志',
        labels: {
          size: '数据集大小',
          updateTime: '更新时间',
          dataAmount: '数据量',
          storagePath: '存储路径'
        }
      },
      status: {
        up_to_date: '最新',
        outdated: '已过时',
        not_exist: '不存在'
      },
      actions: {
        sync: '同步',
        delete: '删除',
        deleteConfirm: '确定要删除这个数据集吗？此操作不可逆',
        deleteWarning: '警告'
      }
    }
  }
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('language') || 'en', // 默认语言改为英文
  fallbackLocale: 'zh', // 备用语言改为中文
  messages
})

export default i18n 