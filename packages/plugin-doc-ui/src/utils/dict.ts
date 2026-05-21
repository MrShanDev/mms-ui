import { labelFromMap, optionsFromMap } from '@mms-ui/plugin-common-kit/utils/dict';

// ─── doc 产品状态 ───
const DOC_PRODUCT_STATUS_MAP: Record<number, string> = { 1: '上架', 0: '下架' };
export const DOC_PRODUCT_STATUS_OPTIONS = optionsFromMap(DOC_PRODUCT_STATUS_MAP);
export const docProductStatusLabel = (val: number | string) => labelFromMap(DOC_PRODUCT_STATUS_MAP, val);

// ─── doc 订单状态 ───
const DOC_ORDER_STATUS_MAP: Record<number, string> = { 0: '待支付', 1: '已支付', 2: '已取消' };
export const DOC_ORDER_STATUS_OPTIONS = optionsFromMap(DOC_ORDER_STATUS_MAP);
export const docOrderStatusLabel = (val: number | string) => labelFromMap(DOC_ORDER_STATUS_MAP, val);