import pino from 'pino';
import { config } from '@/lib/config';

export const logger = pino({
  name: 'expense-tracker',
  level: config.log.level,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
