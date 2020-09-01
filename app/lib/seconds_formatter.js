import padLeft from 'voca/pad_left'

export default function formatSeconds(totalSeconds) {
  if (!totalSeconds) {
    return '0:00:00'
  }

  const sign = totalSeconds < 0 ? '-' : ''
  const absSeconds = Math.abs(totalSeconds)
  const hours = Math.trunc(absSeconds / 3600)
  const minutes = Math.trunc((absSeconds / 60) % 60)
  const seconds = padLeft(absSeconds % 60, 2, '0')

  return `${sign}${hours}:${padLeft(minutes, 2, '0')}:${seconds}`
}
