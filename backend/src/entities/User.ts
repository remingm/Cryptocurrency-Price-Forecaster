export interface IUser {
  email: string;
  password: string;
}

class User implements IUser {
  public email: string;
  public password: string;
  public auth_token: string;
}

export default User;
