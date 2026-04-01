
export declare interface MemberStoreToolAreaState {
  tableData: MemberStoreToolAreaTableData;
}

declare interface MemberStoreToolAreaTableData extends TableType {
  data: MemberStoreToolAreaEntity[];
}

/** 行政区域 */
export declare interface MemberStoreToolAreaEntity extends BaseEntity {
  [key: string]: any;
}
