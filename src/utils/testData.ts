import { faker } from '@faker-js/faker';
import { EmployeeData } from '../types/employee';

/**
 * TEST_AT - Test data generation utilities
 * Generates unique, realistic employee data for each test run
 */
export class TestDataGenerator {
  static generateEmployee(): EmployeeData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    // OrangeHRM Employee Id is typically numeric. Use pure digits to avoid validation errors.
    const uniqueId = Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);

    return {
      firstName,
      middleName: faker.person.middleName(),
      lastName,
      employeeId: uniqueId,                 // numeric only – critical for the demo
      username: `testat${uniqueId}`,
      password: `Test@${uniqueId}!`,
      status: 'Enabled',
    };
  }

  static generateUniqueId(prefix = 'TEST_AT'): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}