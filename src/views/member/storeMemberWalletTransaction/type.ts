
export declare interface MemberStoreMemberWalletTransactionState {
  tableData: MemberStoreMemberWalletTransactionTableData;
}

declare interface MemberStoreMemberWalletTransactionTableData extends TableType {
  data: MemberStoreMemberWalletTransactionEntity[];
}

/** 钱包流水表 */
export declare interface MemberStoreMemberWalletTransactionEntity extends BaseEntity {
  [key: string]: any;
}
