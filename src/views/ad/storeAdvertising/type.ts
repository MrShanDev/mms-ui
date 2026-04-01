
export declare interface AdStoreAdvertisingState {
  tableData: AdStoreAdvertisingTableData;
}

declare interface AdStoreAdvertisingTableData extends TableType {
  data: AdStoreAdvertisingEntity[];
}

/** 广告 */
export declare interface AdStoreAdvertisingEntity extends BaseEntity {
  [key: string]: any;
}
