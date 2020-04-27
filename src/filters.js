import Vue from 'vue'
import format from 'date-fns/format'
import {deviceIsMobileSize} from './lib/util.js'

const TERSE_DATE_FORMAT = 'd MMM'
const SHORT_DATE_FORMAT = 'EEE do MMMM'
const FULL_DATE_FORMAT  = 'EEEE do MMMM'

Vue.filter('shortDate', function (date) {
  const dateFormat = deviceIsMobileSize() ? TERSE_DATE_FORMAT : SHORT_DATE_FORMAT

  try {
    date = typeof date === 'string' ? new Date(date) : date
    return format(date, dateFormat)
  } catch(_e) {
    return ''
  }
})

Vue.filter('fullDate', function (date) {
  try {
    date = typeof date === 'string' ? new Date(date) : date
    return format(date, FULL_DATE_FORMAT)
  } catch(_e) {
    return ''
  }
})
