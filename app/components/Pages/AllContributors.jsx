import React from 'react'


const CONTRIBUTORS = [
  {role: "Ambassadeur", name: "Frédéric Bouffetier", picture: "frederic.jpg"},
  {role: "Ambassadeur", name: "Timothée Roland", picture: "timothee.jpg"},
  {role: "Ambassadeur Padawan", name: "Dorian Cazottes"},
  {role: 'Donateur', name: 'Thibaut Ladouce'},
  {role: 'Donateur', name: 'Julien Edmond'},
  {role: 'Donateur', name: 'Open Collective Paris ', picture: 'oc_paris.jpg'},
  {role: 'Donateur', name: 'Jérôme Bétrancourt'},
  {role: 'Donateur', name: 'Spiderweak', picture: 'spiderweak.jpg'},
  {role: 'Donateur', name: 'Coline Piouffle'},
  {role: 'Donateur', name: 'Basile Asti'},
  {role: 'Donateur', name: 'Alexandre Mira'},
  {role: 'Donateur', name: 'Adrien Albertini'},
  {role: 'Donateur', name: 'Loic Journet'},
  {role: 'Donateur', name: 'William Amsler'},
  {role: 'Donateur', name: 'Francois  Zedde'},
  {role: 'Donateur', name: 'William Rode'},
  {role: 'Donateur', name: 'Hélène Bouffetier'},
  {role: 'Donateur', name: 'Jean-Louis PIOCH'},
  {role: 'Donateur', name: 'Nicolas Jeannesson'}
]

const AllContributors  = () => (
  <div className="columns">
    {CONTRIBUTORS.map(contributor => (
      <div className="column is-3 card" key={contributor.name}>
        <div className="card-image">
          <figure className="image is-96x96">
            <img src={contributorPicture(contributor)} alt=""/>
          </figure>
        </div>
        <div className="card-content">
          <p className="title is-4">{contributor.name}</p>
          <p className="subtitle is-6">{contributor.role}</p>
        </div>
      </div>
    ))}
  </div>
)

function contributorPicture({picture}) {
  return picture
    ? `/assets/img/contributors/${picture}`
    : '/assets/img/contributors/no-picture.svg'
}

export default AllContributors
