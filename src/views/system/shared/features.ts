export const systemFeatures = {
  user: { title: '用户管理', description: '管理系统账户、账户状态与角色分配。' },
  role: { title: '角色管理', description: '维护角色与菜单权限，按职级控制授权范围。' },
  menu: { title: '菜单管理', description: '维护导航层级、页面路由与按钮权限。' },
  dept: { title: '部门管理', description: '维护组织结构、部门信息与上下级关系。' },
  dict: { title: '字典管理', description: '集中维护业务选项、字典编码与展示标签。' },
  oss: { title: '对象存储', description: '管理已上传文件，查看、复制与维护存储资源。' },
  config: { title: '系统配置', description: '配置系统基础能力、服务集成与自定义参数。' },
  notice: { title: '通知公告', description: '发布与维护面向系统用户的通知内容。' },
  sysLog: { title: '操作日志', description: '查询操作记录、请求详情与执行结果。' },
} as const;
export type SystemFeature = keyof typeof systemFeatures;
