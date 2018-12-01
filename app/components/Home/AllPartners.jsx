import React from 'react'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

import imgImago from '../../assets/partners/imago.jpg'
import imgDemocratieOuverte from '../../assets/partners/democratie-ouverte.jpg'
import imgHeureka from '../../assets/partners/heureka.jpg'
import imgSystemeD from '../../assets/partners/systemed.jpg'
import imgTedxNoumea from '../../assets/partners/tedxnoumea.jpg'
import imgThinkerView from '../../assets/partners/thinkerview.jpg'
import imgTroncheEnBiais from '../../assets/partners/troncheenbiais.jpg'
import imgYesWeHack from '../../assets/partners/yeswehack.jpg'

// prettier-ignore
const PARTNERS = [
  { name: 'ThinkerView', img: imgThinkerView, url: 'https://thinkerview.com' },
  { name: 'Heu?reka', img: imgHeureka, url: 'https://www.youtube.com/channel/UC7sXGI8p8PvKosLWagkK9wQ' },
  { name: 'La Tronche en Biais', img: imgTroncheEnBiais, url: 'https://www.youtube.com/user/TroncheEnBiais' },
  { name: 'Système D', img: imgSystemeD, url: 'https://www.systeme-d.co/' },
  { name: 'Démocratie Ouverte', img: imgDemocratieOuverte, url: 'https://democratieouverte.org' },
  { name: 'IMAGO', img: imgImago, url: 'https://imagotv.fr' },
  { name: 'TedX Nouméa', img: imgTedxNoumea, url: 'https://tedxnoumea.com' },
  { name: 'YesWeHack', img: imgYesWeHack, url: 'https://yeswehack.com' },
]

const AllPartners = () => (
  <div className="columns is-multiline is-mobile">
    {PARTNERS.map(partner => (
      <ExternalLinkNewTab className="column is-2" key={partner.name} href={partner.url}>
        <figure className="image is-96x96">
          <img src={partner.img} alt={partner.name} />
        </figure>
      </ExternalLinkNewTab>
    ))}
  </div>
)

export default AllPartners
