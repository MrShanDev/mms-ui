// dict
import { TableType } from '/@/types/global';

export declare interface RowDictType {
  id: number;
  name: string;
  fieldName: string;
  label: string;
  status: number;
  createdTime: string;
  list: ListType[];
  remark: string;
}

export interface SysDictTableType extends TableType {
  data: RowDictType[];
}

export declare interface SysDictState {
  tableData: SysDictTableType;
}

export type ListType = {
  id: number | string;
  label: string;
  value: string;
  dictType: string;
  sort: number;
  status: string;
  colorType: string;
};
