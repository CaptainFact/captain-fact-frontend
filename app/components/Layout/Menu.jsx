import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import Icon from '../Icons/Icon';

export default class Menu extends Component {
  state = {

  };

  render() {
    return ( 
      <header className='sidebar'>
        <div className='sidebar-pp' style={{backgroundImage: `url(https://pbs.twimg.com/profile_images/758149842384322560/FJVKspY_.jpg)`}}></div>

        <div className='sidebar-reputation'>
          <span className='current'>254</span>
          <span>275</span>
        </div>

        <nav className='sidebar-nav' role='navigation'>
          <ul className='sidebar-nav-items' >
            <li className='sidebar-nav-item active'>
              <Icon name='guide'/>
            </li>
            <li className='sidebar-nav-item'>
              <Icon name='videos'/>
            </li>
            <li className='sidebar-nav-item'>
              <Icon name='limitations'/>  
            </li>
            <li className='sidebar-nav-item'>
              <Icon name='help'/>
            </li>
            <li className='sidebar-nav-item'>
              <Icon name='settings'/>
            </li>
          </ul>
        </nav>

        <div className='sidebar-bottom'>
          <span className='sidebar-bottom-btn' aria-label='Expande/Collapse the sidebar'></span>
        </div>

      </header>
    )
  }
}