export const STOCK_TYPE_MASTER = {
  CH: 'CHEMICAL',
  CS: 'CONSUMABLE GOODS',
  DR: 'DRILLING ACC',
  EL: 'ELECTRICAL',
  EX: 'EXPLOSIVE',
  FD: 'FUEL DIESEL',
  GS: 'GASOLINE',
  LB: 'LUBRICANT',
  MR: 'MAINTENANCE ROAD',
  MT: 'MAINTENANCE TOOL',
  OF: 'OFFICE SUPPLIES',
  OP: 'OPERATIONAL SUPPORT',
  SF: 'SAFETY',
  SP: 'SPARE PART',
  TY: 'TYRE'
};

export const getStockTypeLabel = (code) => {
  if (!code) return '-';
  const trimmed = String(code).trim().toUpperCase();
  const desc = STOCK_TYPE_MASTER[trimmed];
  return desc ? `${trimmed} - ${desc}` : code;
};

export const getStockTypeDescription = (code) => {
  if (!code) return '-';
  const trimmed = String(code).trim().toUpperCase();
  return STOCK_TYPE_MASTER[trimmed] || code;
};
