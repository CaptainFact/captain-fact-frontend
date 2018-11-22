import React from 'react'
import { Link as RouterLink } from 'react-router'
import { ds } from "./../../styles/tokens"
import { pxTo } from 'design-system-utils'
import { css } from 'emotion'
import Layout from './../Layout'
import Grid from './../../components/presentationals/Grid'
import Link from './../../components/presentationals/Link'
import Col from './../../components/presentationals/Col'
import { withTheme } from './../../components/smart/ThemeProvider'
import { withNamespaces } from 'react-i18next'
import { cell, cityDarkDarkest, cityDarkBrightest, cityLight, cityDark } from './images'

const baseFontSize = ds.get("type.sizes.baseFontSize")

// Theme
const cityTheme = {
  images: {
    dark: cityDarkBrightest,
    light: cityLight,
  },
  facts: {
    labelsColor: {
      dark: 'text-lavenderRegular',
      light: 'text-brownRegular',
    },
    valuesColor: {
      dark: 'text-white',
      light: 'text-purpleDark',
    },
  },
    submenuItems: {
      defaultColor: {
        light: ds.get('colors.grayDark'),
        dark: ds.get('colors.whiteDark'),
      },
      active: {
        color: {
          dark: ds.get('colors.white'),
          light: ds.get('colors.black'),
        },
        decoration: {
          dark: ds.get('colors.lavenderRegular'),
          light: ds.get('colors.orangeLightest'),
        }
      }
    }
  }

const Page = ({reputation, theme, city, ...props}) => {
  let image
  console.log(city)
  switch(true) {
    case reputation < 150:
      image = cityDarkDarkest
    break

    case reputation >= 150 && reputation < 280:
      image = cityDark
    break

    case reputation >= 280 && reputation < 350:
      image = cityDarkBrightest
    break

    case reputation >= 351:
      image = cityTheme.images[theme]
    break
    default:
      break
  }

  const randomFacts = [
    {
      label: "Température",
      value: city.temperature,
    },
    {
      label: "Date",
      value: new Date().toLocaleDateString()
    },
    {
      label: "Heure",
      value: new Date().toLocaleTimeString()
    },
    {
      label: "Population",
      value: `${city.population} millions d'habitants`
    }
  ]

  const submenu = [
    {
      name: `Bienvenue à ${city.name}`,
      path: '/city',
    },
    {
      name: 'Journal de bord',
      path: '/diary'
    }
  ]
  return <Layout>
    <Grid staticStyles='mb-auto'>
      <Col baseWidth={4}>
        <ul className='font-700 uppercase mb-100'>
          {submenu.map(item => <li className={`my-50 relative`} key={item.path}>
            <Link
              underline={false}
              className={`block relative opacity-45 hover:opacity-100 tracking-3`.concat(' ', css({
                fontSize: `${pxTo(ds.get('type.sizes.lg'), baseFontSize, 'rem')} !important`,
                textDecoration: 'none !important',
                transition: 'all 250ms ease-in-out',
                color: `${cityTheme.submenuItems.defaultColor[theme]} !important`,
                transform: 'translateX(-7.5%)',
                '&:visited': {
                  color: `${cityTheme.submenuItems.defaultColor[theme]} !important`,
                },
                '&:hover': {
                  color: `${cityTheme.submenuItems.active.color[theme]} !important`,
                  transform: 'translateX(-2.5%)',
                },
              }))}
              activeClassName={`opacity-100`.concat(' ', css({
                fontSize: `${pxTo(ds.get('type.sizes.xl'), baseFontSize, 'rem')} !important`,
                textDecoration: 'none !important',
                transform: 'translateX(0)',
                color: `${cityTheme.submenuItems.active.color[theme]} !important`,
                '&:visited': {
                  color: `${cityTheme.submenuItems.active.color[theme]} !important`,
                },
                '&:hover': {
                  transform: 'translateX(0)',
                },
                '&::after': {
                  display: 'block',
                  content: '"  "',
                  width: '15%',
                  height: pxTo(5, baseFontSize, 'rem'),
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translate(0, -50%)',
                  backgroundColor: `${cityTheme.submenuItems.active.decoration[theme]} !important`,
                },
              }))}
              component={RouterLink}
              to={item.path}
            >
              {item.name}
              </Link>
            </li>)}
        </ul>

        {randomFacts.map(fact => <div className='mb-5' key={fact.label}>
          <span className={`underline font-700 ${cityTheme.facts.labelsColor[theme]}`}>{fact.label} :</span> <span className={`${cityTheme.facts.valuesColor[theme]}`}>{fact.value}</span>
        </div>)}

      </Col>
      <Col baseWidth={8}>
        {image}
      </Col>
    </Grid>
  </Layout>
}

/// export default withNamespaces('city')(withTheme(Page)) // for some reasons, i18n doesn't work
export default withTheme(Page)