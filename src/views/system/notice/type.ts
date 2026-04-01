
/**
 * moduleName: 系统公告
 * queryForm：查询对象
 * tableData：数据对象
 */
export declare interface NoticeState {
  tableData: NoticeTableData;
}

/**
 * 查询对象
 * @interface NoticeTableData
 * @extends {TableType}
 */
declare interface NoticeTableData extends TableType {
  data: NoticeEntity[];
}

/**
 * 对象实体
 * @interface Notice
 * @extends {BaseEntity}
 */
export declare interface NoticeEntity extends BaseEntity {
  id: string | number;
  title: string | number;
  /** 富文本 HTML，与 fast-editor 的 string 绑定一致 */
  content: string;
  type: string | number;
}
