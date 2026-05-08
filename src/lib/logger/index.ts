import pino from 'pino';
import { config } from '@/lib/config';

export const logger = pino({
  name: 'cashflow-service',
  level: config.log.level,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
