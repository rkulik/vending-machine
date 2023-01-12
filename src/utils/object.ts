/* eslint-disable @typescript-eslint/no-explicit-any */
const mapObject =
  <T extends Record<string, any>>(visitor: (key: keyof T, value: any) => [keyof T, any]) =>
  (input: T) =>
    Object.fromEntries(Object.entries(input).map(([key, value]) => visitor(key, value)) as [string, any][]);

export const visit =
  (visitor: (key: PropertyKey, value: any) => any) =>
  (input: any): any => {
    const applyVisitor = visit(visitor);

    if (Array.isArray(input)) {
      return input.map(applyVisitor);
    } else if (input && typeof input === 'object' && input.constructor.name === 'Object') {
      return mapObject((key, value) => [key, applyVisitor(visitor(key, value))])(input);
    }

    return input;
  };
