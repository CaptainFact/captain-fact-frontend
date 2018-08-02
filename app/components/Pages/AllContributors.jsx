import React from 'react'
import {translate} from 'react-i18next'


const ROLE_AMBASSADOR = 'ambassador'
const ROLE_AMBASSADOR_PADAWAN = 'ambassadorPadawan'
const ROLE_DEVELOPER = 'developer'
const ROLE_DONATOR = 'donator'

const CONTRIBUTORS = [
  {role: ROLE_AMBASSADOR, name: 'Frédéric Bouffetier', picture: 'frederic.jpg'},
  {role: ROLE_AMBASSADOR, name: 'Timothée Roland', picture: 'timothee.jpg'},
  {role: ROLE_AMBASSADOR_PADAWAN, name: 'Dorian Cazottes'},
  {role: ROLE_DEVELOPER, name: 'Noé Gambini'},
  {role: ROLE_DONATOR, name: 'Thibaut Ladouce'},
  {role: ROLE_DONATOR, name: 'Julien Edmond'},
  {role: ROLE_DONATOR, name: 'Jérôme Bétrancourt'},
  {role: ROLE_DONATOR, name: 'Spiderweak', picture: 'spiderweak.jpg'},
  {role: ROLE_DONATOR, name: 'Coline Piouffle', i18nContext: 'female', picture: 'coline.jpg'},
  {role: ROLE_DONATOR, name: 'Basile Asti', picture: 'basile.jpg'},
  {role: ROLE_DONATOR, name: 'Alexandre Mira'},
  {role: ROLE_DONATOR, name: 'Adrien Albertini'},
  {role: ROLE_DONATOR, name: 'Loic Journet'},
  {role: ROLE_DONATOR, name: 'William Amsler', picture: 'william.jpg'},
  {role: ROLE_DONATOR, name: 'Francois  Zedde'},
  {role: ROLE_DONATOR, name: 'William Rode'},
  {role: ROLE_DONATOR, name: 'Hélène Bouffetier', i18nContext: 'female'},
  {role: ROLE_DONATOR, name: 'Jean-Louis PIOCH'},
  {role: ROLE_DONATOR, name: 'Nicolas Jeannesson'}
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
          <p className="title is-4">{contributor.name}</p>
          <p className="subtitle is-6">
            {t(`roles.${contributor.role}`, {context: contributor.i18nContext})}
          </p>
        </div>
      </div>
    ))}
  </div>
)

function contributorPicture({picture}) {
  return picture
    ? <img src={`/assets/img/contributors/${picture}`} alt=""/>
    : <img src="/assets/img/contributors/no-picture.svg" className="no-picture" alt=""/>
}

export default translate('home')(AllContributors)
