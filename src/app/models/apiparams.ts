export interface APIRequestParams {
  start: string | number,
  end: string | number
};

export interface APIRequestUser extends APIRequestParams {
  profile: string | number
};

export interface APIRequestRespuesta extends APIRequestUser {
  pregunta: string | number
};

