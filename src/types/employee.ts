/**
 * TEST_AT - Employee related type definitions
 */
export interface EmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeId?: string;
  username?: string;
  password?: string;
  status?: 'Enabled' | 'Disabled';
}

export interface CreatedEmployee extends EmployeeData {
  empNumber: string; // Internal OrangeHRM employee number
  fullName: string;
}
