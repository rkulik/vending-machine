export type ChunkResult = {
  chunks: number[];
  remainder: number;
};

export const chunk = (value: number, size: number): ChunkResult => {
  const chunks = Array<typeof size>(Math.floor(value / size)).fill(size);
  const remainder = value % size;

  return { chunks, remainder };
};
