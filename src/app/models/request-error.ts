export class RequestError {
  public code: string;
  public details: string;
  public text: string;

  constructor(code: string, details: string, text: string) {
    this.code = code;
    this.details = details;
    this.text = text;
  }
}
