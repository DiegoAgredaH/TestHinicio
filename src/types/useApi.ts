export type Method = "GET" | "PUT";

export interface ApiConfig {
  method: Method;
  url: string;
  headers: { Authorization: string };
  params?: Record<string, string | boolean | number >;
  data?: string;
}