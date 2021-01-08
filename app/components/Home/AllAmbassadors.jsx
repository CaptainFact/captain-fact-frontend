import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { withNamespaces } from 'react-i18next'
import { fontWeight } from 'styled-system'
import imgBenjamin from '../../assets/ambassadors/benjamin.png'
import imgFlorence from '../../assets/ambassadors/florence.jpg'
import imgFrederic from '../../assets/ambassadors/frederic.jpg'
import imgBasile from '../../assets/ambassadors/basile.jpg'
import imgMathieu from '../../assets/ambassadors/mathieu.jpg'

const AMBASSADORS = [
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
    title1: 'basileAstiTitle1',
    title2: 'basileAstiTitle2',
  },
  {
    firstName: 'Mathieu',
    lastName: 'Cerf',
    username: 'Nevjoia',
    img: imgMathieu,
    title1: 'basileAstiTitle1',
    title2: 'basileAstiTitle2',
  },
]

const AmbassadorPicture = styled.img`
  border-radius: 4em;
  margin: 0 1em;
  height: 100px;
`

const AmbassadorTextBox = styled(Box)`
  color: #0a0a0a;
  text-align: center;
  line-height: 1;
  ${fontWeight}
`

const AmbassadorText = styled.span`
  display: block;
`

/**
 * Render all CaptainFact ambassadors
 */
const AllAmbassadors = ({ t }) => {
  return (
    <Flex flexWrap="wrap" justifyContent={['center', 'left']}>
      {AMBASSADORS.map(({ firstName, lastName, title1, title2, username, img }) => (
        <Box key={firstName} mx={2}>
          <Flex flexDirection="column">
            <Link to={`/u/${username}`}>
              <AmbassadorPicture
                title={`${firstName} ${lastName}`}
                src={img}
                alt={`${firstName} ${lastName}`}
              />
              <AmbassadorTextBox mt={3} mb={2} fontWeight="bold">
                <AmbassadorText>{firstName}</AmbassadorText>
                <AmbassadorText>{lastName}</AmbassadorText>
              </AmbassadorTextBox>
              <AmbassadorTextBox mb={4}>
                <AmbassadorText>{t(`${title1}`)}</AmbassadorText>
                <AmbassadorText>{t(`${title2}`)}</AmbassadorText>
              </AmbassadorTextBox>
            </Link>
          </Flex>
        </Box>
      ))}
    </Flex>
  )
}

export default withNamespaces('home')(AllAmbassadors)
