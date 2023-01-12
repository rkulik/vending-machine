import { config } from '@vending-machine/config';
import { ActiveLogin } from '@vending-machine/domains/active-login/entity';
import { Product } from '@vending-machine/domains/product/entity';
import { User } from '@vending-machine/domains/user/entity';
import { registerService } from '@vending-machine/utils/register-service';
import { DataSource as TypeOrmDataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions =
  config.environment === 'test'
    ? {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Product, ActiveLogin],
        synchronize: true,
        logging: false,
      }
    : {
        type: 'mysql',
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        username: config.database.user,
        password: config.database.password,
        entities: [User, Product, ActiveLogin],
        synchronize: true,
        logging: false,
      };

const dataSource = registerService('db', () => new TypeOrmDataSource(options));

export const getDb = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
};
