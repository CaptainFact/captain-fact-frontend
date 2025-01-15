import React from 'react'

import imgDemocratieOuverte from '../../assets/partners/democratie-ouverte.jpg'
import imgHeureka from '../../assets/partners/heureka.jpg'
import imgImago from '../../assets/partners/imago.jpg'
import imgLarchipelle from '../../assets/partners/larchipelle.jpg'
import imgLeCanardRefractaire from '../../assets/partners/lecanardrefractaire.jpg'
import imgSystemeD from '../../assets/partners/systemed.jpg'
import imgTedxNoumea from '../../assets/partners/tedxnoumea.jpg'
import imgThinkerView from '../../assets/partners/thinkerview.jpg'
import imgTroncheEnBiais from '../../assets/partners/troncheenbiais.jpg'
import imgYesWeHack from '../../assets/partners/yeswehack.jpg'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

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
  { name: 'Le Canard Réfractaire', img: imgLeCanardRefractaire, url: 'https://www.youtube.com/user/lostgame35/' },
  { name: 'L\'Archi\'Pelle', img: imgLarchipelle, url: 'https://www.youtube.com/channel/UCOc43VE8KbZbwMX7fikucyw/featured' },
]

/**
 * Render all CaptainFact partners
 */
const AllPartners = () => (
  <div className="flex flex-wrap items-center justify-around">
    {PARTNERS.map(({ name, url, img }) => (
      <div key={name} className="mb-4">
        <ExternalLinkNewTab href={url} title={name}>
          <figure className="image is-96x96">
            <img src={img} alt={name} />
          </figure>
        </ExternalLinkNewTab>
      </div>
    ))}
  </div>
)

// ts-unused-exports:disable-next-line
export default AllPartners
