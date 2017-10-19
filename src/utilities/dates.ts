import * as moment from 'moment'

export const toUnixDate = date => moment(date).unix().toString()
export const isValidUnix = date => moment.unix(+date).isValid()
