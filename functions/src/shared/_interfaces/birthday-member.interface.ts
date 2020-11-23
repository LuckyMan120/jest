export interface BirthdayMember {
  lastName: string;
  firstName: string;
  monthDay: string;
  age?: number | string;
  email: string;
  birthDate: string;
  id: string;

  gender: string;
  executionDate?: number;

  assignedItems: string[];
  assignedTypes: string[];
}
