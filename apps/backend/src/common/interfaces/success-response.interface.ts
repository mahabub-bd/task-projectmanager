export interface SuccessResponse<T = any> {
  message: string;
  statusCode: number;
  data: T;
}
