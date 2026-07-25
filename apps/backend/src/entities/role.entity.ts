import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.roles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'boolean', default: true })
  is_system_role: boolean;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  user_roles: UserRole[];
}
