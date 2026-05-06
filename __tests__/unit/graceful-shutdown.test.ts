/**
 * @jest-environment node
 */

jest.mock('@/lib/db', () => ({
  prisma: { $disconnect: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('@/lib/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));

describe('Graceful Shutdown', () => {
  it('registers SIGTERM and SIGINT handlers', async () => {
    process.env.NEXT_RUNTIME = 'nodejs';
    const processOnSpy = jest.spyOn(process, 'on');

    // Dynamic import to trigger register()
    jest.resetModules();
    jest.mock('@opentelemetry/sdk-node', () => ({
      NodeSDK: jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        shutdown: jest.fn().mockResolvedValue(undefined),
      })),
    }));
    jest.mock('@opentelemetry/auto-instrumentations-node', () => ({
      getNodeAutoInstrumentations: jest.fn(() => []),
    }));
    jest.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
      OTLPTraceExporter: jest.fn(),
    }));

    const { register } = await import('@/instrumentation');
    await register();

    const signals = processOnSpy.mock.calls.map(([signal]) => signal);
    expect(signals).toContain('SIGTERM');
    expect(signals).toContain('SIGINT');

    processOnSpy.mockRestore();
    delete process.env.NEXT_RUNTIME;
  });
});
