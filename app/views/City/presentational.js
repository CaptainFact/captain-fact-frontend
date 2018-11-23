import React, { PureComponent } from 'react'
import { Link as RouterLink } from 'react-router'
import { ds } from "./../../styles/tokens"
import { pxTo } from 'design-system-utils'
import { keyframes } from 'react-emotion'
import { css } from 'emotion'
import Layout from './../Layout'
import Grid from './../../components/presentationals/Grid'
import Link from './../../components/presentationals/Link'
import Col from './../../components/presentationals/Col'
import ObjectiveBlob from './../../components/presentationals/ObjectiveBlob'
import ObjectiveList from './../../components/presentationals/ObjectiveList'
import ObjectiveTasks from './../../components/presentationals/ObjectiveTasks'
import Button from './../../components/presentationals/Button'
import Tutorial from './../../components/presentationals/Tutorial'
import { ACTIONS, EVENTS } from 'react-joyride/es/constants'
import { withTheme } from './../../components/smart/ThemeProvider'
import { withNamespaces } from 'react-i18next'
import { cell, cityDarkDarkest, cityDarkBrightest, cityLight, cityDark } from './images'

const baseFontSize = ds.get("type.sizes.baseFontSize")
const appearFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
   opacity: 1;
   transform: translateY(0);
  }
`

// Theme
const cityTheme = {
  images: {
    dark: cityDarkBrightest,
    light: cityLight,
  },
  facts: {
    labelsColor: {
      dark: 'text-lavenderRegular',
      light: 'text-orangeMedium',
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
    },
    launchTutorialButtonShadow: {
      dark: "shadow-mediumDark",
      light: "shadow-mediumLight"
    }
  }

const mapObjectivesPosition = {
  west: css({
    left: '50%',
    bottom: '25%',
  }),
  sun: css({
    right: '30%',
    top: '25%',
  }),
  port: css({
    left: '45%',
    bottom: '15%',
  })
}

class Page extends PureComponent {
    state = {
    run: false,
    showHelp: false,
    steps: [
      {
        target: '[dataTour="city"]',
        title: 'Bienvenue dans votre ville',
        content: "And Joseph [is] upon Joseph's hand; I [am] the things put frankincense thereon. Saying to pass, that only vessels of three tabernacles.",
        disableBeacon: true
      },
      {
        target: '[dataTour="city"]',
        content: " And when the law, but willingly; not of the children shall come up for they came from the land of him, from off the riders on the congregation, and given unto the earth mourn, and gave thee go, except he cometh unto them, and the sea to thee; or peril, or famine, or sit here John the truth, as dead. It was an high priest shall have in thy seed exceedingly, and I heard his mouth, thou do hurt.",
        disableBeacon: true
      },
      {
        target: '[dataTour="objective-0-blob"]',
        content: 'Objectif principal',
        placement: 'auto',
        content: " And when the law, but willingly; not of the children shall come up for they came from the land of him, from off the riders on the congregation, and given unto the earth mourn, and gave thee go, except he cometh unto them, and the sea to thee; or peril, or famine, or sit here John the truth, as dead. It was an high priest shall have in thy seed exceedingly, and I heard his mouth, thou do hurt.",
      },
      {
        target: '[dataTour="objective-0-list"]',
        content: 'Sous-objectif',
        placement: 'top',
        content: "For though I will cut it before the carrying away even among the household be afraid to drink, and preaching of whom ye should hold the head toward the three nights in Christ is able even as it hath concluded them away.",
      },
      {
        title: 'Tutoriel terminé !',
        target: '[dataTour="city"]',
        content: "Tyre and came to meet thine only that there arose and southward, and the morning were troubled me not; neither [is there] that stood afar off, as ye know nothing [that came] upon his cause the seven thin ears devoured with thirst?",
        disableBeacon: true,
      },
    ]
  }
  toggleHelpAndTutorials = () => {
    this.setState({showHelp: !this.state.showHelp })
  }

  launchPageRide = () => {
    this.setState({ run: true, showHelp: false  })
  }

  callback = (data) => {
    const { action, index, type } = data
    if (type === EVENTS.TOUR_END) {
      this.setState({ run: false })
    }
  }

  render() {
    const {reputation, theme, city, objectives, entities, ...props} = this.props
    const { steps, run } = this.state
    let image
    let userEntities ={
      ...entities,
      reputation,
    }

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
    {this.state.showHelp && this.state.run === false && <div className={`fixed`.concat(' ', css({
      right: pxTo(30, baseFontSize, 'rem'),
      bottom: pxTo(90, baseFontSize, 'rem'),
    }))}>
      <Button additionalStyles={`focus:outline-none text-left ${cityTheme.launchTutorialButtonShadow[theme]}`.concat(' ', css({
        animation: `${appearFromBottom} 350ms ease-in-out`,
        padding: `${pxTo(10, baseFontSize, 'rem')} ${pxTo(20, baseFontSize, 'rem')}`,
      }))}
        radius="xl" size="regular" outline={false} themeName='tutorial' onClick={this.launchPageRide}
      >
        <b>Lancer le tutoriel </b><span> pour cette page</span>
        <div>
          <small className='text-sm'>{this.state.steps.length} étapes</small>
        </div>
      </Button>
    </div> }
    {this.state.run === false && <div className={`fixed`.concat(' ', css({
      right: pxTo(40, baseFontSize, 'rem'),
      bottom: pxTo(40, baseFontSize, 'rem'),
    }))}>
      <Button additionalStyles={css({
        width: pxTo(40, baseFontSize, 'rem'),
        height: pxTo(40, baseFontSize, 'rem'),
      }).concat(' ', 'focus:outline-none')}
        radius="xxl" size="md" outline={true} themeName='tutorial' onClick={this.toggleHelpAndTutorials}
      >?</Button>
    </div>}


      <Tutorial
        steps={steps}
        run={run}
        callback={this.callback}
        showProgress={true}
        showSkipButton={true}
      />
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
      <Col baseWidth={8} staticStyles='relative'>
        {objectives.map((objective, index) => {
          const done = objective.tasks.filter(task => parseInt(task.goal) < parseInt(userEntities[task.entity]))
          const wip = objective.tasks.filter(task => parseInt(task.goal) >= parseInt(userEntities[task.entity]))

          return <div
            className={`absolute ${mapObjectivesPosition[objective.zone]}`.concat(' ', css({
          '&:focus-within': {
            zIndex: 5,
            '> button + div': {
            opacity: 1,
        transform: 'translate(5%, -5%)',
        zIndex: 2,
      }
      },
    }))}>
            <button dataTour={`objective-${index}-blob`} className='bg-transparent border-transparent focus:outline-none'>
              <ObjectiveBlob done={done.length === objective.tasks.length}/>
          </button>
            <div dataTour={`objective-${index}-list`} className={`opacity-0 z-n`.concat(' ', css({
            transition: 'all 250ms ease-in-out',
            transform: 'translate(0, 0)',
            maxWidth: pxTo(300, baseFontSize, "rem"),
          }))}>
            <ObjectiveList
                name={`${objective.name}: ${done.length / objective.tasks.length * 100}%`}
              story={objective.story}
                content={<ObjectiveTasks tasksDone={done} tasksWip={wip} entities={userEntities} />}
              />
          </div>
        </div>}
      )}
        <div dataTour='city'>
          {image}
        </div>
      </Col>
    </Grid>
  </Layout>
  }
}


/// export default withNamespaces('city')(withTheme(Page)) // for some reasons, i18n doesn't work
export default withTheme(Page)