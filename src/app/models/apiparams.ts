export interface APIRequestParams {
  start: string,
  end: string
};

export interface APIRequestUser extends APIRequestParams {
  profile: string
};

export interface APIRequestRespuesta extends APIRequestUser {
  pregunta: string
};

