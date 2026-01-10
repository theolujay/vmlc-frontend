import { CreatedByType } from './auth';

// Target roles structure for broadcast
export type TargetRolesType = {
  staff?: ('volunteer' | 'moderator' | 'admin' | 'manager' | 'superadmin')[];
  candidate?: ('screening' | 'league' | 'final' | 'winner')[];
};

export type BroadcastStatus = 'pending' | 'completed' | 'failed';

export type DeliveryLogType = {
  user_id: number;
  user_email: string;
  medium: string;
  status: 'success' | 'failed';
  error_message?: string;
  sent_at: string;
};

export type BroadcastType = {
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
  created_by: CreatedByType;
  created_at: Date;
  mediums: string[];
  target_roles: TargetRolesType;
  status?: BroadcastStatus;
  task_id?: string;
  delivery_attempts?: number;
  delivery_logs?: DeliveryLogType[];
};

export type CreateBroadCastType = {
  subject: string;
  message: string;
  mediums: ('email' | 'platform')[];
  target_roles: TargetRolesType;
};
