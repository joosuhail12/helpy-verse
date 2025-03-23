
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  title: string;
  icon?: LucideIcon;
  path?: string;
  key?: string;
  children?: NavigationItem[];
}
