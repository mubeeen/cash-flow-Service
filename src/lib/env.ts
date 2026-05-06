const requiredEnvVars = ['DATABASE_URL'] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}`);
  }
}

export const env = {
  get DATABASE_URL() {
    return process.env.DATABASE_URL!;
  },
  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  },
};
