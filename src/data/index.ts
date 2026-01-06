// src/data.ts

import {
  Shield,
  CheckCircle,
  Smartphone,
  FileText
} from 'lucide-react';

import { NotificationItem, StatsCardItem, DocumentItem, QuickActionItem } from '../types/index';
import { AuditRequest } from '../context/WorkflowContext';

// Re-export or use from types/index.ts
// export type NotificationType = 'info' | 'success' | 'warning' | 'error';
// export interface NotificationItem { ... }

export const statsData: StatsCardItem[] = [
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

export const recentAuditsData: AuditRequest[] = [];

export const notificationsData: NotificationItem[] = [];

export const quickActionsData: QuickActionItem[] = [
  { label: 'Mobile Check', icon: Smartphone, color: 'secondary', description: 'Mobile app security' },
  { label: 'Report', icon: FileText, color: 'warning', description: 'Generate reports' }
];

export const documentsData: DocumentItem[] = [];
