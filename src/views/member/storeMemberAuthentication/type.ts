
export declare interface MemberStoreMemberAuthenticationState {
  tableData: MemberStoreMemberAuthenticationTableData;
}

declare interface MemberStoreMemberAuthenticationTableData extends TableType {
  data: MemberStoreMemberAuthenticationEntity[];
}

/** 会员认证 */
export declare interface MemberStoreMemberAuthenticationEntity extends BaseEntity {
  [key: string]: any;
}
