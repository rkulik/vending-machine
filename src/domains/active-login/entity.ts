import { User } from '@vending-machine/domains/user/entity';
import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity('activeLogin')
export class ActiveLogin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tokenId: string;

  @ManyToOne(() => User, user => user.activeLogins, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @RelationId((activeLogin: ActiveLogin) => activeLogin.user)
  userId: number;
}
