export class APIRequestParams {
  start: string;
  end: string
};

export class APIRequestUser extends APIRequestParams {
  profile: string
};

export class APIRequestRespuesta extends APIRequestUser {
  pregunta: string
};

