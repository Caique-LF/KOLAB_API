import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.children, { nullable: true })
  parentUserId: User;

  @OneToMany(() => User, (user) => user.parentUserId)
  children: User[];
}
