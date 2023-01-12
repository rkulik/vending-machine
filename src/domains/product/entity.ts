import { User } from '@vending-machine/domains/user/entity';
import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  cost: number;

  @Column()
  amountAvailable: number;

  @ManyToOne(() => User, user => user.products, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: Relation<User>;

  @RelationId((product: Product) => product.seller)
  sellerId: number;
}
