export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');

    const sdk = new NodeSDK({
      serviceName: 'expense-tracker',
      traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
    console.log('OpenTelemetry tracing initialized (Tempo)');
  }
}
