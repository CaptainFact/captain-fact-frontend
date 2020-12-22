import React from 'react'
import { connect } from 'react-redux'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import distanceInWordsToNow from 'date-fns/formatDistance'
import format from 'date-fns/format'
import { locales } from '../../i18n/i18n'

@connect((state) => ({ locale: state.UserPreferences.locale }))
export class TimeSince extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { minutesDiff: TimeSince.getMinutesSince(props.time) }
    this.timeoutUpdate = this.timeoutUpdate.bind(this)
    this.timeout = null
  }

  componentDidMount() {
    this.timeoutUpdate()
  }

  componentWillUnmount() {
    this.clearTimeout()
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { time, locale, dispatch, addSuffix = true, isDateTime = true, ...props } = this.props
    const localeObj = locales[locale]
    const dateFormat = isDateTime ? localeObj.defaultDateTimeFormat : localeObj.defaultDateFormat
    const timeAsDate = new Date(time)

    return (
      <span title={format(timeAsDate, dateFormat, { locale: localeObj })} {...props}>
        {distanceInWordsToNow(timeAsDate, new Date(), { addSuffix, locale: localeObj })}
      </span>
    )
  }

  timeoutUpdate() {
    const secondsSince = !this.props.time ? 0 : differenceInSeconds(Date.now(), this.props.time)
    const minutesSince = Math.trunc(secondsSince / 60)

    // Update state
    this.setState({ minutesDiff: minutesSince })

    // Configure next timeout
    // Under 1h, update when next minute begin
    if (minutesSince < 60) {
      this.timeout = setTimeout(this.timeoutUpdate, (60 - (secondsSince % 60)) * 1000)
    }
    // Otherwise update when next hour begin
    else {
      this.timeout = setTimeout(this.timeoutUpdate, (60 - (minutesSince % 60)) * 60 * 1000)
    }
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = null
  }

  static getMinutesSince(time) {
    return !time ? 0 : Math.trunc(differenceInSeconds(Date.now(), time) / 60)
  }
}
