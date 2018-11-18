import React from 'react';
import { Link } from 'react-router';

import IconLink from './IconLink';
import Logo from '../App/Logo';

import Heart from '../../assets/heart.svg';
import Puzzle from '../../assets/puzzle.svg';
import Question from '../../assets/question.svg';
import Screen from '../../assets/screen.svg';
import User from '../../assets/user.svg';
import UserWhite from '../../assets/user-white.svg';

const Nav = () => {

  const openDropdownUser = e => {
    e.currentTarget.focus();
  };

  return (
    <nav id="Nav">
      <Link to="/all">
        <Logo borderless />
      </Link>
      <div className="navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <IconLink navlink
                      className='nav-link'
                      href='/videos'
                      propsAnchor={{
                        'title': 'Vidéos'
                      }}
                      propsImg={{
                        'className': 'logo-svg-30',
                        'src': Screen,
                        'alt': 'Vidéos'
                      }}
            />
          </li>
          <li className="nav-item dropdown">
            <IconLink
              handleOnClick={ openDropdownUser }
              className="nav-link dropdown-toggle"
              href="javascript:void(0);"
              propsAnchor={{
                'id': 'loginDropdown',
                'role': 'button',
                'data-toggle': 'dropdown',
                'aria-haspopup': 'true',
                'aria-expanded': 'false'
              }}
              propsImg={{
                'className': 'logo-svg-30',
                'src': User,
                'alt': 'User'
              }}
            />
            <div className="dropdown-menu" aria-labelledby="loginDropdown">
              <div className="dropdown-wrapper-menu">
                <div className="dropdown-title">
                  <img className="logo-svg-50" src={ UserWhite } alt="User" />
                  <p>Session Visiteur</p>
                </div>
                <IconLink navlink
                          text="S'inscrire"
                          className="dropdown-item"
                          href="javascript:void(0);"
                          propsImg={{
                            'className': 'logo-svg-30',
                            'src': User,
                            'alt': 'User'
                          }}
                />
                <div className="dropdown-divider"></div>
                <IconLink navlink
                          text="Aide"
                          className="dropdown-item"
                          href="/help"
                          propsImg={{
                            'className': 'logo-svg-30',
                            'src': Question,
                            'alt': 'Help'
                          }}
                />
                <IconLink
                  text="Nous supporter"
                  className="dropdown-item"
                  href="https://opencollective.com/captainfact_io"
                  propsAnchor={{
                    'target': '_blank',
                    'rel': 'noreferrer noopener'
                  }}
                  propsImg={{
                    'className': 'logo-svg-30',
                    'src': Heart,
                    'alt': 'Support us'
                  }}
                />
                <IconLink navlink
                          text="Extension pour navigateur +"
                          className="dropdown-item"
                          href="/help"
                          propsImg={{
                            'className': 'logo-svg-30',
                            'src': Puzzle,
                            'alt': 'Extension'
                          }}
                />
                <a href="#" className="dropdown-item btn btn-primary">Se connecter</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;