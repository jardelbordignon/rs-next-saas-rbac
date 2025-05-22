import dayjs from 'dayjs'
import _relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(_relativeTime)

export function relativeTime(date: dayjs.ConfigType, withoutSuffix?: boolean) {
  return dayjs(date).fromNow(withoutSuffix)
}
