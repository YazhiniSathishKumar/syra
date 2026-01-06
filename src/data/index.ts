// src/data.ts

import {
  Shield,
  CheckCircle,
  Smartphone,
  FileText
} from 'lucide-react';

import { ElementType } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  unread: boolean;
  icon: ElementType;
}

export const statsData = [
  {
    label: 'Active Audits',
    value: '0',
    icon: Shield,
    color: 'info',
    trend: '',
    description: 'Currently running security audits'
  },
  {
    label: 'Completed Audits',
    value: '1',
    icon: CheckCircle,
    color: 'success',
    trend: '',
    description: 'Successfully completed this month'
  }
];

export const recentAuditsData: any[] = [];

export const notificationsData: NotificationItem[] = [];

export const quickActionsData = [
  { label: 'Mobile Check', icon: Smartphone, color: 'secondary', description: 'Mobile app security' },
  { label: 'Report', icon: FileText, color: 'warning', description: 'Generate reports' }
];

export const documentsData: any[] = [];
