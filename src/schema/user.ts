export type Role = "admin" | "user" | "worker" | "guest"
export type JobType = '锁匠' | '集中供热' | '寝室洗衣机' | '水工类' | '玻璃类' | '塑钢类' | '木工类' | '电工类' | '泥工类' | '其他' | '未指定'

export interface LoginForm {
  account: string
  password: string
}

export interface LoginRes {
  token: string
  role: Role
}

export interface UserState {
  is_login: boolean
  token: string
  role: Role
  _id?: string
  account?: string
  name?: string
  sex?: string
  phone?: string
  department?: string
  job_type?: JobType,
  avatar?: string
  created_at?: string
  updated_at?: string
}