import { visit } from '@vending-machine/utils/object';

export const sanitize = visit((_key, value) => {
  if (value === null) {
    return undefined;
  } else if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue || undefined;
  } else {
    return value;
  }
});
