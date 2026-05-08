const requiredEnvVars = ['DATABASE_URL'] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}`);
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  db: {
    url: process.env.DATABASE_URL!,
  },
  log: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX ?? 100),
  },
  otel: {
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
  },
};
