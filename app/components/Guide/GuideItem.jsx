import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'


@withNamespaces('guide')
export default class GuideItem extends Component {
  render() {

    return (
      <li className="guide-item">
        <div className='guide-item-texts'>
          <span>{this.props.item.title}</span>
          <span className='cat'>{this.props.cat}</span>
        </div>
        <div className='guide-item-actions'>
          <button className='btn btn-link' onClick={() => this.props.onAdd(this.props.item, true)}>Ajouter à la liste</button>
          <button className='btn btn-outline'>Suivre</button>          
        </div>
        <div className='guide-item-rep'>
          {this.props.item.points > 0 && (
            <span>{this.props.item.points}</span>
          )}
        </div>

      </li>
    )
  }
}
