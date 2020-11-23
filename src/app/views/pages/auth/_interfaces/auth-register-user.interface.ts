export interface AuthRegisterUser {
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  password: string;

  rememberMe?: boolean;
}
