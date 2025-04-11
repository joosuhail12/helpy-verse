import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id?: string;
  title: string;
  path?: string;
  icon?: LucideIcon;
  children?: NavigationItem[];
  loadDynamicChildren?: boolean;
}

export interface MainNavItem extends NavigationItem {
  id: string;
}

export interface SubNavItem extends NavigationItem {
  path: string;
}
