import React from 'react'
import {translate} from 'react-i18next'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'


const ROLE_AMBASSADOR = 'ambassador'
const ROLE_AMBASSADOR_PADAWAN = 'ambassadorPadawan'
const ROLE_DEVELOPER = 'developer'
const ROLE_DONATOR = 'donator'
const ROLE_PARTNER = 'partner'

const CONTRIBUTORS = [
  {role: ROLE_AMBASSADOR, name: 'Frédéric Bouffetier', picture: 'frederic'},
  {role: ROLE_AMBASSADOR, name: 'Timothée Roland', picture: 'timothee'},
  {role: ROLE_AMBASSADOR_PADAWAN, name: 'Dorian Cazottes', picture: 'dorian'},
  {role: ROLE_PARTNER, name: 'ThinkerView', picture: 'thinkerview', url: 'https://thinkerview.com'},
  {role: ROLE_PARTNER, name: 'Heu?reka', picture: 'heureka', url: 'https://www.youtube.com/channel/UC7sXGI8p8PvKosLWagkK9wQ'},
  {role: ROLE_PARTNER, name: 'La Tronche en Biais', picture: 'troncheenbiais', url: 'https://www.youtube.com/user/TroncheEnBiais'},
  {role: ROLE_PARTNER, name: 'IMAGO', picture: 'imago', url: 'http://imagotv.fr/pdf/imago_presentation.pdf'},
  {role: ROLE_PARTNER, name: 'TedX Nouméa', picture: 'tedxnoumea', url: 'https://tedxnoumea.com'},
  {role: ROLE_PARTNER, name: 'Maia Mater', picture: 'maiamater', url: 'https://www.maiamater.camp'},
  {role: ROLE_DEVELOPER, name: 'Noé Gambini', picture: 'noe'},
  {role: ROLE_DONATOR, name: 'Julien Edmond', picture: 'julien'},
  {role: ROLE_DONATOR, name: 'Basile Asti', picture: 'basile'},
  {role: ROLE_DONATOR, name: 'William Amsler', picture: 'william'},
  {role: ROLE_DONATOR, name: 'William Ledoux', picture: 'williamledoux'},
  {role: ROLE_DONATOR, name: 'Adrien Albertini', picture: 'adrien'},
  {role: ROLE_DONATOR, name: 'Coline Piouffle', i18nContext: 'female', picture: 'coline'},
  {role: ROLE_DONATOR, name: 'Spiderweak', picture: 'spiderweak'},
  {role: ROLE_DONATOR, name: 'Hélène Bouffetier', i18nContext: 'female'},
  {role: ROLE_DONATOR, name: 'Jérôme Bétrancourt'},
  {role: ROLE_DONATOR, name: 'Thibaut Ladouce'},
  {role: ROLE_DONATOR, name: 'Alexandre Mira'},
  {role: ROLE_DONATOR, name: 'Loic Journet'},
  {role: ROLE_DONATOR, name: 'Francois  Zedde'},
  {role: ROLE_DONATOR, name: 'William Rode'},
  {role: ROLE_DONATOR, name: 'Alain Mouchez'},
  {role: ROLE_DONATOR, name: 'Samuel Pabion'},
  {role: ROLE_DONATOR, name: 'Driss Boubekeur'},
  {role: ROLE_DONATOR, name: 'Nicolas Jeannesson'},
  {role: ROLE_DONATOR, name: 'Jean-Louis Pioch'},
]

const AllContributors  = ({t}) => (
  <div className="columns">
    {CONTRIBUTORS.map(contributor => (
      <div className="column is-3 card" key={contributor.name}>
        <div className="card-image">
          <figure className="image is-96x96">
            {contributorPicture(contributor)}
          </figure>
        </div>
        <div className="card-content">
          <p className="title is-4">
            {contributorName(contributor)}
          </p>
          <p className="subtitle is-6">
            {t(`roles.${contributor.role}`, {context: contributor.i18nContext})}
          </p>
        </div>
      </div>
    ))}
  </div>
)

function contributorName({url, name}) {
  return url
    ? <ExternalLinkNewTab href={url}>{name}</ExternalLinkNewTab>
    : name
}

function contributorPicture({picture}) {
  return picture
    ? <img src={`/assets/img/contributors/${picture}.jpg`} alt=""/>
    : <img src="/assets/img/contributors/no-picture.svg" className="no-picture" alt=""/>
}

export default translate('home')(AllContributors)
