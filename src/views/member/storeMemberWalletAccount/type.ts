
export declare interface MemberStoreMemberWalletAccountState {
  tableData: MemberStoreMemberWalletAccountTableData;
}

declare interface MemberStoreMemberWalletAccountTableData extends TableType {
  data: MemberStoreMemberWalletAccountEntity[];
}

/** 会员提现账号表 */
export declare interface MemberStoreMemberWalletAccountEntity extends BaseEntity {
  [key: string]: any;
}
