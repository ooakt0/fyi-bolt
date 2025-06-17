interface LogContext {
  action?: string;
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  payload?: any;
  status?: number;
  error?: Error | string | unknown;
  ideaId?: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  filePath?: string;
  contentType?: string;
  fileCount?: number;
  currentPrivacy?: boolean;
  newPrivacy?: boolean;
  isPrivate?: boolean;
  userId?: string;
}

class Logger {
  private static formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
      ...(import.meta.env.MODE === 'development' ? { env: 'development' } : {})
    };
    return JSON.stringify(logEntry);
  }

  private static persistLog(logEntry: string) {
    // In development, log to console with colors
    if (import.meta.env.MODE === 'development') {
      const entry = JSON.parse(logEntry);
      const colors = {
        info: '#4CAF50',
        error: '#F44336',
        warn: '#FFC107',
        debug: '#2196F3'
      };
      console.log(
        `%c${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`,
        `color: ${colors[entry.level as keyof typeof colors]}; font-weight: bold;`
      );
      if (Object.keys(entry).length > 3) {
        console.log('Context:', entry);
      }
    }

    // You could also send logs to your backend API here
    // await fetch('/api/logs', { method: 'POST', body: logEntry });
  }

  static info(message: string, context?: LogContext) {
    this.persistLog(this.formatMessage('info', message, context));
  }

  static error(message: string, context?: LogContext) {
    this.persistLog(this.formatMessage('error', message, context));
  }

  static warn(message: string, context?: LogContext) {
    this.persistLog(this.formatMessage('warn', message, context));
  }

  static debug(message: string, context?: LogContext) {
    if (import.meta.env.MODE === 'development') {
      this.persistLog(this.formatMessage('debug', message, context));
    }
  }
}

interface LogContext {
  action?: string;
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  payload?: any;
  status?: number;
  error?: Error | string | unknown;
  ideaId?: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  filePath?: string;
  contentType?: string;
  fileCount?: number;
  currentPrivacy?: boolean;
  newPrivacy?: boolean;
  isPrivate?: boolean;
  userId?: string;
}

export const log = {
  info: (message: string, context?: LogContext) => {
    Logger.info(message, context);
  },
  error: (message: string, context?: LogContext) => {
    Logger.error(message, context);
  },
  warn: (message: string, context?: LogContext) => {
    Logger.warn(message, context);
  },
  debug: (message: string, context?: LogContext) => {
    Logger.debug(message, context);
  }
};

export default log;
