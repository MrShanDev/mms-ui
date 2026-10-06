// Keep IDs as strings: menu IDs may exceed JavaScript's safe integer range.
export const normalizeConfig = (source: any = {}) => ({
  ...source,
  menuId: String((Array.isArray(source.menuId) ? source.menuId.at(-1) : source.menuId) || '0'),
  baseclassId: source.baseclassId == null ? '' : String(source.baseclassId),
  span: [24, 12, 8].includes(Number(source.span)) ? Number(source.span) : 24,
  formLayout: [1, 2, 3].includes(Number(source.formLayout)) ? Number(source.formLayout) : 1,
  generatorType: Number(source.generatorType) === 1 ? 1 : 0,
  fieldList: Array.isArray(source.fieldList) ? source.fieldList : [],
});

export const normalizeMenus = (rows: any[] = []): any[] => {
  const visit = (items: any[]): any[] => items.filter(item => Number(item.type) !== 2).map(item => {
    const children = visit(item.children || []);
    return { ...item, id: String(item.id), children: children.length ? children : undefined };
  });
  return [{ id: '0', name: '顶级菜单', children: visit(rows || []) }];
};

export const recommendTreeFields = (config: any) => {
  const fields = config.fieldList || [];
  const valid = (name: string) => fields.some((f: any) => f.attrName === name);
  const parent = fields.find((f: any) => !f.primaryPk && /^(parentId|pid|parent_id)$/i.test(f.attrName))
    || fields.find((f: any) => !f.primaryPk && /^(parent_id|pid)$/i.test(f.fieldName));
  const label = fields.find((f: any) => /^(name|title|label|.*Name)$/i.test(f.attrName) && !f.primaryPk);
  return {
    parentId: valid(config.parentId) && !fields.find((f: any) => f.attrName === config.parentId)?.primaryPk ? config.parentId : parent?.attrName || '',
    tableLabel: valid(config.tableLabel) ? config.tableLabel : label?.attrName || '',
  };
};
