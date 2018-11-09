import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'


@withNamespaces('guide')
export default class Guide extends Component {
  render() {
    return (
      <div className="guide-page">
        Guide
      </div>
    )
  }
}
