import React from 'react'
import Joyride from 'react-joyride'
import { css } from 'emotion'
import { pxTo } from 'design-system-utils'
import { withTheme } from './../../smart/ThemeProvider'
import { ds } from './../../../styles/tokens'
import { base } from 'voca/helper/reg_exp/const';

const baseFontSize = ds.get("type.sizes.baseFontSize")
const tutorialTheme = {
  popupBackgrounds: {
    light: ds.get('colors.cyanRegular'),
    dark: ds.get('colors.orangeRegular'),
  },
  indicatorColors: {
    light: ds.get('colors.midnightLightest'),
    dark: ds.get('colors.orangeRegular'),
  },
  overlayBackgrounds: {
    light: 'rgba(255, 255, 255, 0.57)',
    dark: 'rgba(0, 0, 0, 0.57)',
  },
  colors: {
    light: ds.get('colors.midnightLightest'),
    dark: ds.get('colors.orangeDark'),
  }

}

const Tutorial = (props) => {
  const { steps, run, callback, theme } = props
  return <Joyride
    steps={steps}
    run={run}
    callback={callback}
    showProgress={true}
    showSkipButton={true}
    styles={{
      options: {
        arrowColor: 'transparent',
        backgroundColor: tutorialTheme.popupBackgrounds[theme],
        background: tutorialTheme.popupBackgrounds[theme],
        overlayColor: tutorialTheme.overlayBackgrounds[theme],
        primaryColor: tutorialTheme.indicatorColors[theme],
        textColor: tutorialTheme.colors[theme],
        width: 300,
        buttonClose: {
          display: 'none !important',
        }
      }
    }}
    locale={{ back: 'Précédent', close: 'Fermer', last: 'Dernière étape', next: 'Suivant', skip: 'Passer' }}
  />
}

export default withTheme(Tutorial)