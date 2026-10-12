import {createHttp} from '@mms-ui/plugin-common-kit/api/request';
export const http=createHttp('/prod-api');
export async function call(path:string,body?:unknown){const r=body===undefined?await http.get(path):await http.post(path,body);const x=r.data;if(x?.code!==undefined&&x.code!==200)throw new Error(x.msg||'操作失败');return x?.code===200?x.data:x;}
