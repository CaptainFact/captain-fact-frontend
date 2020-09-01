import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'
import { Flex } from '@rebass/grid'

import imgBasile from '../../assets/ambassadors/basile.jpg'
import imgDorian from '../../assets/ambassadors/dorian.jpg'
import imgFrederic from '../../assets/ambassadors/frederic.jpg'
import imgThimothee from '../../assets/ambassadors/timothee.jpg'

const AMBASSADORS = [
  { name: 'Frédéric Bouffetier', username: 'DocFred', img: imgFrederic },
  { name: 'Timothée Rolland', username: 'Troplent', img: imgThimothee },
  { name: 'Dorian Cazottes', username: 'DodoLaSoudure', img: imgDorian },
  { name: 'Basile Asti', username: 'Basile', img: imgBasile },
]

const AmbassadorPicture = styled.img`
  border-radius: 1em;
  margin: 0 1em;
  height: 70px;
`

/**
 * Render all CaptainFact ambassadors
 */
const AllAmbassadors = () => (
  <Flex flexWrap="wrap" justifyContent={['center', 'left']}>
    {AMBASSADORS.map(({ name, username, img }) => (
      <Link to={`/u/${username}`} key={name}>
        <AmbassadorPicture title={name} src={img} alt={name} />
      </Link>
    ))}
  </Flex>
)

export default AllAmbassadors
