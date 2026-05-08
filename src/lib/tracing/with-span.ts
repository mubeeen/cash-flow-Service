import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('cashflow-service');

export async function withSpan<T>(name: string, fn: () => Promise<T>, attributes?: Record<string, string | number>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      if (attributes) {
        Object.entries(attributes).forEach(([k, v]) => span.setAttribute(k, v));
      }
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}
