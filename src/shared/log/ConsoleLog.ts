import { Log } from './Log';

export class ConsoleLog implements Log {
  private context = '';

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, meta?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.log(`[${this.context}] ${message}`, meta ?? '');
  }

  error(message: string, meta?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.error(`[${this.context}] ${message}`, meta ?? '');
  }
}
