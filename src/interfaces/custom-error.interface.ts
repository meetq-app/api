export interface ICustomError extends Error {
  status?: number;
  details?: Array<{ [key: string]: string }>;
}
