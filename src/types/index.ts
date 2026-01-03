// src/types/index.ts
// src/types/index.ts
import { LucideIcon } from 'lucide-react';

export type ColorKey = 'info' | 'success' | 'warning' | 'error' | 'secondary';
export type VariantType = 'bg' | 'text' | 'border';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  unread: boolean;
  icon: LucideIcon;
}

