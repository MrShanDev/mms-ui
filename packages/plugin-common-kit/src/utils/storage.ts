/**
 * 从宿主 re-export storage 工具。
 * 宿主 `/@/utils/storage` 仅依赖 js-cookie，已在 Federation remote 验证安全。
 * 为防止误用，禁止从此文件 re-export 任何带重型依赖的宿主模块。
 */
export { Session, Local, Cookie } from '/@/utils/storage';
export { SysEnum } from '/@/enums/SysEnum';