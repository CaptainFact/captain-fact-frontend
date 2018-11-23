import React, { PureComponent } from 'react';
import ReactPlayer from 'react-player';

import Block from './Block';
import IconLink from './IconLink';
import Nav from './Nav';
import Quotes from './Quotes';
import Speakers from './Speakers';
import Timeline from './Timeline';

import QuoteRightBlack from '../../assets/quote-right-black.svg';
import QuoteRightWhite from '../../assets/quote-right-white.svg';
import UserBlack from '../../assets/user-black.svg';
import UserWhite from '../../assets/user-white.svg';

// ***************************** FAKE DATA ***************************** //

import Coin from '../../assets/coin.svg';
import Crown from '../../assets/crown.svg';
import QuoteRight from '../../assets/quote-right.svg';
import Scared from '../../assets/scared.svg';

import TancredeRamonet from '../../assets/speakers/tancrede-ramonet.jpg';
import ThinkerView from '../../assets/speakers/thinkerview.jpg';

const data = {
  url: 'https://www.youtube.com/watch?v=E7vscTxD308',
  facts: [
    {
      icon: QuoteRight,
      quote: 'Je suis producteur, réalisateur',
      time: 31
    }, {
      icon: QuoteRight,
      quote: '[Je suis...] aussi musicien, j\'ai un groupe de rock-electro, qui s\'appelle \'Achab\'',
      time: 33
    }, {
      icon: QuoteRight,
      quote: 'Ignacio Ramonet, mon père, a dirigé Le Monde Diplomatique...',
      time: 55
    }, {
      icon: QuoteRight,
      quote: '... [le Monde Diplomatique] a été créé par Hubert Beuve-Méry',
      time: 61
    }, {
      icon: QuoteRight,
      quote: 'J\'ai [aussi] fait un documentaire, avec mon frère sur les abattoirs de porcs [...], il s\'appelle \'Marche funèbre\'',
      time: 104
    }, {
      icon: QuoteRight,
      quote: 'Il y a un jeux de mot sur votre groupe : entre Achab de Moby Dick et [...] A.C.A.B de "All Cops Are Bastards". [...]',
      time: 330
    }, {
      icon: QuoteRight,
      quote: 'La police a un rôle, une fonction, qui dépasse [...] les individus [...]. [Elle a] une fonction de maintien de un ordre établi, qui est l\'ordre bourgeois',
      time: 370
    }, {
      icon: QuoteRight,
      quote: 'La police [...] s\'oppose à la justice sociale et aide à imposer toutes les formes de domination',
      time: 393
    }, {
      icon: QuoteRight,
      quote: 'La justice sociale c\'est non seulement l\'égalité en droit mais, sans doute, une forme d\'égalité en fait.',
      time: 423
    }, {
      icon: QuoteRight,
      quote: 'Pour Gaetano Manfredonia, Anarchie et anarchisme [c\'est la même chose] sont une seule et même chose.',
      time: 685
    }, {
      icon: QuoteRight,
      quote: 'A la fin du 19ème, début de 20ème siècle, on a un anarchisme, un mouvement anarchiste qui est très fort, qui s\'est exprimé à travers la propagande par le fait, en développant à l’échelle mondiale la stratégie de l\' attentat.',
      time: 758
    }, {
      icon: QuoteRight,
      quote: '[On a ...] Une partie des anarchistes [qui] se rallie à l\' union sacrée [et donc, sont favorables à la guerre contre l\'Allemagne.]',
      time: 875
    }, {
      icon: QuoteRight,
      quote: 'Kropotkine appelle à la guerre contre l\'Allemagne',
      time: 882
    }, {
      icon: QuoteRight,
      quote: 'Daniel Guérin, qui était un trotskiste, qui va mâtiner son marxisme de pensée anarchiste, et inventer [un peu] le concept de marxisme libertaire',
      time: 1013
    }, {
      icon: QuoteRight,
      quote: 'Il y a [aussi] une présence [très forte] de références libertaires chez les situationnistes',
      time: 1023
    }, {
      icon: QuoteRight,
      quote: '[Guy] Debord mentionne, dans la carte "géographique" de ses auteurs préférés, Bakounine',
      time: 1036
    }, {
      icon: QuoteRight,
      quote: 'L\'amphi de la Sorbone, s\'appelle l\'amphi "Bonnot"',
      time: 1053
    }, {
      icon: QuoteRight,
      quote: '[L\'auteur] Jean-Christophe Rufin [...] raconte dans son autobiographie, que en 1968, il est allé chercher dans les sous-sols de l\'école de médecine le cerveau de Ravachol, et a été le mettre au Panthéon',
      time: 1067
    }, {
      icon: QuoteRight,
      quote: 'Il y a en [19]68 un film sur Bonnot dans lequel joue Jacques Brel',
      time: 1112
    }, {
      icon: QuoteRight,
      quote: '[En 1968] Joe Dassin fait une chanson sur Bonnot',
      time: 1118
    }, {
      icon: QuoteRight,
      quote: '[Tout le monde dans les années [19]70 se dit anarchiste] [Jean-Paul] Sartre dans une interview au Nouvel Obs [je crois en 1974] dit : "Si on relis toute mon œuvre, j\'ai toujours été anarchiste"',
      time: 1124
    }, {
      icon: QuoteRight,
      quote: 'Jean-Marie Le Pen [autour des années 1970] [...] fait son mémoire sur le courant anarchiste en France de 1945 à nos jours.',
      time: 1143
    }, {
      icon: QuoteRight,
      quote: 'Les lois scélérates sont des lois qui sont votées [...] dans le courant des années 1880, ou 1890, contre le \'péril\' anarchiste.',
      time: 1414
    }, {
      icon: QuoteRight,
      quote: '[...] Dans les années [19]80-90, on \'devait\' dire si était anarchiste ou communiste quand on entrait aux États-Unis [d\'Amérique] ; si on avait été membre d\'une organisation anarchiste ou communiste.',
      time: 1507
    }, {
      icon: QuoteRight,
      quote: 'Le carnet B c\'est [...] l\'ancêtre du fichier S [...]',
      time: 1717
    }, {
      icon: Crown,
      quote: 'C\'est pas Lucky Luke, il y a pas Grand Chef indien avec ses plûmes qui décide qu\'on parte sur le sentier de la guerre',
      time: 2992
    }, {
      icon: Coin,
      quote: 'La propriété c\'est le vol',
      time: 4436
    }, {
      icon: Scared,
      quote: 'Il y avait 14 000 personnes dans le cortège de tête',
      time: 5358
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
      duration: 0,
      playing: false,
      position: 0,
      tabActive: 'speakers'
    };

    this.setDuration = this.setDuration.bind(this);
    this.setPlaying = this.setPlaying.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.setTab = this.setTab.bind(this);
  }

  setDuration(duration) {
    this.setState({ duration: duration });
  }

  setPlaying(state) {
    this.setState({ playing: state });
  }

  setPosition(seconds) {
    this.setState({ position: seconds });
  }

  setTab(value) {
    this.setState({ tabActive: value });
  }

  render() {
    const state = this.state;

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
                  onPlay={() => this.setPlaying(true) }
                  onPause={() => this.setPlaying(false) }
                  onProgress={({ playedSeconds }) => this.setPosition(playedSeconds) }
                  onReady={ (obj) => this.setDuration(obj.getDuration()) }
                  onStart={ () => {
                    this.setPlaying(true);
                    this.setTab('quotes');
                  } }
                />
              </div>
            </Block>

            <Block className="col-12 sub-container">
              <Timeline facts={ data.facts } currentTime={ state.position } totalTime={ state.duration } />
            </Block>

            <Block className="col-12 sub-container o-hidden quotes-scroll-auto">
              <div className="wrapper-tabs mb-5">
                <ul className="ml-auto tabs">
                  <li className="mr-2 tab" onClick={ () => this.setTab('speakers') }>
                    <IconLink navlink
                              text="Intervenants"
                              className={ state.tabActive === 'speakers' ? 'active' : '' }
                              href='javascript:void(0);'
                              propsAnchor={{
                                'title': 'Intervenants'
                              }}
                              propsImg={{
                                'className': 'logo-svg-20',
                                'src': state.tabActive === 'speakers' ? UserWhite : UserBlack,
                                'alt': ''
                              }}
                    />
                  </li>
                  <li className="ml-2 tab" onClick={ () => this.setTab('quotes') }>
                    <IconLink navlink
                              text="Citations"
                              className={ state.tabActive === 'quotes' ? 'active' : '' }
                              href='javascript:void(0);'
                              propsAnchor={{
                                'title': 'Citations'
                              }}
                              propsImg={{
                                'className': 'logo-svg-20',
                                'src': state.tabActive === 'quotes' ? QuoteRightWhite : QuoteRightBlack,
                                'alt': ''
                              }}
                    />
                  </li>
                </ul>
              </div>

              { state.tabActive === 'speakers' ? <Speakers speakers={ data.speakers } /> : <Quotes quotes={ data.facts } /> }

            </Block>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoRefacted;