export interface TenantRow {
  tenantId: string;
  name: string;
  status: number;
  domain?: string;
  packageId?: string;
  expireTime?: string;
  accountCount?: number;
  remark?: string;
  contactName?: string;
  contactMobile?: string;
}
export interface TenantPackage {
  id: string;
  name: string;
  status: number;
  functionIds: string;
}
export interface TenantRuntime {
  enabled: boolean;
  column: string;
  exclusionTables: string[];
}
