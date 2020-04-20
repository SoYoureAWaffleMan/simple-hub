import Vue from 'vue'
import format from 'date-fns/format'

const HUMAN_DATE_FORMAT = 'EEEE do MMMM'

Vue.filter('shortDate', function (date) {
  if(!date) {
    return ''
  }

  date = typeof date === 'string' ? new Date(date) : date
  return format(date, HUMAN_DATE_FORMAT)
})
