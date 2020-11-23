export interface Calendar {
  title: string;
  calendarId: string;
  isActive: boolean;
  color?: string;
  manualAddingAllowed: boolean;

  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  singleEvents?: boolean;
}
