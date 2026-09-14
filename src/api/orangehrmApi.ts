import { APIRequestContext, expect } from '@playwright/test';

/**
 * TEST_AT - OrangeHRM API helpers
 * Note: Public demo has limited/restricted API access.
 * These helpers work with session cookies from UI login
 * or can be extended for OAuth when self-hosted.
 */
export class OrangeHRMApi {
  constructor(private request: APIRequestContext) {}

  /**
   * Verify employee existence via UI-backed search or public endpoints.
   * For the public demo we primarily rely on UI + network interception.
   */
  async getEmployees(searchName?: string): Promise<any> {
    // The demo site uses internal API under /web/index.php/api/v2/
    const response = await this.request.get('/web/index.php/api/v2/pim/employees', {
      params: searchName ? { nameOrId: searchName } : {},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async verifyEmployeeCreated(empNumberOrName: string): Promise<boolean> {
    try {
      const res = await this.getEmployees(empNumberOrName);
      if (res.ok()) {
        const body = await res.json();
        return body?.data?.length > 0;
      }
      return false;
    } catch {
      return false;
    }
  }
}
