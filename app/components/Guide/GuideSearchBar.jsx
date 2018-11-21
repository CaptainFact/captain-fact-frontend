import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withNamespaces, Trans } from 'react-i18next'
import Icon from '../Icons/Icon';


@withNamespaces('guide')
export default class GuideSearchBar extends Component {
  state = {

  }  

  render() {
    return (
      <div className="searchbar guide-searchbar">
        <input placeholder='Rechercher' type="text"/>
        <div>
          <div className='wrapper-select'>
            <select name="" id="">
            {this.props.data.subjects.map((subject, index) => {
              return (
                <option key={index} value={subject.title}>{subject.title}</option>
              )
            })}
            </select>
          </div>
          <label className='wrapper-checkbox'>
            <input type="checkbox" name="" id=""/>
            <span className='check'></span>
            <span>Récompense</span>
          </label>
        </div>

      </div>
    )
  }
}
