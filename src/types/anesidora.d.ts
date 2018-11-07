export = anesidora;
declare class anesidora {
  static ENDPOINT: string;
  constructor(username: string, password: string, partnerInfo?: object);
  username: string;
  password: string;
  partnerInfo?: object;
  authData: object;
  login(callback: Function): void;
  request(method: string, data: object, callback: Function): object;
}
