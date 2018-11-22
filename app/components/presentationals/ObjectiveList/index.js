import React from 'react'
import PropTypes from 'prop-types'
import { ds } from './../../../styles/tokens'
import { pxTo } from "design-system-utils"
import { css } from 'emotion'
import { withTheme } from './../../smart/ThemeProvider'


const listTheme = {
  backgrounds: {
    dark: `linear-gradient(151.11deg, ${ds.get('colors.midnightDark')} -13.18%, ${ds.get('colors.midnightRegular')} 73.84%);`,
    light: `linear-gradient(151.11deg, ${ds.get('colors.whiteMedium')} -13.18%, ${ds.get('colors.white')} 73.84%);`,
  },
  shadows: {
    dark: 'shadow-mediumDark',
    light: 'shadow-mediumLight',
  },
  titleColor: {
    dark: 'text-cyanRegular',
    light: 'text-orangeRegular'
  },
  storyColor: {
    dark: 'text-purpleMedium',
    light: 'text-orangeMedium',
  },
  objectives: {
    done: {
      colors: {
        dark: 'text-grayDark'
      }
    },
    ongoing: {
      colors: {
        dark: 'text-black'
      }
    }
  },
  separator: {
    dark: 'border-midnightLightest',
    light: 'border-grayMedium'
  }
}
const ObjectiveList = (props) => {
  const  { theme, name, story, content } = props
  return <div className={`px-15 py-20 rounded-lg ${listTheme.shadows[theme]}`.concat(' ', css({
    background: listTheme.backgrounds[theme]
  }))}>
    <div className={`font-700 mb-10 ${listTheme.titleColor[theme]}`}>{name}</div>
    <div className='text-sm'>
      <p className={`mb-10 ${listTheme.storyColor[theme]}`}>
        {story}
      </p>
      <hr className={`${listTheme.separator[theme]}`} />
      <div className='mt-10'>
        {content}
      </div>
    </div>
  </div>
}

ObjectiveList.propTypes = {
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
  name: PropTypes.string.isRequired,
  story: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
}

export default withTheme(ObjectiveList)