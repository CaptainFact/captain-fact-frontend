import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'
import GuideItem from './GuideItem';


@withNamespaces('guide')
export default class GuideSubject extends Component {
  render() {
    
    return (
      <li className="guide-subject">
        <h3>{this.props.subject.title}</h3>
        <ul>
          {this.props.subject.items.map((item, index) => {
            return <GuideItem key={index} item={item} cat={this.props.subject.title}/>
          })}
        </ul>
      </li>
    )
  }
}
