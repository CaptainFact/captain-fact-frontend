import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { userProfileURL } from '@/lib/cf_routes'

import imgBasile from '../../assets/team/basile.jpg'
import imgBenjamin from '../../assets/team/benjamin.png'
import imgFlorence from '../../assets/team/florence.jpg'
import imgFrederic from '../../assets/team/frederic.jpg'
import imgMathieu from '../../assets/team/mathieu.jpg'

const TEAM = [
  {
    firstName: 'Benjamin',
    lastName: 'Piouffle',
    username: 'Betree',
    img: imgBenjamin,
    title1: 'benjaminPiouffleTitle1',
    title2: 'benjaminPiouffleTitle2',
  },
  {
    firstName: 'Florence',
    lastName: 'Chatelot',
    username: 'Miragide',
    img: imgFlorence,
    title1: 'florenceChatelotTitle1',
    title2: 'florenceChatelotTitle2',
  },
  {
    firstName: 'Frédéric',
    lastName: 'Bouffetier',
    username: 'DocFred',
    img: imgFrederic,
    title1: 'fredericBouffetierTitle1',
    title2: 'fredericBouffetierTitle2',
  },
  {
    firstName: 'Basile',
    lastName: 'Asti',
    username: 'Basile',
    img: imgBasile,
    title1: 'teamAmbassadorTitle',
    title2: 'teamBODtitle',
  },
  {
    firstName: 'Mathieu',
    lastName: 'Cerf',
    username: 'Nevjoia',
    img: imgMathieu,
    title1: 'teamAmbassadorTitle',
    title2: 'teamBODtitle',
  },
]

/**
 * Render all CaptainFact team
 */
const AllTeam = ({ t }) => {
  return (
    <div className="flex flex-wrap justify-center sm:justify-left">
      {TEAM.map(({ firstName, lastName, title1, title2, username, img }) => (
        <div key={firstName} className="mx-2">
          <div className="flex flex-col">
            <Link to={userProfileURL({ username })}>
              <img
                className="rounded-[4em] my-0 mx-4 h-[100px]"
                title={`${firstName} ${lastName}`}
                src={img}
                alt={`${firstName} ${lastName}`}
              />
              <div className="text-[#0a0a0a] text-center leading-none mt-3 mb-2 font-bold">
                <span className="block">{firstName}</span>
                <span className="block">{lastName}</span>
              </div>
              <div className="text-[#0a0a0a] text-center leading-none mb-4">
                <span className="block">{t(`${title1}`)}</span>
                <span className="block">{t(`${title2}`)}</span>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

// ts-unused-exports:disable-next-line
export default withTranslation('home')(AllTeam)
