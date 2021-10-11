export interface ICoin {
  email: string;
  password: string;
}

class Coin implements ICoin {
  public email: string;
  public password: string;
  public auth_token: string;
}

export default Coin;
