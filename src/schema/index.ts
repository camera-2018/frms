export interface Res<T> {
  code: number
  info: string
  data: T
}