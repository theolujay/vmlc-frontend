import { CreatedByType } from './auth';

// Target roles structure for broadcast
export type TargetRolesType = {
  staff?: ('volunteer' | 'moderator' | 'admin' | 'manager' | 'superadmin')[];
  candidate?: ('screening' | 'league' | 'final' | 'winner')[];
};

export type BroadcastStatus = 'pending' | 'in_progress' | 'sent' | 'partial' | 'failed' | 'completed';

export type DeliveryLogType = {
  id: number;
  medium: string;
  target_role: string;
  role_type: string;
  status: string;
  message: string;
  attempted_at: string;
  user_email?: string;
};

export type BroadcastSummaryDataType = {
  total_broadcasts: number;
  sent_count: number;
  pending_count: number;
  failed_count: number;
  partial_count: number;
  email_count: number;
  sms_count: number;
  whatsapp_count: number;
  platform_count: number;
};

export type BroadcastType = {
  broadcast_summary_data: BroadcastSummaryDataType;
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: BroadcastItemType[];
};

export type BroadcastItemType = {
  id: number;
  subject: string;
  message: string;
  created_by?: CreatedByType;
  created_at: string;
  mediums: string[];
  target_roles: TargetRolesType;
  status?: BroadcastStatus;
  last_attempt?: string;
  logs?: DeliveryLogType[];
  task_id?: string;
  delivery_attempts?: number;
  delivery_logs?: DeliveryLogType[];
  scheduled_at?: string;
};

export type CreateBroadCastType = {
  subject: string;
  message: string;
  mediums: ('email' | 'platform' | 'sms' | 'whatsapp')[];
  target_roles: TargetRolesType;
  scheduled_at?: string;
};
