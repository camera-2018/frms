import { JobType } from "./user";

export type RepairStatus = '待提交' | '待派单' | '待接单' | '待协商' | '维修中' | '待验收' | '待支付' | '待评价' | '已完成';

export type RepairFlags = {
  is_request: boolean;
  is_assign: boolean;
  is_accept: boolean;
  is_consult: boolean;
  is_repair: boolean;
  is_confirm: boolean;
  is_pay: boolean;
  is_rate: boolean;
};

export interface Repair {
  [key: string]: any;

  _id: string;
  user_id: string;
  admin_id: string;
  worker_id: string;
  step: number;
  status: RepairStatus
  flags: RepairFlags
  type: JobType
  place?: string;
  attachment?: string[];
  detail?: string;
  is_urgent?: boolean;
  is_free?: boolean;
  estimate_cost?: number;
  estimate_receipt?: Array<{ key: string; value: number }>;
  actual_cost?: number;
  actual_receipt?: Array<{ key: string; value: number }>;
  result?: string;
  rate?: number;
  comment?: string;
  request_at?: Date;
  assign_at?: Date;
  accept_at?: Date;
  consult_at?: Date;
  confirm_at?: Date;
  pay_at?: Date;
  rate_at?: Date;
  finish_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface ReportForm {
  [key: string]: any;

  type: string
  is_urgent: boolean
  detail: string
  place: string
  attachment: Array<string>
}