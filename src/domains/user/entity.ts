import { ActiveLogin } from '@vending-machine/domains/active-login/entity';
import { Product } from '@vending-machine/domains/product/entity';
import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  deposit: number;

  @Column()
  role: string;

  @OneToMany(() => Product, product => product.seller)
  products: Relation<Product[]>;

  @RelationId((user: User) => user.products)
  productIds: number[];

  @OneToMany(() => ActiveLogin, activeLogin => activeLogin.user)
  activeLogins: Relation<ActiveLogin[]>;

  @RelationId((user: User) => user.activeLogins)
  activeLoginIds: number[];
}
