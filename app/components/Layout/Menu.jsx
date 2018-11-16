import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import Icon from '../Icons/Icon';
import { Link } from 'react-router'
import ReactMorph from "react-morph";

export default class Menu extends Component {
  state = {
    collapsed: true,
    showOnOpen: false
  };

  toggleCollapse = () => {
    if(!this.state.collapsed){
      this.setState({showOnOpen: false})
    }else{
      setTimeout(() => {
        this.setState({showOnOpen: true})
      }, 200);
    }
    this.setState({collapsed: !this.state.collapsed})
  }

  componentDidMount = () => {
    console.log(this.state.collapsed);
    
  }

  render() {
    return ( 
      <header className={ this.state.collapsed ? 'sidebar' : 'sidebar opened' }>
        <div className='sidebar-profile'>
          <div className='sidebar-pp' style={{backgroundImage: `url(https://pbs.twimg.com/profile_images/758149842384322560/FJVKspY_.jpg)`}}></div>
          <div className={ !this.state.showOnOpen ? 'sidebar-profile-infos hidden' : 'sidebar-profile-infos visible' }>
            <div>Jérémy Le Manach</div>
            <a href='#'>Voir mon profil</a>
          </div>
        </div>

        <div className='sidebar-reputation'>
          <span className={ !this.state.showOnOpen ? 'hidden' : 'visible' }>Réputation</span>
          <div className='sidebar-reputation-score'>
            <span className='current'>254</span>
            <span>275</span>
          </div>
        </div>

        <nav className='sidebar-nav' role='navigation'>
          <ul className='sidebar-nav-items' >
            <li className='sidebar-nav-item'>
              <Link to={'/new/guide'} activeClassName="active">
                <Icon name='guide'/>
              </Link>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new'} onlyActiveOnIndex activeClassName="active">
                <Icon name='videos'/>
              </Link>
            </li>
            <li className='sidebar-nav-item'>
            <Link to={'/new/limitations'} activeClassName="active">
                <Icon name='limitations'/>  
              </Link>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new/help'} activeClassName="active">
                <Icon name='help'/>
              </Link>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new/settings'} activeClassName="active">
                <Icon name='settings'/>
              </Link>
            </li>
          </ul>
        </nav>

        <div className='sidebar-bottom' onClick={this.toggleCollapse}>
          <span className='sidebar-bottom-btn' aria-label='Expande/Collapse the sidebar'></span>
        </div>

      </header>
    )
  }
}