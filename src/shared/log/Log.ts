export interface Log {
  setContext(context: string): void;
  log(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}
