// 场景演示数据；真实接口应在页面层替换。
export { approvals, demoOrders, demoTasks } from './scenes';
export const channels = [
  { name: '小程序商城', value: 58, color: '#138b78' },
  { name: '移动 H5', value: 27, color: '#6aaea3' },
  { name: 'PC 商城', value: 15, color: '#c4ddd7' },
];
export const schedule = [
  {
    time: '09:30',
    duration: '30 分钟',
    title: '产品需求同步',
    place: '线上会议',
    team: '产品 / 设计 / 研发',
  },
  {
    time: '14:00',
    duration: '60 分钟',
    title: '版本迭代评审',
    place: '会议室 A',
    team: '项目协作团队',
  },
  {
    time: '16:30',
    duration: '30 分钟',
    title: '团队周计划',
    place: '线上会议',
    team: '全体成员',
  },
];
export const activity = [
  { title: '陈悦发布了本周工作计划', detail: '管理后台升级 · 团队计划', time: '10:40' },
  { title: '林宇完成了接口文档整理', detail: '商城迭代 · 交付资料', time: '09:55' },
  { title: '苏晴更新了组件设计规范', detail: '设计协作 · 规范文档', time: '09:20' },
];
export const salesSeries = {
  week: [11520, 16320, 14080, 25280, 21760, 18240, 27520],
  month: [50400, 75600, 64800, 96000, 86400, 108000, 99600],
};

export const project = {
  name: '管理后台升级',
  description: '统一体验 / 多端适配 / 权限梳理',
  progress: 68,
  milestone: '控制台与登录体验',
};
export const weeklyGoal = {
  value: 86,
  description: '本周协作目标完成度',
  target: '示例目标：完成需求评审与版本交付',
};
