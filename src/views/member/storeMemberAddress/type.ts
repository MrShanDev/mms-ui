
export declare interface MemberStoreMemberAddressState {
  tableData: MemberStoreMemberAddressTableData;
}

declare interface MemberStoreMemberAddressTableData extends TableType {
  data: MemberStoreMemberAddressEntity[];
}

/** 会员收货地址 */
export declare interface MemberStoreMemberAddressEntity extends BaseEntity {
  [key: string]: any;
}
