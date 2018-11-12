import React, { PureComponent } from 'react';

import Logo from '../App/Logo';

import Man from '../../assets/man.svg'

const Nav = () => (
  <nav id="Nav">
    <Logo borderless />
    <div className="navbar-collapse">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#">Vidéos</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="loginDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div className="wrapper-man-svg">
              <img className="man-svg" src={ Man } alt="User"/>
            </div>
          </a>
          <div className="dropdown-menu" aria-labelledby="loginDropdown">
            <div className="dropdown-title">
              <p>Session Visiteur</p>
            </div>
            <a className="dropdown-item" href="#">{ 'S\'inscrire' }</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Aide</a>
            <a className="dropdown-item" href="#">Nous supporter</a>
            <a className="dropdown-item" href="#">Extension pour navigateur +</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
);

export default Nav;