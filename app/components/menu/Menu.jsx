import React from 'react'
import { Link } from 'react-router'
import ClassicButton from '../buttons/ClassicButton'
import SelectButton from '../buttons/SelectButton'
import CaptainfactLogo from '../../assets/logo.svg'
import ExitIcon from '../../assets/ic-exit.svg'
import DiscordIcon from '../../assets/ic-discord.svg'
import FlagFrIcon from '../../assets/ic-flag-fr.svg'
import i18n from "../../i18n/i18n";
import LanguageSelector from "../App/LanguageSelector";

const Menu = () => (
  <nav className="menu flex flex-between">
    <Link to="/" className="logo-link">
      <h1 className="flex">
        <img className="logo" src={CaptainfactLogo}/>
        <p>Captain<span>Fact</span></p>
      </h1>
    </Link>
    <ul className="flex flex-between">
      <li className="flex flex-center ft-16"><p>Guillaume<span className="score">15</span></p></li>
      <li className="flex flex-center"><ClassicButton link="/activity" text="Mon activité"/></li>
      <li className="flex flex-center post-separator"><ClassicButton link="/settings" text="Paramètres"/></li>
      <li className="flex flex-center post-separator">
        <LanguageSelector
          handleChange={v => i18n.changeLanguage(v)}
          value={i18n.language}
        />
      </li>
      <li className="flex flex-center"><ClassicButton link="/videos" text="Vidéos"/></li>
      <li className="flex flex-center"><ClassicButton href="https://discord.gg/2Qd7hMz" text="Rejoignez le Discord" icon={DiscordIcon}/></li>
      <li className="flex flex-center"><ClassicButton link="/videos" icon={ExitIcon}/></li>
    </ul>
  </nav>
)

export default Menu