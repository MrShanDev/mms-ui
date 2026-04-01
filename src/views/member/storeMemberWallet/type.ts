
export declare interface MemberStoreMemberWalletState {
  tableData: MemberStoreMemberWalletTableData;
}

declare interface MemberStoreMemberWalletTableData extends TableType {
  data: MemberStoreMemberWalletEntity[];
}

/** 用户钱包表 */
export declare interface MemberStoreMemberWalletEntity extends BaseEntity {
  [key: string]: any;
}
