import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '数据总览', icon: 'home' },
  { path: '/grasp', title: '智能抓取', icon: 'home' },
  { path: '/sync', title: '同步姿态', icon: 'home' },
  { path: '/chat', title: '语音助手', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/3d', title: '3d模型' },
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' },
      { path: '/page3', title: '页面 3' }
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '数据总览', icon: 'home' },
  { path: '/grasp', title: '智能抓取', icon: 'home' },
  { path: '/sync', title: '同步姿态', icon: 'home' },
  { path: '/chat', title: '语音助手', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/3d', title: '3d模型' },
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' },
      { path: '/page3', title: '页面 3' }
    ]
  }
])
