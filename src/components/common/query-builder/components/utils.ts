
export const getOperatorLabel = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    equals: 'equals',
    notEquals: 'does not equal',
    contains: 'contains',
    not_contains: 'does not contain',
    startsWith: 'starts with',
    starts_with: 'starts with',
    endsWith: 'ends with',
    ends_with: 'ends with',
    greaterThan: 'is greater than',
    greater_than: 'is greater than',
    lessThan: 'is less than',
    less_than: 'is less than',
    between: 'is between',
    in: 'is in list',
    notIn: 'is not in list',
    not_in: 'is not in list',
    exists: 'exists',
    notExists: 'does not exist',
    custom_range: 'is in range',
    last_n_days: 'is in last',
    next_n_days: 'is in next',
    rolling_days: 'is in rolling period',
  };

  return operatorMap[operator] || operator;
};
