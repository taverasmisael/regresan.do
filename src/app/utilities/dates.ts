import * as moment from 'moment';

export const toUnix = (date) => moment(date).unix().toString();
export const isValidUnix = (date) => moment.unix(+date).isValid();
