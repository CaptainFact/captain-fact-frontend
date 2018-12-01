import React from 'react'

import imgBasile from '../../assets/ambassadors/basile.jpg'
import imgDorian from '../../assets/ambassadors/dorian.jpg'
import imgFrederic from '../../assets/ambassadors/frederic.jpg'
import imgThimothee from '../../assets/ambassadors/timothee.jpg'

const AMBASSADORS = [
  { name: 'Frédéric Bouffetier', img: imgFrederic },
  { name: 'Timothée Rolland', img: imgThimothee },
  { name: 'Dorian Cazottes', img: imgDorian },
  { name: 'Basile Asti', img: imgBasile }
]

const AllAmbassadors = () => (
  <div className="columns is-multiline is-mobile ambassadors">
    {AMBASSADORS.map(ambassador => (
      <div className="column is-2" key={ambassador.name}>
        <figure className="image is-64x64" title={ambassador.name}>
          <img src={ambassador.img} alt={ambassador.name} />
        </figure>
      </div>
    ))}
  </div>
)

export default AllAmbassadors
