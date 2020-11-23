export interface Publication {
  at?: number | Date;
  status?: number;
  by?: string;
  user?: {
    displayName: string;
    photoUrl: string;
    assignedRoles: string[];
  };
}
