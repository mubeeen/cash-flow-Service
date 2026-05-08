/**
 * Load Test — Expense API
 *
 * Run with: k6 run load-tests/expense-api.js
 * Requires: k6 installed (brew install k6)
 * Requires: app running on localhost:3000
 *
 * What this tests:
 * - Can the API handle 50 concurrent users for 30 seconds?
 * - Is average response time under 500ms?
 * - Is p95 response time under 1 second?
 * - Are there any failed requests (non-2xx)?
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Ramp up to 50 users over 10s, hold for 30s, ramp down
  stages: [
    { duration: '10s', target: 50 },  // ramp up
    { duration: '30s', target: 50 },  // hold
    { duration: '5s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['avg<500', 'p(95)<1000'],  // avg < 500ms, p95 < 1s
    http_req_failed: ['rate<0.01'],                 // less than 1% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // GET list of expenses
  const listRes = http.get(`${BASE_URL}/api/v1/expenses?page=1&limit=10`);
  check(listRes, {
    'list: status 200': (r) => r.status === 200,
    'list: has data array': (r) => JSON.parse(r.body).data !== undefined,
  });

  sleep(1); // simulate user think time

  // GET health check
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'health: status 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
