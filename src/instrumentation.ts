import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { prisma } = await import('@/lib/db');

    const sdk = new NodeSDK({
      serviceName: 'cashflow-service',
      traceExporter: new OTLPTraceExporter({
        url: config.otel.endpoint,
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
    logger.info('OpenTelemetry tracing initialized');

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info({ signal }, 'Shutdown signal received, draining...');

      try {
        await sdk.shutdown();
        logger.info('OpenTelemetry flushed');
      } catch (err) {
        logger.error({ err }, 'Error flushing OpenTelemetry');
      }

      try {
        await prisma.$disconnect();
        logger.info('Database disconnected');
      } catch (err) {
        logger.error({ err }, 'Error disconnecting database');
      }

      logger.info('Shutdown complete');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}
