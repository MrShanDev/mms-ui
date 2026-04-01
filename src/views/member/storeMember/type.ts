
export declare interface MemberStoreMemberState {
  tableData: MemberStoreMemberTableData;
}

declare interface MemberStoreMemberTableData extends TableType {
  data: MemberStoreMemberEntity[];
}

/** 会员 */
export declare interface MemberStoreMemberEntity extends BaseEntity {
  [key: string]: any;
}
