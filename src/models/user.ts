import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'citext', unique: true })
  email!: string;

  @Column({ select: false })
  pwdHash!: string;

  @CreateDateColumn({ precision: 3 })
  createdAt!: Date;

  static getPublicProfile(user: User): UserPublicProfile {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export class UserPublicProfile {
  id!: number;
  email!: string;
  createdAt!: Date;
}
