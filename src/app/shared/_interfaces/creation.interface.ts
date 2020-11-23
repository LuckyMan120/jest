
export interface Creation {
  at?: number;
  by?: string;
  user?: {
    displayName?: string;
    photoUrl?: string;
    assignedRoles?: string[];
  } | null;
}
