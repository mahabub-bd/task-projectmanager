import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 100 })
  resource: string;

  @Column({ length: 50 })
  action: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
