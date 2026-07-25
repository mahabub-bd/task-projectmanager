import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: string;
  requiredRole?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface Breadcrumb {
  label: string;
  href: string;
}
