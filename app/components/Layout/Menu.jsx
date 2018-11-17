import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import Icon from '../Icons/Icon';
import { Link } from 'react-router'

import {TweenMax} from 'gsap/all';

export default class Menu extends Component {
  state = {
    collapsed: true,
    showOnOpen: false
  };

  toggleCollapse = () => {
    const els = this.dom.querySelectorAll('.to-show');

    if(!this.state.collapsed){
      this.setState({showOnOpen: false})
      TweenMax.to(els, 0.1, {opacity: 0, y: -5})
      TweenMax.to(els, 0, {display: 'none', delay: 0.1});
      setTimeout(() => {
        this.setState({collapsed: !this.state.collapsed})
      }, 150);
    }else{
      this.setState({collapsed: !this.state.collapsed})
      setTimeout(() => {
        this.setState({showOnOpen: true})
        TweenMax.to(els, 0, {display: 'block'})
        TweenMax.to(els, 0.2, {opacity: 1, y: 0});
      }, 200);
    }
  }

  componentDidMount = () => {
    console.log(this.state.collapsed);
    
  }

  render() {
    return ( 
      <header ref={el => this.dom = el} className={ this.state.collapsed ? 'sidebar' : 'sidebar opened' }>
        <div className='sidebar-profile'>
          <div className='sidebar-pp' style={{backgroundImage: `url(https://pbs.twimg.com/profile_images/758149842384322560/FJVKspY_.jpg)`}}></div>
          <div className='sidebar-profile-infos to-show'>
            <div>Jérémy Le Manach</div>
            <a href='#'>Voir mon profil</a>
          </div>
        </div>

        <div className='sidebar-reputation'>
          <span className='to-show'>Réputation</span>
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
                <span className='to-show'>Guide</span>
              </Link>
              <div className='sidebar-nav-item-guide to-show'>
                <span className='line'>
                  <span>Modifier votre profil</span>
                </span>
                <span className='line'>
                  <span>Vérifier votre email</span>
                  <div>
                    <span className='rep'>15</span>
                  </div>
                </span>
                <span className='line'>
                  <span>Sourcer une citation</span>
                </span>
                <a href="#" className='link'>Voir tout</a>
              </div>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new'} onlyActiveOnIndex activeClassName="active">
                <Icon name='videos'/>
                <span className='to-show'>Vidéos</span>
              </Link>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new/limitations'} activeClassName="active">
                <Icon name='limitations'/>  
                <span className='to-show'>Limitations</span>
              </Link>
              <div className='sidebar-nav-item-guide limitations to-show'>
                <span className='line'>
                  <span>Commenter</span>
                  <div>
                    <span className='limit'>10/12</span>
                  </div>
                </span>
                <span className='line'>
                  <span>Confirmation une citation</span>
                  <div>
                    <span className='limit'>2/5</span>
                  </div>
                </span>
                <a href="#" className='link'>Voir toutes</a>
              </div>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new/help'} activeClassName="active">
                <Icon name='help'/>
                <span className='to-show'>Aide</span>
              </Link>
            </li>
            <li className='sidebar-nav-item'>
              <Link to={'/new/settings'} activeClassName="active">
                <Icon name='settings'/>
                <span className='to-show'>Paramètres</span>
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