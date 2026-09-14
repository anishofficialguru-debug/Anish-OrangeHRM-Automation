/**
 * TEST_AT - k6 Performance Test: Login page
 * Targets the public OrangeHRM demo (shared environment – thresholds are realistic)
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '20s', target: 3 },
    { duration: '40s', target: 5 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    // Public demo is shared & often slow – keep thresholds realistic
    http_req_duration: ['p(95)<8000'],
    http_req_failed: ['rate<0.1'],
    failed_requests: ['rate<0.15'],
    checks: ['rate>0.9'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export default function () {
  const res = http.get(`${BASE_URL}/web/index.php/auth/login`, {
    tags: { name: 'LoginPage' },
  });

  const body = (res.body || '').toLowerCase();
  const success = check(res, {
    'login page status is 200': (r) => r.status === 200,
    'login page contains OrangeHRM content': (r) =>
      body.includes('username') ||
      body.includes('password') ||
      body.includes('orangehrm') ||
      body.includes('login'),
  });

  failureRate.add(!success);
  sleep(1);
}