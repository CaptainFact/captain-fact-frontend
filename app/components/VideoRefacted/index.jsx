import React, { PureComponent } from 'react';
import ReactPlayer from 'react-player';

import Block from './Block';
import IconLink from './IconLink';
import Nav from './Nav';
import Quotes from './Quotes';
import Speakers from './Speakers';
import Timeline from './Timeline';

import QuoteRight from '../../assets/quote-right.svg';
import QuoteRightWhite from '../../assets/quote-right-white.svg';
import User from '../../assets/user.svg';
import UserWhite from '../../assets/user-white.svg';

// ***************************** FAKE DATA ***************************** //

import Coin from '../../assets/coin.svg';
import Crown from '../../assets/crown.svg';
import Scared from '../../assets/scared.svg';
import Tree from '../../assets/tree.svg';

import TancredeRamonet from '../../assets/speakers/tancrede-ramonet.jpg';
import ThinkerView from '../../assets/speakers/thinkerview.jpg';

const data = {
  url: 'https://www.youtube.com/watch?v=E7vscTxD308',
  facts: [
    {
      icon: Crown
    }, {
      icon: Scared
    }, {
      icon: Coin
    }, {
      icon: Tree
    }
  ],
  speakers: [
    {
      img: TancredeRamonet,
      link: '/s/Tancrede-Ramonet',
      name: 'Tancrède Ramonet',
      type: 'Documentariste'
    }, {
      img: ThinkerView,
      link: '/s/Thinkerview',
      name: 'Thinkerview',
      type: 'Chaîne Youtube'
    }
  ]
};

// ********************************************************************* //

const PLAYER_CONFIG = { youtube: { playerVars: { showinfo: 1 } } };
const setConnected = () => {
  const stateConnected = localStorage.getItem('connected') || false;

  if (typeof stateConnected !== 'string' || ['false', 'true'].indexOf(stateConnected) < 0) {
    localStorage.setItem('connected', 'false');
  }
};

class VideoRefacted extends PureComponent {
  constructor(props) {
    super(props);
    setConnected();

    this.state = {
      tabActive: 'speakers'
    };

    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(value) {
    this.setState({ tabActive: value });
  }

  render() {
    const tabActive = this.state.tabActive;

    return (
      <div id="VideoRefacted">
        <Nav />
        <div className="content-container">
          <div className="main-container">
            <Block className="col-12 sub-container p-0">
              <div className="wrapper-video m-auto">
                <ReactPlayer
                  className="video"
                  controls
                  height={ '100%' }
                  width={ '100%' }
                  url={ data.url }
                  config={ PLAYER_CONFIG }
                />
              </div>
            </Block>

            <Block className="col-12 sub-container">
              <Timeline facts={ data.facts } />
            </Block>

            <Block className="col-12 sub-container o-hidden">
              <div className="wrapper-tabs mb-5">
                <ul className="ml-auto tabs">
                  <li className="mr-2 tab" onClick={ () => this.switchTab('speakers') }>
                    <IconLink navlink
                              text="Intervenants"
                              className={ tabActive === 'speakers' ? 'active' : '' }
                              href='javascript:void(0);'
                              propsAnchor={{
                                'title': 'Intervenants'
                              }}
                              propsImg={{
                                'className': 'logo-svg-20',
                                'src': tabActive === 'speakers' ? UserWhite : User,
                                'alt': ''
                              }}
                    />
                  </li>
                  <li className="ml-2 tab" onClick={ () => this.switchTab('quotes') }>
                    <IconLink navlink
                              text="Citations"
                              className={ tabActive === 'quotes' ? 'active' : '' }
                              href='javascript:void(0);'
                              propsAnchor={{
                                'title': 'Citations'
                              }}
                              propsImg={{
                                'className': 'logo-svg-20',
                                'src': tabActive === 'quotes' ? QuoteRightWhite : QuoteRight,
                                'alt': ''
                              }}
                    />
                  </li>
                </ul>
              </div>

              { tabActive === 'speakers' ? <Speakers speakers={ data.speakers } /> : <Quotes /> }

            </Block>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoRefacted;