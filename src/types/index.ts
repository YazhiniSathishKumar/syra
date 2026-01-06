// src/types/index.ts
// src/types/index.ts
import { LucideIcon } from 'lucide-react';

export type ColorKey = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
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

export interface StatsCardItem {
  label: string;
  value: string;
  icon: LucideIcon | React.ElementType;
  color: ColorKey;
  trend: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadTime: string;
  category: 'report' | 'certificate' | 'evidence' | 'summary';
  downloadUrl: string;
  status: 'processing' | 'ready';
}

export interface QuickActionItem {
  label: string;
  icon: LucideIcon;
  color: ColorKey;
  description: string;
}
