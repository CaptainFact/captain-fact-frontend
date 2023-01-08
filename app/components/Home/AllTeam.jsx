import { Box, Flex } from '@rebass/grid'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { fontWeight } from 'styled-system'

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

const TeamPicture = styled.img`
  border-radius: 4em;
  margin: 0 1em;
  height: 100px;
`

const TeamTextBox = styled(Box)`
  color: #0a0a0a;
  text-align: center;
  line-height: 1;
  ${fontWeight}
`

const TeamText = styled.span`
  display: block;
`

/**
 * Render all CaptainFact team
 */
const AllTeam = ({ t }) => {
  return (
    <Flex flexWrap="wrap" justifyContent={['center', 'left']}>
      {TEAM.map(({ firstName, lastName, title1, title2, username, img }) => (
        <Box key={firstName} mx={2}>
          <Flex flexDirection="column">
            <Link to={`/u/${username}`}>
              <TeamPicture
                title={`${firstName} ${lastName}`}
                src={img}
                alt={`${firstName} ${lastName}`}
              />
              <TeamTextBox mt={3} mb={2} fontWeight="bold">
                <TeamText>{firstName}</TeamText>
                <TeamText>{lastName}</TeamText>
              </TeamTextBox>
              <TeamTextBox mb={4}>
                <TeamText>{t(`${title1}`)}</TeamText>
                <TeamText>{t(`${title2}`)}</TeamText>
              </TeamTextBox>
            </Link>
          </Flex>
        </Box>
      ))}
    </Flex>
  )
}

export default withNamespaces('home')(AllTeam)
