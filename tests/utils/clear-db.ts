import { getDb } from '@vending-machine/services/database';

export const clearDb = async () => {
  const db = await getDb();
  const entities = db.entityMetadatas;

  await Promise.all(entities.map(entity => db.getRepository(entity.name).clear()));
};
