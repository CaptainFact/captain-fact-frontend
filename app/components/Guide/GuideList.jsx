import React, {Component} from 'react'
import PropTypes from 'prop-types';

export default class GuideList extends Component {
  render(){
    return (
      <div className="guide-list">
        <h2>Ma liste</h2>
        <p>Vous pouvez sauvegarder des guides dans votre liste, ils s’activeront automatiquement si vous êtes sur les pages concernées.</p>
        <ul className='guide-list-inner'>
          {this.props.data && this.props.data.map((item, index) => {
            return(
              <li key={index}>
                <span>{item.title}</span>
                <button className='btn btn-link red' onClick={() => this.props.onDelete(item, false)}>Supprimer</button>
              </li>
            )
          })}
          <div className='shadow'></div>
        </ul>
        <label className='wrapper-checkbox'>
          <input type="checkbox" name="searchByReputation" id=""/>
          <span className='check'></span>
          <span>Désactiver la liste</span>
        </label>
        <p>La liste n’apparait plus dans le menu et les guides de ne lance pas automatiquement si votre liste est désactivée.</p>
      </div>
    )
  }
}
