export class AuthModel {
  token: string;
  refreshToken: string;
  expiresIn: Date;
  userKey: string;
  userToken: string;
  sysAdmin: boolean;
  accountant: boolean;
  authMethod: string;
  status: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;

  setAuth(auth: any) {
    this.token = auth.token;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    this.userKey = auth.userKey;
    this.userToken = auth.userToken;
    this.sysAdmin = auth.sysAdmin;
    this.accountant = auth.accountant;
    this.authMethod = auth.authMethod;
    this.status = auth.status;
    this.username = auth.username;
    this.fullName = auth.fullName;
    this.firstName = auth.firstName;
    this.lastName = auth.lastName;
    this.email = auth.email;
    this.role = auth.role;
  }
}
