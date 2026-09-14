/**
 * TEST_AT - k6 Performance Test: Employee / PIM related endpoints
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '15s', target: 2 },
    { duration: '30s', target: 5 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'],
    http_req_failed: ['rate<0.2'],
    failed_requests: ['rate<0.2'],
    checks: ['rate>0.85'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export default function () {
  const res1 = http.get(`${BASE_URL}/web/index.php/auth/login`, {
    tags: { name: 'LoginPage' },
  });
  const ok1 = check(res1, {
    'login status 200': (r) => r.status === 200,
  });

  const res2 = http.get(`${BASE_URL}/web/index.php/pim/viewEmployeeList`, {
    tags: { name: 'EmployeeList' },
    redirects: 5,
  });
  const ok2 = check(res2, {
    'pim endpoint responds': (r) =>
      r.status === 200 || r.status === 302 || r.status === 301 || r.status === 401 || r.status === 403,
  });

  failureRate.add(!(ok1 && ok2));
  sleep(1);
}