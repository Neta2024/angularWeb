export class AuthModel {
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;
  userKey: string;
  userToken: string;
  sysAdmin: boolean;
  accountant: boolean;
  authMethod: string;
  status: string;

  setAuth(auth: any) {
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    this.userKey = auth.userKey;
    this.userToken = auth.userToken;
    this.sysAdmin = auth.sysAdmin;
    this.accountant = auth.accountant;
    this.authMethod = auth.authMethod;
    this.status = auth.status;
  }
}
