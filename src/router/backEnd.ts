import { RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/route';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { getMenu } from '/@/views/system/init';
import { useAppStore } from '/@/stores/app';
import { resolvePluginFederatedView } from '/@/router/pluginFederation';

// 后端控制路由

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');
const dynamicViewsModules: Record<string, Function> = Object.assign(
  {},
  { ...layouModules },
  { ...viewsModules }
);

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserInfo().setUserInfos() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initBackEndControlRoutes() {
  // 界面 loading 动画开始执行
  if (window.nextLoading === undefined) NextLoading.start();
  // 无 token 停止执行下一步
  if (!Session.get('token')) return false;
  // 触发初始化用户信息 pinia
  await useUserInfo().setUserInfos();
  // 获取路由菜单数据
  var res = await getBackEndControlRoutes();
  // 无登录权限时，添加判断
  if (!res.data || !Array.isArray(res.data) || res.data.length <= 0) {
    return Promise.resolve(true);
  }
  // 存储接口原始路由（未处理component），根据需求选择使用
  useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(res.data)));
  // 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
  dynamicRoutes[0].children = await backEndComponent(res.data);
  // 添加动态路由
  await setAddRoute();
  // 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
  setFilterMenuAndCacheTagsViewRoutes();
}

/**
 * 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setFilterMenuAndCacheTagsViewRoutes() {
  const storesRoutesList = useRoutesList(pinia);
  storesRoutesList.setRoutesList(dynamicRoutes[0].children as any);
  setCacheTagsViewRoutes();
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
  const storesTagsView = useTagsViewRoutes(pinia);
  const flat = formatFlatteningRoutes(dynamicRoutes);
  const staged = flat && flat.length > 0 ? formatTwoStageRoutes(flat) : false;
  const root = staged && staged[0] ? staged[0] : null;
  storesTagsView.setTagsViewRoutes(root?.children ?? []);
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
  const flat = formatFlatteningRoutes(dynamicRoutes);
  if (!flat || flat.length <= 0) {
    console.error('setFilterRouteEnd: formatFlatteningRoutes 无有效路由');
    return formatTwoStageRoutes([dynamicRoutes[0]]) || [dynamicRoutes[0]];
  }
  let filterRouteEnd: any = formatTwoStageRoutes(flat);
  if (!filterRouteEnd || filterRouteEnd.length <= 0 || !filterRouteEnd[0]) {
    console.error('setFilterRouteEnd: formatTwoStageRoutes 未得到布局根路由');
    filterRouteEnd = formatTwoStageRoutes([dynamicRoutes[0]]) || [dynamicRoutes[0]];
  }
  // notFoundAndNoPower 防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
  // 关联问题 No match found for location with path 'xxx'
  filterRouteEnd[0].children = [...(filterRouteEnd[0].children || []), ...notFoundAndNoPower];
  return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
  const toAdd = setFilterRouteEnd();
  toAdd.forEach((route: RouteRecordRaw) => {
    router.addRoute(route);
  });
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export function getBackEndControlRoutes() {
  // 字典加载
  useAppStore().getDictListAction();
  //返回当前登录用户权限菜单
  return getMenu();
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/system/menu/component/addMenu.vue
 */
export async function setBackEndControlRefreshRoutes() {
  await getBackEndControlRoutes();
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
  if (!routes) return [];
  return routes.map((item: any) => {
    if (item.component) {
      const resolved = dynamicImport(dynamicViewsModules, item.component as string);
      // false 表示多个 glob 匹配，Vue Router 无法挂载；置空避免 addRoute 内部空引用
      item.component = resolved === false ? undefined : resolved;
    }
    if (item.children) {
      item.children = backEndComponent(item.children);
    }
    return item;
  });
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
/** 将 glob 键规范为与后端 component 字段可比的路径（如 system/user/index.vue） */
function normalizeViewGlobKey(key: string): string {
  return key.replace(/^(?:\.\.\/)+views\//, '');
}

export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
  // 与 views 下 glob 键一致：去掉前导 /（库内脚本曾写入 '/system/user/index'，会导致无法匹配、组件为 undefined）
  const comp = String(component ?? '')
    .trim()
    .replace(/^\/+/, '');
  if (!comp) return;
  const pluginFed = resolvePluginFederatedView(comp);
  if (pluginFed) {
    return pluginFed;
  }
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = normalizeViewGlobKey(key);
    return k.startsWith(comp) || k.startsWith(`/${comp}`);
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    // 多文件前缀重叠（如 system/user 与 system/user/extra）时取最短路径，避免返回 false 导致路由注册崩溃
    matchKeys.sort((a, b) => normalizeViewGlobKey(a).length - normalizeViewGlobKey(b).length);
    const pick = matchKeys[0];
    console.warn(
      `[路由] component「${comp}」匹配到多个视图，已选用最短路径: ${normalizeViewGlobKey(pick)}`
    );
    return dynamicViewsModules[pick];
  }
}
